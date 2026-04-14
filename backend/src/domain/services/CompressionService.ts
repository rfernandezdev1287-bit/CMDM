export class CompressionService {
  private readonly NOISE_PATTERNS = [
    /hola(.*?)(operador|equipo|todos)?/gi,
    /buen(as|os)? (días|tardes|noches)/gi,
    /gracias(.*?)(por|de antemano)?/gi,
    /por favor/gi,
    /disculpa(.*?)(la molestia)?/gi,
    /perdón/gi,
    /básicamente/gi,
    /en realidad/gi
  ];

  private readonly DEDUCTION_PATTERNS = [
    /deduzco/gi, /infiero/gi, /entiendo/gi, /concluyo/gi, 
    /analizo/gi, /observo/gi, /noto/gi, /veo/gi
  ];

  private readonly CODE_KEYWORDS = [
    'const ', 'let ', 'var ', 'function ', 'import ', 'export ', 'class ', 'if ', 'return '
  ];

  /**
   * Algoritmo Squeeze Refinado (v2): Elimina ruido verbal explícito.
   * Estrategia de Lista Negra: Si no es ruido, es soberano y se preserva.
   */
  public comprimir(textoCrudo: string): string {
    if (!textoCrudo) return '';
    
    const lineas = textoCrudo.split('\n');
    const filtrado = lineas
      .map(linea => {
        let procesada = linea.trim();
        if (!procesada) return null;
        
        // 1. Preservación Directa de Código (Optimización de CPU)
        const esCodigo = this.CODE_KEYWORDS.some(k => procesada.startsWith(k)) || 
                         procesada.startsWith('{') || procesada.startsWith('}');
        
        if (esCodigo) return procesada;

        // 2. Detección de Ruido Verbal (Blacklist)
        const esRuidoPuro = this.NOISE_PATTERNS.some(p => {
          // Si el ruido ocupa casi toda la línea, es ruido.
          const match = procesada.match(p);
          return match && match[0].length > procesada.length * 0.8;
        });

        if (esRuidoPuro) return null;

        // 3. Limpieza de micro-ruido en líneas de valor
        this.NOISE_PATTERNS.forEach(p => {
          procesada = procesada.replace(p, '');
        });

        return procesada.replace(/^[,.\s]+|[,.\s]+$/g, '').trim();
      })
      .filter(l => l !== null && l !== '');

    return filtrado.join('\n');
  }

}
