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

    const allowedOriginsRaw = process.env.ALLOWED_ORIGINS || 'http://localhost:8080,http://192.168.0.3:8080,https://sympetalous-conformably-colin.ngrok-free.dev';
    const allowedOrigins = allowedOriginsRaw.split(',').map(o => o.trim());

    // Express Middleware Custom: Blindaje 403 para Origins no autorizados
    this.app.use((req, res, next) => {
      const origin = req.headers.origin;
      if (origin && !allowedOrigins.includes(origin)) {
        return res.status(403).json({ error: 'CORS Forbidden: Domain mismatch' });
      }
      res.header('Access-Control-Allow-Origin', origin || allowedOrigins[0] || '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });

    this.io = new Server(this.httpServer, {
      cors: {
        origin: allowedOrigins,
      }
    });

    this.setupRoutes();
    this.setupSocketEvents();
  }

  private setupRoutes(): void {
    this.app.get('/status', (req, res) => {
      res.json({ status: 'online', service: 'CMDM Búnker' });
    });
  }

  private setupSocketEvents(): void {
    this.io.on('connection', (socket) => {
      console.log(`[CMDM Búnker]: Operador conectado (${socket.id})`);
      
      // Listener de la Ley: Recepción de Sockets Frontales (STT Output)
      socket.on('operador_command', (data: { text: string }) => {
        console.log(`[CMDM Tracing]: Orden recibida -> "${data.text}"`);
        
        // Emisión del acuse transaccional (Eco en el bucle cerrado)
        // La IA "pesada" (Ollama) tomará control de esta emisión en el próximo módulo.
        this.io.emit('bunker_response', { 
          text: `Orden interceptada por el búnker de mando: "${data.text}"` 
        });
      });

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

  public getApp(): express.Application {
    return this.app;
  }
}
