import { useState, useEffect, useRef } from 'react';
import { Box, Stack, Typography, IconButton, TextField, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SendIcon from '@mui/icons-material/Send';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { GlassCard } from '../shared/GlassCard';
import { useCMDM_Voice } from '../../../application/hooks/useCMDM_Voice';
import { useCMDM_Socket } from '../../../application/hooks/useCMDM_Socket';
import { useCMDM_Intercession } from '../../../application/hooks/useCMDM_Intercession';
import HubIcon from '@mui/icons-material/Hub';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export const Dashboard = () => {
  const { isConnected, isSyncing, socket } = useCMDM_Socket();
  const { capturarContexto, isCapturing } = useCMDM_Intercession(socket);
  const { 
    isListening, 
    transcriptText, 
    setTranscriptText, 
    iniciarDictado, 
    detenerDictado, 
    reproducirRespuesta
  } = useCMDM_Voice();

  // El Buffer Circular de Soberanía con Hidratación Criogénica
  const [logs, setLogs] = useState<{ id: string, text: string, source: 'sys' | 'operador' }[]>(() => {
    const saved = localStorage.getItem('cmdm_logs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isBundling, setIsBundling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // T-49: Persistencia Criogénica (Auto-save)
  useEffect(() => {
    localStorage.setItem('cmdm_logs', JSON.stringify(logs));
  }, [logs]);

  // Auto-scroll estricto para UX Móvil
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Suscripción al Socket
  useEffect(() => {
    if (!socket) return;
    
    // T-44: Handshake Inicial - Hidratación de interacciones recientes
    const handleBunkerUpdate = (data: { content: string }) => {
      setLogs((prev) => {
        // Evitar duplicados si ya están en el buffer
        if (prev.some(l => l.text === data.content)) return prev;
        const newLog = { id: 'handshake-' + Date.now().toString(), text: data.content, source: 'sys' as const };
        return prev.length >= 100 ? [...prev.slice(1), newLog] : [...prev, newLog];
      });
    };

    const handleIncomingMessage = (data: { text: string }) => {
      setLogs((prev) => {
        const newLog = { id: Date.now().toString(), text: data.text, source: 'sys' as const };
        return prev.length >= 100 ? [...prev.slice(1), newLog] : [...prev, newLog];
      });
      reproducirRespuesta(data.text);
    };

    const handleStream = (data: { tipo: string, archivo: string, output_procesado: string }) => {
      setLogs((prev) => {
        const newLog = { id: Date.now().toString() + Math.random().toString(), text: data.output_procesado, source: 'sys' as const };
        return prev.length >= 100 ? [...prev.slice(1), newLog] : [...prev, newLog];
      });
    };

    const handleAuditBundleReady = (data: { content: string }) => {
      setIsBundling(false);
      // Grillar el bundle en el log para inspección táctica inmediata
      setLogs((prev) => {
        const newLog = { id: 'bundle-' + Date.now(), text: `<<< ARSENAL CONSOLIDADO >>>\n${data.content}`, source: 'sys' as const };
        return prev.length >= 100 ? [...prev.slice(1), newLog] : [...prev, newLog];
      });
    };

    socket.on('bunker_update', handleBunkerUpdate);
    socket.on('bunker_response', handleIncomingMessage);
    socket.on('bunker_stream', handleStream);
    socket.on('audit_bundle_ready', handleAuditBundleReady);

    return () => {
      socket.off('bunker_update', handleBunkerUpdate);
      socket.off('bunker_response', handleIncomingMessage);
      socket.off('bunker_stream', handleStream);
      socket.off('audit_bundle_ready', handleAuditBundleReady);
    };
  }, [socket, reproducirRespuesta]);

  const enviarOrden = () => {
    if (!transcriptText.trim()) return;
    
    setLogs((prev) => {
      const log = { id: Date.now().toString(), text: transcriptText, source: 'operador' as const };
      return prev.length >= 100 ? [...prev.slice(1), log] : [...prev, log];
    });

    if (socket && isConnected) {
      socket.emit('operador_command', { text: transcriptText });
    }
    
    setTranscriptText('');
  };

  const solicitarConsolidacion = () => {
    if (!socket || !isConnected) return;
    setIsBundling(true);
    socket.emit('request_audit_bundle');
  };

  const copiarAlPortapapeles = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log('[CMDM]: Log copiado.');
  };

  return (
    <Box 
      sx={{ 
        height: '100dvh', 
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: 'background.default',
        color: 'text.primary',
        p: { xs: 1, sm: 2 },
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* T-48: OVERLAY DE SINCRONÍA */}
      {isSyncing && (
        <Box sx={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          bgcolor: 'rgba(0,0,0,0.8)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)'
        }}>
          <CircularProgress color="primary" sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>SINCRONIZANDO BÚNKER...</Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>Protocolo ST-05 | Handshake Quirúrgico</Typography>
        </Box>
      )}

      {/* HEADER: STATUS */}
      <GlassCard sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            CMDM BÚNKER
          </Typography>
          
          <IconButton 
            size="small" 
            color={isCapturing ? 'secondary' : 'primary'} 
            onClick={() => capturarContexto(90)}
            disabled={!isConnected || isCapturing}
            sx={{ bgcolor: 'rgba(0, 255, 204, 0.05)', border: '1px solid rgba(0, 255, 204, 0.2)' }}
          >
            {isCapturing ? <CircularProgress size={20} /> : <HubIcon />}
          </IconButton>

          <IconButton 
            size="small" 
            color="primary" 
            onClick={solicitarConsolidacion}
            disabled={!isConnected || isBundling}
            sx={{ bgcolor: 'rgba(255, 215, 0, 0.05)', border: '1px solid rgba(255, 215, 0, 0.2)' }}
          >
            {isBundling ? <CircularProgress size={20} /> : <SendIcon sx={{ transform: 'rotate(-90deg)' }} />}
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: 10, height: 10, borderRadius: '50%', 
              bgcolor: isConnected ? 'success.main' : 'error.main', 
              boxShadow: isConnected ? '0 0 10px #4caf50' : '0 0 10px #f44336'
            }} 
          />
          <Typography variant="caption" sx={{ opacity: 0.8, letterSpacing: 0.5 }}>
            {isConnected ? 'ENLAZADO' : 'BUSCANDO TÚNEL'}
          </Typography>
        </Stack>
      </GlassCard>

      {/* BODY: MONITOR DUAL (Buffer Circular) */}
      <GlassCard 
        sx={{ 
          flexGrow: 1, display: 'flex', flexDirection: 'column', 
          mb: 2, overflowY: 'auto', scrollBehavior: 'smooth'
        }} 
        ref={scrollRef}
      >
        {logs.length === 0 ? (
          <Box sx={{ m: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
            <CircularProgress color="primary" variant="indeterminate" disableShrink thickness={2} size={24} sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>Interceptando stream local...</Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {logs.map((log) => (
              <Box 
                key={log.id} 
                sx={{ 
                  alignSelf: log.source === 'operador' ? 'flex-end' : 'flex-start',
                  bgcolor: log.source === 'operador' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  px: 2, py: 1.2, borderRadius: 2, maxWidth: '85%',
                  borderLeft: log.source === 'sys' ? '3px solid #00FFCC' : 'none',
                  borderRight: log.source === 'operador' ? '3px solid #FFD700' : 'none'
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: 'monospace', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {log.text}
                </Typography>
                {log.source === 'sys' && (
                  <IconButton size="small" sx={{ alignSelf: 'flex-end', mt: 0.5, p: 0.5, opacity: 0.6 }} onClick={() => copiarAlPortapapeles(log.text)}>
                    <ContentCopyIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </GlassCard>

      {/* FOOTER: CONSOLA DE MANDO (FIJA) */}
      <GlassCard sx={{ p: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
        <IconButton 
          color={isListening ? 'error' : 'primary'} 
          onClick={isListening ? detenerDictado : iniciarDictado}
          sx={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', transform: isListening ? 'scale(1.1)' : 'scale(1)' }}
        >
          {isListening ? <StopIcon /> : <MicIcon />}
        </IconButton>
        
        <TextField 
          fullWidth variant="standard" placeholder="Dictar comando..."
          value={transcriptText} onChange={(e) => setTranscriptText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviarOrden()}
          slotProps={{ input: { disableUnderline: true, sx: { fontFamily: 'monospace', fontSize: '0.95rem', ml: 1 } } }}
        />

        {logs.length > 0 && logs[logs.length - 1].source === 'sys' && (
          <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }} onClick={() => reproducirRespuesta(logs[logs.length - 1].text)}>
            <VolumeUpIcon />
          </IconButton>
        )}

        <IconButton color="primary" onClick={enviarOrden} disabled={!transcriptText.trim()}>
          <SendIcon />
        </IconButton>
      </GlassCard>
    </Box>
  );
};
