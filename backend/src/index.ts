import dotenv from 'dotenv';
// dotenv.config() DEBE ser lo primero para que el puerto esté disponible en el inicio
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { IntercessionService } from './application/services/IntercessionService';
import path from 'path';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

// Selección de puerto bajo la Ley RFDEV (Mandato del Arquitecto)
const PORT = process.env.PORT || 9000;

// Inicialización de la Vigilancia (IntercessionService)
// Si no hay VIGILANCIA_PATH en .env, usamos la raíz del proyecto
const defaultPath = path.join(__dirname, '..', '..');
const watchPath = process.env.VIGILANCIA_PATH || defaultPath;

const intercessionService = new IntercessionService(watchPath);
intercessionService.iniciarVigilancia();

// Configuración de Sockets para el Mando Móvil
io.on('connection', (socket) => {
  console.log(`[CMDM Búnker]: Operador conectado (${socket.id})`);
  
  socket.on('disconnect', () => {
    console.log('[CMDM Búnker]: Operador desconectado');
  });
});

// Arranque Atómico
httpServer.listen(PORT, () => {
  console.log(`🏛️ CMDM ONLINE | Puerto: ${PORT}`);
});
