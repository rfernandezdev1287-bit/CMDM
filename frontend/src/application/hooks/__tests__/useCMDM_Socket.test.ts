import { expect, test, describe, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCMDM_Socket } from '../useCMDM_Socket';
import { io } from 'socket.io-client';

// Mocking la factoría WS para evitar conexiones reales en los tests
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    current: null
  }))
}));

describe('useCMDM_Socket Security Protocol (ST-03.3)', () => {
  test('Debe escalar la conexión de http:// a https:// forzadamente bajo contextos Mixed Content (Ngrok)', () => {
    // 1. Spoofing estructural: Forzamos HTTPS en el BOM
    Object.defineProperty(window, 'location', {
      value: { protocol: 'https:' },
      writable: true
    });
    
    // 2. Inyección de entorno vulnerable: Simular IP de LAN en HTTP crudo
    vi.stubEnv('VITE_BACKEND_URL', 'http://192.168.0.3:9000');

    // 3. Ejecución Aislada del Nodo de Comunicación
    renderHook(() => useCMDM_Socket());

    // 4. Verificación Arquitectónica ROJA:
    // El sistema exige que, bajo alerta de Mixed Content, la llamada a IO mute y envuelva mediante wss/https.
    // Como el código real fue despojado de esta armadura, el test colapsará (Sangre Roja).
    expect(io).toHaveBeenCalledWith('https://192.168.0.3:9000', expect.any(Object));
  });
});
