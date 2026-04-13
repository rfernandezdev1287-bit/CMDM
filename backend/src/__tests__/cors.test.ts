import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { SocketServer } from '../infrastructure/socket-server/SocketServer';

describe('CORS Security Protocol (ST-03.3)', () => {
  let server: SocketServer;

  beforeAll(() => {
    server = new SocketServer(); // Instancia efímera para testing
  });

  it('Debe devolver 403 (Forbidden) ante un request de origen no autorizado', async () => {
    const res = await request(server.getApp())
      .get('/status')
      .set('Origin', 'https://malicious-hacker-url.com');
      
    // TDD ROJO: Se espera un 403, pero el Backend (al carecer de blindaje CORS estricto) dejará el origin en '*' y retornará 200.
    expect(res.status).toBe(403);
  });
});
