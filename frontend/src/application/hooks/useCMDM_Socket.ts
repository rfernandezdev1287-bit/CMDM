import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useCMDM_Socket = () => {
  const [isConnected, setIsConnected] = useState(false);
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
    });

    socketRef.current = socketInstance;

    const handleConnect = () => {
      console.log('📡 Socket Conectado');
      setIsConnected(true);
    };
    const handleDisconnect = () => {
      console.warn('⚠️ Socket Desconectado');
      setIsConnected(false);
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);

    // Sello de Reconexión Ofensiva (Online listener propuesto en ST-02.2)
    const handleNetworkOnline = () => {
      // Si el equipo vuelve a estar online y el socket está tirado, reactivamos
      if (socketRef.current && !socketRef.current.connected) {
        socketRef.current.connect(); 
      }
    };
    
    window.addEventListener('online', handleNetworkOnline);

    return () => {
      // Limpieza de memoria y listeners obligatoria
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.disconnect();
      window.removeEventListener('online', handleNetworkOnline);
    };
  }, []);

  return { socket: socketRef.current, isConnected };
};
