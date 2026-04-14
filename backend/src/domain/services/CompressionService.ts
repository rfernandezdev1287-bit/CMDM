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
   * Algoritmo Squeeze v3 (Caveman Port):
   * 1. Protege Código de forma absoluta.
   * 2. Simplifica lenguaje eliminando rellenos, pero ancla las preguntas socráticas.
   */
  public comprimir(textoCrudo: string): string {
    if (!textoCrudo) return '';
    
    const lineas = textoCrudo.split('\n');
    const filtrado = lineas
      .map(linea => {
        let procesada = linea.trim();
        if (!procesada) return null;
        
        // --- NIVEL 1: PROTECCIÓN DE CÓDIGO ---
        const esCodigo = this.CODE_KEYWORDS.some(k => procesada.startsWith(k)) || 
                         procesada.startsWith('{') || procesada.startsWith('}');
        if (esCodigo) return procesada;

        // --- NIVEL 2: FILTRADO CAVERNÍCOLA (Squeezing) ---
        
        // A. Limpieza de Ruido Explícito (Saludos/Cortesías)
        this.NOISE_PATTERNS.forEach(p => { procesada = procesada.replace(p, ''); });

        // B. Simplificación de Rellenos (Caveman)
        // Aplicamos a todo lo que no sea código, pero si hay una pregunta (?),
        // intentamos simplificar la parte no-pregunta o ser cuidadosos.
        // Por rigor socrático: si la línea es puramente una pregunta, la dejamos.
        // Si es una mezcla (afirmación + pregunta), simplificamos la afirmación.
        
        const partes = procesada.split(/([¿?])/); // Dividir por signos de interrogación
        procesada = partes.map(parte => {
          if (parte === '¿' || parte === '?') return parte;
          // Si es un segmento de pregunta (entre ¿ y ?), lo preservamos más
          const esSegmentoPregunta = procesada.indexOf('¿' + parte + '?') !== -1;
          
          if (esSegmentoPregunta) return parte;

          // Simplificación agressiva de fragmentos informativos
          let fragmento = parte;
          this.CAVEMAN_FILLERS.forEach(p => { fragmento = fragmento.replace(p, ''); });
          return fragmento;
        }).join('');

        return procesada.replace(/^[,\s.]+/, '').replace(/[,\s.]+$/, '').replace(/\s+/g, ' ').trim();
      })
      .filter(l => l !== null && l !== '');

    return filtrado.join('\n');
  }
}
