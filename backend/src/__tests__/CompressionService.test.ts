import { describe, it, expect } from 'vitest';
import { CompressionService } from '../domain/services/CompressionService';

describe('CompressionService (Protocolo Cavernícola) - ST-04', () => {
  const compressor = new CompressionService();

  it('Test 1 (Rojo): Debe preservar intactas las líneas que representen Dudas Socráticas (terminan en ?)', () => {
    const input = 'Hola Operador, ¿cómo conectamos un FileWatcher pasivo con un Socket?';
    const output = compressor.comprimir(input);
    
    // Fallará porque el Stub devuelve '' y purga la pregunta.
    expect(output).toContain('¿cómo conectamos un FileWatcher pasivo con un Socket?');
  });

  it('Test 2 (Rojo): Debe preservar intactas las líneas que declaren código estructurado (const, function, import)', () => {
    const input = 'Te pido perdón, estuve desconcentrado. Aquí tienes el código:\nconst url = "https://ngrok.com"';
    const output = compressor.comprimir(input);
    
    // Fallará porque el Stub devuelve '' e ignora la constante dictaminada vital.
    expect(output).toContain('const url = "https://ngrok.com"');
  });
});
