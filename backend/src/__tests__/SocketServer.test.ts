import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { SocketServer } from '../infrastructure/socket-server/SocketServer';
import { io as Client, Socket } from 'socket.io-client';

describe('SocketServer Protocol (ST-05)', () => {
  let socketServer: SocketServer;
  let clientSocket: Socket;
  const PORT = 9001; // Usamos un puerto diferente al de prod para no chocar

  beforeAll(async () => {
    socketServer = new SocketServer();
    socketServer.start(PORT);

    // Conectamos un cliente de prueba
    clientSocket = Client(`http://localhost:${PORT}`, {
      extraHeaders: {
        "ngrok-skip-browser-warning": "69420"
      }
    });

    await new Promise<void>((resolve) => {
      clientSocket.on('connect', () => {
        resolve();
      });
    });
  });

  afterAll(() => {
    clientSocket.disconnect();
    // En Vitest, httpServer.close es sincrónico pero le damos un tick para liberar el puerto
    socketServer['httpServer'].close();
  });

  test('Debe procesar operador_command devolviendo un bunker_response garantizando la bidireccionalidad', () => {
    const ordenPrueba = "Activar protocolos de seguridad";

    return new Promise<void>((resolve) => {
      // 2. Preparamos el receptor
      clientSocket.on('bunker_response', (data) => {
        expect(data.text).toContain("Orden interceptada por el búnker de mando:");
        expect(data.text).toContain(ordenPrueba);
        resolve();
      });

      // 1. Emitimos la orden
      clientSocket.emit('operador_command', { text: ordenPrueba });
    });
  });
});
