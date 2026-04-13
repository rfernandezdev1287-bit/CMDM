/**
 * Entidad: ArchivoAuditado
 * Dominio: Negocio
 * 
 * Representa un archivo detectado por el búnker que requiere intercesión.
 * Según la Ley RFDEV 2.1, los atributos de negocio están en Español.
 */
export class ArchivoAuditado {
  constructor(
    public readonly ruta_absoluta: string,
    public readonly contenido_bruto: string,
    public readonly extension: string,
    public readonly fecha_deteccion: Date
  ) {}

  /**
   * Determina si el archivo es apto para la compresión cavernícola.
   */
  public esComprimible(): boolean {
    const extensionesAptas = ['.log', '.txt', '.md'];
    return extensionesAptas.includes(this.extension.toLowerCase());
  }

  /**
   * Obtiene una síntesis básica del tamaño para logs de engrama.
   */
  public obtenerMetadatos(): string {
    return `[${this.fecha_deteccion.toISOString()}] Archivo: ${this.ruta_absoluta} (${this.contenido_bruto.length} bytes)`;
  }
}
