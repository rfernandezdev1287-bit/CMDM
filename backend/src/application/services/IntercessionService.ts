import { FileWatcher } from '../../infrastructure/file-watcher/FileWatcher';
import { ArchivoAuditado } from '../../domain/entities/ArchivoAuditado';
import { ArtifactAggregator } from '../../infrastructure/artifact-aggregator/ArtifactAggregator';
import path from 'path';

import { Server, Socket } from 'socket.io';
import { CompressionService } from '../../domain/services/CompressionService';
import { AuditService } from './AuditService';
import { CommandRelay } from '../../infrastructure/command-relay/CommandRelay';
import fs from 'fs';

/**
 * IntercessionService - Application Layer
 * Orquestador principal del flujo: 
 * Infraestructura (Raw Data) -> Dominio (ArchivoAuditado) -> UI/Engrama.
 */
export class IntercessionService {
  private watcher: FileWatcher;
  private compressor = new CompressionService();
  private aggregator: ArtifactAggregator;
  private auditService = new AuditService();
  private commandRelay = new CommandRelay();

  constructor(
    private readonly targetPath: string,
    private readonly io: Server
  ) {
    this.watcher = new FileWatcher(this.targetPath);
    this.aggregator = new ArtifactAggregator(this.targetPath);
    this.setupListeners();
  }

  private setupListeners(): void {
    this.watcher.on('file:changed', (rawData: { path: string, content: string, timestamp: Date }) => {
      console.log(`[CMDM Aplicación]: Cambio recibido desde el Watcher -> ${rawData.path}`);
      this.handleFileDetección(rawData);
    });

    this.watcher.on('watcher:error', (error: Error) => {
      console.error(`[CMDM Búnker Error]: ${error.message}`);
    });

    // Listener Global de Sockets para el Servicio
    this.io.on('connection', (socket) => {
      // T-44: Handshake Quirúrgico (Últimas 3 interacciones)
      this.handleInitialSync(socket);

      socket.on('request_capture', (data: { seconds?: number }) => {
        this.handleCaptureRequest(socket, data.seconds || 60);
      });

      // T-50: Consolidación de Artefactos Pro-Auditoría
      socket.on('request_audit_bundle', () => {
        this.handleAuditBundleRequest(socket);
      });

      // T-43: Recibir Órdenes del Operador
      socket.on('operador_command', (data: { text: string }) => {
        console.log(`[CMDM Intercesión]: Orden recibida -> "${data.text}"`);
        this.commandRelay.registrarOrden(data.text, socket.id);
        
        // Eco táctico
        this.io.emit('bunker_response', { 
          text: `Orden materializada físicamente. Procediendo a la ejecución lógica.` 
        });
      });
    });
  }

  private handleInitialSync(socket: Socket): void {
    const historyPath = path.resolve(process.cwd(), '.agent/engram/session_history.md');
    try {
      if (fs.existsSync(historyPath)) {
        const fullContent = fs.readFileSync(historyPath, 'utf8');
        const lines = fullContent.split('\n').filter(l => !!l.trim());
        const last3Interactions = lines.slice(-3).join('\n');

        socket.emit('bunker_update', {
          content: last3Interactions,
          timestamp: new Date()
        });
        console.log(`[CMDM Handshake]: Sincronía inicial enviada (${socket.id})`);
      }
    } catch (error) {
      console.error(`[CMDM Handshake Error]: Falla al leer historial -> ${error}`);
    }
  }

  private handleAuditBundleRequest(socket: Socket): void {
    console.log(`[CMDM Intercesión]: Consolidación de arsenal solicitada.`);
    const bundle = this.aggregator.recolectarArtefactos();
    const squeezedBundle = this.compressor.comprimir(bundle);

    socket.emit('audit_bundle_ready', {
      content: squeezedBundle,
      timestamp: new Date()
    });
  }

  private handleCaptureRequest(socket: any, seconds: number): void {
    console.log(`[CMDM Intercesión]: Captura de contexto solicitada (${seconds}s)`);
    
    // 1. Recolectar Físicamente
    const contextRaw = this.aggregator.recolectarRecientes(seconds);
    
    // 2. Aplicar Algoritmo Squeeze (ST-04)
    const contextSqueezed = this.compressor.comprimir(contextRaw);
    
    // 3. Emitir el Artefacto Final
    socket.emit('context_captured', {
      content: contextSqueezed,
      timestamp: new Date()
    });
  }

  /**
   * Mapea el Raw Data de infraestructura a una Entidad de Dominio.
   */
  private handleFileDetección(rawData: { path: string, content: string, timestamp: Date }): void {
    const extension = path.extname(rawData.path);
    
    // Creación de la Entidad de Dominio (Garantía de Regla de Negocio)
    const archivoActualizado = new ArchivoAuditado(
      rawData.path,
      rawData.content,
      extension,
      rawData.timestamp
    );

    console.log(`[CMDM Trazabilidad]: ${archivoActualizado.obtenerMetadatos()}`);
    
    // El Cerebro (ST-04): Compresión de Válvulas Verbales antes de Enviar
    const dataFiltrada = this.compressor.comprimir(archivoActualizado.contenido_bruto);
    
    // T-47: Firmado de cambio si es por la IA (en este flujo, asumimos IA si viene del Watcher de arsenal)
    // En el futuro, esto se granularizará más.
    this.auditService.registrarCambio(path.relative(this.targetPath, rawData.path), rawData.content);

    console.log(`[CMDM Intercesión]: Data filtrada tras Squeeze (length: ${dataFiltrada.length})`);

    if (dataFiltrada) {
      console.log(`[CMDM Socket]: Emitiendo bunker_stream para ${archivoActualizado.obtenerMetadatos()}`);
      this.io.emit('bunker_stream', {
        tipo: 'engrama',
        archivo: archivoActualizado.obtenerMetadatos(),
        output_procesado: dataFiltrada
      });
    } else {
      console.warn(`[CMDM Intercesión]: Abortando emisión - Squeeze devolvió vacío.`);
    }
  }

  public iniciarVigilancia(): void {
    this.watcher.start();
    console.log(`[CMDM Búnker]: Vigilancia iniciada en ${this.targetPath}`);
  }

  public detenerVigilancia(): void {
    this.watcher.stop();
  }
}
