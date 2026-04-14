import { describe, it, expect } from 'vitest';
import { CompressionService } from '../domain/services/CompressionService';

describe('CompressionService (Protocolo Cavernícola) - ST-04', () => {
  const compressor = new CompressionService();

  it('Squeeze-01: Debe remover saludos y cortesías, pero mantener la pregunta adjunta', () => {
    const input = 'Hola Operador, gracias por el aviso. ¿Cómo conectamos el FileWatcher?';
    const output = compressor.comprimir(input);
    
    expect(output).not.toContain('Hola Operador');
    expect(output).not.toContain('gracias por el aviso');
    expect(output).toContain('¿Cómo conectamos el FileWatcher?');
  });

  it('Squeeze-02: Debe preservar líneas con verbos de deducción (Cerebro de Intercesión)', () => {
    const input = 'Observo que el puerto está ocupado. Deduzco que hay un proceso zombi.';
    const output = compressor.comprimir(input);
    
    expect(output).toContain('Observo que el puerto está ocupado');
    expect(output).toContain('Deduzco que hay un proceso zombi');
  });

  it('Squeeze-03: Debe blindar cualquier línea de código (import, const, class, etc.)', () => {
    const input = 'Disculpa la molestia, aquí tienes el repo:\nimport axios from "axios";\nclass Búnker {}';
    const output = compressor.comprimir(input);
    
    expect(output).not.toContain('Disculpa la molestia');
    expect(output).toContain('import axios from "axios"');
    expect(output).toContain('class Búnker {}');
  });

  it('Squeeze-04: Debe limpiar redundancias y espacios vacíos excesivos', () => {
    const input = 'Básicamente en realidad lo que pasa es que...\n\n\n¿Qué procedemos?';
    const output = compressor.comprimir(input);
    
    const lines = output.split('\n');
    expect(lines.length).toBeLessThan(4);
    expect(output).toContain('¿Qué procedemos?');
  });

  it('Squeeze-05: Debe permitir observaciones socráticas e hitos humanos (La IA estuvo aquí)', () => {
    const input = 'La IA estuvo aquí, prueba final búnker.\nMisión en curso.';
    const output = compressor.comprimir(input);
    
    expect(output).toContain('La IA estuvo aquí, prueba final búnker');
    expect(output).toContain('Misión en curso');
  });
});

