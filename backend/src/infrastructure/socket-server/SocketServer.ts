import express from 'express';
import { createServer, Server as HttpServer } from 'http';
import { Server } from 'socket.io';

/**
 * SocketServer - Infrastructure Layer
 * Responsable de la comunicación bidireccional en tiempo real.
 * Implementa el Binding Omnisciente (0.0.0.0) exigido por la Ley RFDEV.
 */
export class SocketServer {
  private app: express.Application;
  private httpServer: HttpServer;
  private io: Server;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new Server(this.httpServer, {
      cors: {
        origin: '*',
      }
    });

    this.setupRoutes();
    this.setupSocketEvents();
  }

  private setupRoutes(): void {
    this.app.get('/health', (req, res) => {
      res.json({ status: 'online', service: 'CMDM Búnker' });
    });
  }

  private setupSocketEvents(): void {
    this.io.on('connection', (socket) => {
      console.log(`[CMDM Búnker]: Operador conectado (${socket.id})`);
      
      socket.on('disconnect', () => {
        console.log('[CMDM Búnker]: Operador desconectado');
      });
    });
  }

  /**
   * Arranca el servidor con binding explícito a 0.0.0.0 para acceso externo (ngrok).
   */
  public start(port: number | string): void {
    const PORT_NUM = Number(port);
    const HOST = '0.0.0.0';

    this.httpServer.listen(PORT_NUM, HOST, () => {
      console.log(`🏛️ CMDM ONLINE | Host: ${HOST} | Puerto: ${PORT_NUM}`);
    });
  }

  public getIO(): Server {
    return this.io;
  }
}
