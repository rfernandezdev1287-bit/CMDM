import { FileWatcher } from '../../infrastructure/file-watcher/FileWatcher';
import { ArchivoAuditado } from '../../domain/entities/ArchivoAuditado';
import { ArtifactAggregator } from '../../infrastructure/artifact-aggregator/ArtifactAggregator';
import path from 'path';

import { Server } from 'socket.io';
import { CompressionService } from '../../domain/services/CompressionService';

/**
 * IntercessionService - Application Layer
 * Orquestador principal del flujo: 
 * Infraestructura (Raw Data) -> Dominio (ArchivoAuditado) -> UI/Engrama.
 */
export class IntercessionService {
  private watcher: FileWatcher;
  private compressor = new CompressionService();
  private aggregator: ArtifactAggregator;

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
      socket.on('request_capture', (data: { seconds?: number }) => {
        this.handleCaptureRequest(socket, data.seconds || 60);
      });
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
