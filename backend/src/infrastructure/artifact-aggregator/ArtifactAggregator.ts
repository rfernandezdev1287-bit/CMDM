import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * ArtifactAggregator - Infrastructure Layer
 * Responsable de la recolección física de archivos modificados 
 * para construir el contexto del engrama y auditoría final.
 */
export class ArtifactAggregator {
  private readonly EXCLUSIONS = ['node_modules', '.git', 'dist', '.next', 'coverage'];
  private readonly WHITELIST = ['.ts', '.tsx', '.js', '.jsx', '.md', '.json', '.mjs'];

  constructor(private readonly rootPath: string) {}

  /**
   * Recolecta archivos modificados registrados por Git (uncommitted changes).
   */
  public recolectarArtefactos(): string {
    const resultados: string[] = [];
    
    try {
      // Usar git status --porcelain para obtener cambios atómicos (M, A, R)
      const statusOutput = execSync('git status --porcelain', { cwd: this.rootPath }).toString();
      const lines = statusOutput.split('\n');

      for (const line of lines) {
        if (!line.trim()) continue;
        
        // El path es el segmento que sigue al estado (ej: "M src/app.ts")
        const relPath = line.substring(3).trim();
        const fullPath = path.join(this.rootPath, relPath);
        const extension = path.extname(relPath).toLowerCase();

        if (this.WHITELIST.includes(extension) && fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
          const contenido = fs.readFileSync(fullPath, 'utf8');
          
          resultados.push(`\n<<< ARTIFACT: ${relPath} >>>`);
          resultados.push(contenido);
          resultados.push(`<<< END ARTIFACT >>>`);
        }
      }
    } catch (error) {
      console.error(`[CMDM Aggregator Error]: Falla al consultar Git -> ${error}`);
      return 'Error: No se pudo recolectar artefactos vía Git.';
    }

    return resultados.join('\n');
  }

  /**
   * Recolecta archivos modificados en los últimos N segundos (Modo Legacy/Watcher).
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
          const extension = path.extname(fullPath).toLowerCase();
          if (!this.WHITELIST.includes(extension)) continue;

          const contenido = fs.readFileSync(fullPath, 'utf8');
          const relPath = path.relative(this.rootPath, fullPath);
          
          resultados.push(`\n<<< ARTIFACT: ${relPath} >>>`);
          resultados.push(contenido);
          resultados.push(`<<< END ARTIFACT >>>`);
        }
      }
    }
  }
}
