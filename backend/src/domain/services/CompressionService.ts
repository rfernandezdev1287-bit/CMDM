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

  private readonly CAVEMAN_FILLERS = [
    /(?<=^|\s)el(?=\s|$)/gi, /(?<=^|\s)la(?=\s|$)/gi, /(?<=^|\s)los(?=\s|$)/gi, /(?<=^|\s)las(?=\s|$)/gi,
    /(?<=^|\s)un(?=\s|$)/gi, /(?<=^|\s)una(?=\s|$)/gi, /(?<=^|\s)unos(?=\s|$)/gi, /(?<=^|\s)unas(?=\s|$)/gi,
    /(?<=^|\s)está(?=\s|$)/gi, /(?<=^|\s)están(?=\s|$)/gi, /(?<=^|\s)estamos(?=\s|$)/gi, /(?<=^|\s)estoy(?=\s|$)/gi,
    /(?<=^|\s)muy(?=\s|$)/gi, /(?<=^|\s)tan(?=\s|$)/gi, /(?<=^|\s)en(?=\s|$)/gi, /(?<=^|\s)de(?=\s|$)/gi, /(?<=^|\s)del(?=\s|$)/gi,
    /(?<=^|\s)lo(?=\s|$)/gi, /(?<=^|\s)le(?=\s|$)/gi, /(?<=^|\s)les(?=\s|$)/gi
  ];

  private readonly DEDUCTION_KEYWORDS = [
    'porque', 'entonces', 'deduzco', 'infiero', 'entiendo', 'concluyo', 
    'analizo', 'observo', 'noto', 'veo'
  ];

  private readonly CODE_KEYWORDS = [
    'const ', 'let ', 'var ', 'function ', 'import ', 'export ', 'class ', 'if ', 'return '
  ];

  /**
   * Algoritmo Squeeze v3.1 (Arsenal Protect):
   * 1. Protege Código de forma absoluta dentro de bloques ARTIFACT.
   * 2. Simplifica lenguaje eliminando rellenos, pero ancla las preguntas socráticas.
   */
  public comprimir(textoCrudo: string): string {
    if (!textoCrudo) return '';
    
    const lineas = textoCrudo.split('\n');
    let isInArtifactBlock = false;

    const filtrado = lineas
      .map(linea => {
        const procesadaOriginal = linea;
        let procesadaTrimmed = linea.trim();
        if (!procesadaTrimmed) return null;

        // --- NIVEL 0: PROTECCIÓN DE ARSENAL (Bypass Absoluto) ---
        if (procesadaTrimmed.startsWith('<<< ARTIFACT:')) {
          isInArtifactBlock = true;
          return procesadaOriginal;
        }
        if (procesadaTrimmed.startsWith('<<< END ARTIFACT >>>')) {
          isInArtifactBlock = false;
          return procesadaOriginal;
        }
        if (isInArtifactBlock) {
          return procesadaOriginal; // Preservamos indentación y contenido técnico
        }
        
        // --- NIVEL 1: PROTECCIÓN DE CÓDIGO (Lógica de Logs) ---
        const esCodigo = this.CODE_KEYWORDS.some(k => procesadaTrimmed.startsWith(k)) || 
                         procesadaTrimmed.startsWith('{') || procesadaTrimmed.startsWith('}');
        if (esCodigo) return procesadaTrimmed;

        // --- NIVEL 2: FILTRADO CAVERNÍCOLA (Squeezing) ---
        let finalStr = procesadaTrimmed;
        
        // A. Limpieza de Ruido Explícito (Saludos/Cortesías)
        this.NOISE_PATTERNS.forEach(p => { finalStr = finalStr.replace(p, ''); });

        // B. Simplificación de Rellenos (Caveman)
        const partes = finalStr.split(/([¿?])/);
        finalStr = partes.map(parte => {
          if (parte === '¿' || parte === '?') return parte;
          const esSegmentoPregunta = finalStr.indexOf('¿' + parte + '?') !== -1;
          if (esSegmentoPregunta) return parte;

          let fragmento = parte;
          this.CAVEMAN_FILLERS.forEach(p => { fragmento = fragmento.replace(p, ''); });
          return fragmento;
        }).join('');

        return finalStr.replace(/^[,\s.]+/, '').replace(/[,\s.]+$/, '').replace(/\s+/g, ' ').trim();
      })
      .filter(l => l !== null && l !== '');

    return filtrado.join('\n');
  }
}
