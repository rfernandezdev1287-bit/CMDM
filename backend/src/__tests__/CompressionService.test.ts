import { describe, it, expect } from 'vitest';
import { CompressionService } from '../domain/services/CompressionService';

describe('CompressionService (Protocolo Cavernícola) - ST-05', () => {
  const compressor = new CompressionService();

  it('Squeeze-01: Debe remover saludos y cortesías (CAVEMAN)', () => {
    const input = 'Hola Operador, gracias por el aviso. ¿Cómo conectamos el FileWatcher?';
    const output = compressor.comprimir(input);
    
    expect(output).not.toContain('Hola Operador');
    expect(output).not.toContain('gracias');
    // Mantiene la pregunta intacta por Fidelidad Socrática
    expect(output).toContain('¿Cómo conectamos el FileWatcher?');
  });

  it('Squeeze-02: Debe preservar semántica de deducción simplificada', () => {
    const input = 'Observo que el puerto está ocupado. Deduzco que hay un proceso zombi.';
    const output = compressor.comprimir(input);
    
    // "quedan los conceptos, se van los nexos"
    expect(output).toContain('Observo que puerto ocupado');
    expect(output).toContain('Deduzco que hay proceso zombi');
  });

  it('Squeeze-03: Debe blindar cualquier línea de código intacta', () => {
    const input = 'Disculpa la molestia, aquí tienes el repo:\nimport axios from "axios";\nclass Búnker {}';
    const output = compressor.comprimir(input);
    
    expect(output).not.toContain('Disculpa la molestia');
    expect(output).toContain('import axios from "axios"');
    expect(output).toContain('class Búnker {}');
  });

  it('Squeeze-04: Debe limpiar redundancias y espacios excesivos', () => {
    const input = 'Básicamente en realidad lo que pasa es que...\n\n\n¿Qué procedemos?';
    const output = compressor.comprimir(input);
    
    expect(output).toContain('¿Qué procedemos?');
    // No debe haber líneas vacías
    expect(output.split('\n').every(l => l.trim() !== '')).toBe(true);
  });

  it('Squeeze-05: Debe permitir observaciones socráticas e hitos humanos (CAVEMAN)', () => {
    const input = 'La IA estuvo aquí, prueba final búnker.\nMisión en curso.';
    const output = compressor.comprimir(input);
    
    expect(output).toContain('IA estuvo aquí, prueba final búnker');
    expect(output).toContain('Misión curso');
  });

  it('Squeeze-06: Protocolo Cavernícola v3 - Mezcla Afirmación + Pregunta', () => {
    const input = 'El sistema está en un estado muy inestable porque la base de datos no está respondiendo. ¿Podemos reiniciar el servicio ahora mismo?';
    const output = compressor.comprimir(input);
    
    // Simplifica afirmación
    expect(output).toContain('sistema estado inestable porque base datos no respondiendo');
    // Mantiene pregunta
    expect(output).toContain('¿Podemos reiniciar el servicio ahora mismo?');
  });
});
