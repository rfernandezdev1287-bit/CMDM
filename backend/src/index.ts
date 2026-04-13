import dotenv from 'dotenv';
// INSTRUCCIÓN ABSOLUTA: dotenv.config() DEBE ser la primera línea del sistema
dotenv.config();

import { SocketServer } from './infrastructure/socket-server/SocketServer';
import { IntercessionService } from './application/services/IntercessionService';
import path from 'path';

/**
 * ENTRY POINT CENTRAL - CMDM Búnker
 * Orquestación central del sistema de mando.
 */

// 1. Configuración de Puerto (Mandato 9000)
const PORT = process.env.PORT || 9000;

// 2. Inicialización de la Vigilancia (DDD: Application Service)
const defaultPath = path.join(__dirname, '..', '..');
const watchPath = process.env.VIGILANCIA_PATH || defaultPath;

const intercessionService = new IntercessionService(watchPath);
intercessionService.iniciarVigilancia();

// 3. Inicialización del Servidor de Sockets (DDD: Infrastructure)
const server = new SocketServer();
server.start(PORT);

// Nota: El IntercessionService podría eventualmente requerir el IO del server 
// para emitir eventos en tiempo real al móvil (ST-02).
