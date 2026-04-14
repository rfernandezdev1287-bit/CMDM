import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// ST-08.2: REMEDIACIÓN DE HOOK DE SOCKETS - Inicialización Fuera del Efecto
// Calculamos el URL fuera para permitir la inicialización perezosa (Lazy Init)
const getSocketUrl = () => {
  let url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }
  return url;
};

export const useCMDM_Socket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * REGLA REACT 19: Inicialización perezosa de estado para evitar cascading renders.
   * El socket se crea una sola vez durante el primer montaje del hook.
   */
  const [socket] = useState<Socket>(() => io(getSocketUrl(), {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    extraHeaders: {
      "ngrok-skip-browser-warning": "69420"
    }
  }));

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log('📡 Socket Conectado - Iniciando Sincronía');
      setIsConnected(true);
      setIsSyncing(true); // Bloqueo UI para hidratación inicial
    };

    const handleDisconnect = () => {
      console.warn('⚠️ Socket Desconectado');
      setIsConnected(false);
      setIsSyncing(false);
    };

    const handleBunkerUpdate = () => {
      console.log('✅ Sincronía Inicial Completada (Handshake ST-05)');
      setIsSyncing(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('bunker_update', handleBunkerUpdate);

    // Protocolo de Reconexión Ofensiva
    const handleNetworkOnline = () => {
      if (socket.disconnected) {
        socket.connect();
      }
    };
    window.addEventListener('online', handleNetworkOnline);

    // Certificación de limpieza (Higiene de Procesos)
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('bunker_update', handleBunkerUpdate);
      window.removeEventListener('online', handleNetworkOnline);
      
      // No desconectamos el socket aquí si queremos que persista entre montajes, 
      // pero el estándar de este búnker es la estanqueidad por sesión.
      if (socket && typeof socket.disconnect === 'function') {
        socket.disconnect();
      }
    };
  }, [socket]);

  return { socket, isConnected, isSyncing };
};
