import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useCMDM_Socket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Spanglish Architecture: Construcción del endpoint
    let url_servidor = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';
    if (window.location.protocol === 'https:' && url_servidor.startsWith('http://')) {
      url_servidor = url_servidor.replace('http://', 'https://'); // Socket IO convertirá esto a wss automáticamente
    }
    
    // Ignición del Socket con política de reconexión ofensiva
    const socketInstance = io(url_servidor, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      extraHeaders: {
        "ngrok-skip-browser-warning": "69420"
      }
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

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

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);
    socketInstance.on('bunker_update', handleBunkerUpdate);

    // Sistema Socrático: Reconexión Ofensiva al recuperar red móvil
    const handleNetworkOnline = () => {
      if (socketInstance.disconnected) {
        socketInstance.connect();
      }
    };
    window.addEventListener('online', handleNetworkOnline);

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.off('bunker_update', handleBunkerUpdate);
      
      if (socketInstance && typeof socketInstance.disconnect === 'function') {
        socketInstance.disconnect();
      }
      
      window.removeEventListener('online', handleNetworkOnline);
    };
  }, []);

  return { socket, isConnected, isSyncing };
};
