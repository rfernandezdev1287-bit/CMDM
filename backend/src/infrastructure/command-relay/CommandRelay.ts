import fs from 'fs';
import path from 'path';

/**
 * CommandRelay - Infrastructure Layer
 * Responsable de materializar las órdenes recibidas por el socket en el disco.
 * Esto permite que la IA (Antigravity/Carpenter) detecte la intención físicamente.
 */
export class CommandRelay {
  private readonly commandsLogPath: string;

  constructor() {
    this.commandsLogPath = path.resolve(process.cwd(), '.agent/commands.log');
    this.inicializarLog();
  }

  private inicializarLog(): void {
    const dir = path.dirname(this.commandsLogPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Escribe una nueva orden en el log persistente.
   * Agrega un timestamp y el texto de la acción.
   */
  public registrarOrden(texto: string, socketId: string): void {
    const timestamp = new Date().toISOString();
    const entrada = `[${timestamp}] [Socket: ${socketId}] REQUERIMIENTO: ${texto}\n`;
    
    try {
      fs.appendFileSync(this.commandsLogPath, entrada, 'utf8');
      console.log(`[CMDM CommandRelay]: Orden materializada físicamente en .agent/commands.log`);
    } catch (error) {
      console.error(`[CMDM CommandRelay Error]: Falla al escribir orden -> ${error}`);
    }
  }

  /**
   * Lee las últimas N órdenes del log.
   */
  public obtenerUltimasOrdenes(limit: number = 5): string[] {
    try {
      if (!fs.existsSync(this.commandsLogPath)) return [];
      const content = fs.readFileSync(this.commandsLogPath, 'utf8');
      return content.split('\n').filter(l => !!l).slice(-limit);
    } catch {
      return [];
    }
  }
}
