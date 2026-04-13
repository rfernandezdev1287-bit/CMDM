import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || 3001;

io.on('connection', (socket) => {
  console.log(`[CMDM Búnker]: Operador conectado (${socket.id})`);
  
  socket.on('disconnect', () => {
    console.log('[CMDM Búnker]: Operador desconectado');
  });
});

httpServer.listen(PORT, () => {
  console.log(`[CMDM Búnker]: Servidor central de mando en puerto ${PORT}`);
});
