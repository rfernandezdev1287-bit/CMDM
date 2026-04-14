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
        
        // Protocolo ST-09.0: Dualidad de Eco (Unicast Táctico)
        // 1. Ack de Intercepción (Eco Táctico)
        socket.emit('bunker_response', { 
          text: `Orden interceptada por el búnker de mando: "${data.text}"` 
        });

        // 2. Ejec de Materialización
        socket.emit('bunker_response', { 
          text: `Orden materializada físicamente. Procediendo a la ejecución lógica.` 
        });
      });
    });
  }

  private handleInitialSync(socket: Socket): void {
    // Trazabilidad de rutas: Priorizar el ESPEJO (mirror.md) sobre el historial técnico
    const pathsToTry = [
      path.resolve(process.cwd(), '.agent/engram/mirror.md'),
      path.resolve(process.cwd(), '../.agent/engram/mirror.md'),
      path.resolve(process.cwd(), '.agent/engram/session_history.md'),
    ];

    let historyContent = 'Bienvenidos al CMDM. Iniciando sesión de mando...';
    let found = false;

    try {
      for (const historyPath of pathsToTry) {
        if (fs.existsSync(historyPath)) {
          const fullContent = fs.readFileSync(historyPath, 'utf8');
          const lines = fullContent.split('\n').filter(l => !!l.trim());
          if (lines.length > 0) {
            // ST-08.0: AJUSTE DE PROFUNDIDAD - 10 líneas (5 pares tácitos)
            // Se reduce la saturación inicial reportada por el Operador.
            historyContent = lines.slice(-10).join('\n'); 
            found = true;
            break;
          }
        }
      }
    } catch (error) {
      console.error(`[CMDM Handshake Error]: Falla catastrófica en lectura espejo -> ${error}`);
    } finally {
      socket.emit('bunker_update', {
        content: historyContent,
        timestamp: new Date(),
        status: found ? 'synchronized' : 'empty'
      });
      console.log(`[CMDM Handshake]: Espejo sincronizado (${found ? 'CON DATOS' : 'SIN DATOS'})`);
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

  private handleCaptureRequest(socket: Socket, seconds: number): void {
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
