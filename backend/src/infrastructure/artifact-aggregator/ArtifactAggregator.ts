import fs from 'fs';
import path from 'path';

/**
 * ArtifactAggregator - Infrastructure Layer
 * Responsable de la recolección física de archivos modificados 
 * para construir el contexto del engrama.
 */
export class ArtifactAggregator {
  private readonly EXCLUSIONS = ['node_modules', '.git', 'dist', '.next', 'coverage'];

  constructor(private readonly rootPath: string) {}

  /**
   * Recolecta archivos modificados en los últimos N segundos.
   */
  public recolectarRecientes(segundos: number = 60): string {
    const ahora = Date.now();
    const resultados: string[] = [];
    
    this.escanearRecursivo(this.rootPath, ahora, segundos, resultados);
    
    return resultados.join('\n\n');
  }

  private escanearRecursivo(dir: string, ahora: number, segundos: number, resultados: string[]): void {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      if (this.EXCLUSIONS.includes(item)) continue;

      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        this.escanearRecursivo(fullPath, ahora, segundos, resultados);
      } else if (stats.isFile()) {
        const diffMs = ahora - stats.mtimeMs;
        if (diffMs <= segundos * 1000) {
          const contenido = fs.readFileSync(fullPath, 'utf8');
          const relPath = path.relative(this.rootPath, fullPath);
          
          resultados.push(`--- ARCHIVO: ${relPath} ---`);
          resultados.push(contenido);
          resultados.push(`--- FIN DE ${relPath} ---`);
        }
      }
    }
  }
}
