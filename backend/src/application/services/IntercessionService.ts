import { FileWatcher } from '../../infrastructure/file-watcher/FileWatcher';
import { ArchivoAuditado } from '../../domain/entities/ArchivoAuditado';
import path from 'path';

/**
 * IntercessionService - Application Layer
 * Orquestador principal del flujo: 
 * Infraestructura (Raw Data) -> Dominio (ArchivoAuditado) -> UI/Engrama.
 */
export class IntercessionService {
  private watcher: FileWatcher;

  constructor(private readonly targetPath: string) {
    this.watcher = new FileWatcher(this.targetPath);
    this.setupListeners();
  }

  private setupListeners(): void {
    this.watcher.on('file:changed', (rawData: { path: string, content: string, timestamp: Date }) => {
      this.handleFileDetección(rawData);
    });

    this.watcher.on('watcher:error', (error: Error) => {
      console.error(`[CMDM Búnker Error]: ${error.message}`);
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
    
    // Aquí se dispararía la lógica de persistencia en Engrama o 
    // el envío vía Sockets al móvil (Módulo ST-02).
  }

  public iniciarVigilancia(): void {
    this.watcher.start();
    console.log(`[CMDM Búnker]: Vigilancia iniciada en ${this.targetPath}`);
  }

  public detenerVigilancia(): void {
    this.watcher.stop();
  }
}
