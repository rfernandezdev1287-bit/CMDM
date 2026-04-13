import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';

/**
 * FileWatcher - Infrastructure Layer
 * Responsable de la vigilancia física de archivos y emisión de Raw Data.
 * 
 * Cumple con RNF-01 (Latencia < 500ms) mediante Chokidar.
 * Cumple con RNF-02 (Bajo consumo) mediante Whitelist y exclusiones.
 */
export class FileWatcher extends EventEmitter {
  private watcher: chokidar.FSWatcher | null = null;
  private readonly whitelist = ['.md', '.log', '.txt', '.json'];
  private readonly ignoredPaths = [/node_modules/, /\.git/, /dist/, /build/];

  constructor(private readonly targetPath: string) {
    super();
    this.validarPath(targetPath);
  }

  private validarPath(targetPath: string): void {
    if (!fs.existsSync(targetPath)) {
      throw new Error('El path especificado no existe');
    }
  }

  public getPath(): string {
    return this.targetPath;
  }

  /**
   * Inicia la vigilancia de archivos.
   * Emite eventos 'change' con el path y el contenido bruto (Raw Data).
   */
  public start(): void {
    this.watcher = chokidar.watch(this.targetPath, {
      ignored: (pathStr, stats) => {
        // Ignorar directorios de ruido
        if (this.ignoredPaths.some(regex => regex.test(pathStr))) return true;
        
        // Si es un archivo, verificar contra whitelist
        if (stats?.isFile()) {
           const ext = path.extname(pathStr).toLowerCase();
           return !this.whitelist.includes(ext);
        }
        
        return false;
      },
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100
      }
    });

    this.watcher.on('change', (pathStr: string) => {
      this.handleFileChange(pathStr);
    });

    this.watcher.on('error', (error) => {
      this.emit('watcher:error', error);
    });
  }

  private handleFileChange(pathStr: string): void {
    try {
      // Lectura física del dato bruto (Raw Data)
      const data = fs.readFileSync(pathStr, 'utf-8');
      
      // Emisión hacia la capa de aplicación
      this.emit('file:changed', {
        path: pathStr,
        content: data,
        timestamp: new Date()
      });
    } catch (err) {
      this.emit('watcher:error', err);
    }
  }

  public stop(): void {
    if (this.watcher) {
      this.watcher.close();
    }
  }
}
