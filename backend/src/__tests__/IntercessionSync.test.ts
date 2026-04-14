import { describe, test, expect, vi, beforeEach } from 'vitest';
import { IntercessionService } from '../../application/services/IntercessionService';
import * as fs from 'fs';
import { Server, Socket } from 'socket.io';

vi.mock('fs');

describe('IntercessionService Handshake (ST-08.0)', () => {
  let service: IntercessionService;
  let mockSocket: any;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new IntercessionService();
    mockSocket = {
      emit: vi.fn(),
    };
  });

  test('Debe sincronizar exactamente las últimas 10 líneas (5 pares) del historial', () => {
    const historyContent = Array.from({ length: 20 }, (_, i) => `Línea ${i + 1}`).join('\n');
    
    // Simulamos que el archivo existe
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(historyContent);

    // Ejecutamos la sincronía inicial
    service.handleInitialSync(mockSocket as any);

    // Verificamos que se emitió el evento con el contenido correcto
    expect(mockSocket.emit).toHaveBeenCalledWith('bunker_update', expect.objectContaining({
      content: expect.any(String)
    }));

    const emittedContent = mockSocket.emit.mock.calls[0][1].content;
    const lines = emittedContent.split('\n').filter((l: string) => !!l.trim());
    
    // Certificación de Sello Gold ST-08.0: 10 líneas
    expect(lines.length).toBe(10);
    expect(lines[0]).toBe('Línea 11');
    expect(lines[9]).toBe('Línea 20');
  });
});
