export class CompressionService {
  /**
   * Elimina texto irrelevante, conservando dudas socráticas
   * y sentencias de código estructurales.
   */
  public comprimir(textoCrudo: string): string {
    if (!textoCrudo) return '';
    
    const lineas = textoCrudo.split('\n');
    const filtrado = lineas.filter(l => {
      const lineaLimpiada = l.trim();
      if (!lineaLimpiada) return false;
      
      // Regla Crítica 1: Dudas Socráticas
      if (lineaLimpiada.endsWith('?')) return true;
      
      // Regla Crítica 2: Estructuras Orgánicas (Código)
      if (lineaLimpiada.startsWith('const ') || 
          lineaLimpiada.startsWith('let ') ||
          lineaLimpiada.startsWith('var ') ||
          lineaLimpiada.startsWith('function ') ||
          lineaLimpiada.startsWith('import ')) {
        return true;
      }
      
      return false;
    });

    return filtrado.join('\n');
  }
}
