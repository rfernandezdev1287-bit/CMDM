import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * AuditService - Application Layer
 * Responsable de firmar y persistir el historial de cambios de la IA.
 * Permite al ArtifactAggregator diferenciar la autoría (IA vs Humano).
 */
export class AuditService {
  private readonly auditPath: string;

  constructor() {
    this.auditPath = path.resolve(process.cwd(), '.agent/audit.json');
    this.inicializarAudit();
  }

  private inicializarAudit(): void {
    const dir = path.dirname(this.auditPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.auditPath)) {
      fs.writeFileSync(this.auditPath, JSON.stringify({ files: [] }, null, 2));
    }
  }

  /**
   * Registra una edición en el manifiesto de auditoría.
   */
  public registrarCambio(relPath: string, contenido: string): void {
    try {
      const data = JSON.parse(fs.readFileSync(this.auditPath, 'utf8'));
      const hash = crypto.createHash('sha256').update(contenido).digest('hex');
      
      const registroIndex = data.files.findIndex((f: any) => f.path === relPath);
      const nuevoRegistro = {
        path: relPath,
        hash: hash,
        timestamp: new Date().toISOString(),
        author: 'AI'
      };

      if (registroIndex >= 0) {
        data.files[registroIndex] = nuevoRegistro;
      } else {
        data.files.push(nuevoRegistro);
      }

      fs.writeFileSync(this.auditPath, JSON.stringify(data, null, 2));
      console.log(`[CMDM Auditoría]: Cambio firmado para ${relPath}`);
    } catch (error) {
      console.error(`[CMDM Auditoría Error]: No se pudo registrar cambio -> ${error}`);
    }
  }

  /**
   * Valida si un archivo actual coincide con la firma de la IA.
   */
  public esCambioIA(relPath: string, contenidoActual: string): boolean {
    try {
      const data = JSON.parse(fs.readFileSync(this.auditPath, 'utf8'));
      const registro = data.files.find((f: any) => f.path === relPath);
      
      if (!registro) return false;

      const hashActual = crypto.createHash('sha256').update(contenidoActual).digest('hex');
      return registro.hash === hashActual;
    } catch {
      return false;
    }
  }
}
