import { useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';

/**
 * useCMDM_Intercession - Application Layer Hook
 * Responsable de la captura de contexto síncrona y el Protocolo Cavernícola.
 */
export const useCMDM_Intercession = (socket: Socket | null) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const capturarContexto = useCallback(async (seconds: number = 60) => {
    if (!socket || isCapturing) return;

    setIsCapturing(true);
    console.log(`[CMDM Búnker]: Solicitando intercesión de artefactos (${seconds}s)...`);

    try {
      // 1. Emitir la solicitud al Búnker
      socket.emit('request_capture', { seconds });

      // 2. Esperar la respuesta (Promificada para control de flujo)
      const data = await new Promise<{ content: string }>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timeout en la intercesión')), 5000);
        
        socket.once('context_captured', (payload) => {
          clearTimeout(timeout);
          resolve(payload);
        });
      });

      // 3. Protocolo de Portapapeles (Clipboard API)
      if (data.content) {
        await navigator.clipboard.writeText(data.content);
        console.log('✅ Contexto "Squeezed" en el portapapeles.');
      } else {
        console.warn('⚠️ El búnker no detectó cambios recientes para capturar.');
      }

    } catch (error) {
      console.error('[CMDM Error]: Fallo en la captura de contexto:', error);
    } finally {
      setIsCapturing(false);
    }
  }, [socket, isCapturing]);

  return { capturarContexto, isCapturing };
};
