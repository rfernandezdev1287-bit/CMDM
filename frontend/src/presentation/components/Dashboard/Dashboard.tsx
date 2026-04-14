import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, Stack, Typography, IconButton, TextField, CircularProgress, 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip 
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SendIcon from '@mui/icons-material/Send';
import CodeIcon from '@mui/icons-material/Code';
import HistoryIcon from '@mui/icons-material/History';
import HubIcon from '@mui/icons-material/Hub';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';

import { GlassCard } from '../shared/GlassCard';
import { useCMDM_Voice } from '../../../application/hooks/useCMDM_Voice';
import { useCMDM_Socket } from '../../../application/hooks/useCMDM_Socket';
import { useCMDM_Intercession } from '../../../application/hooks/useCMDM_Intercession';

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
  
  // Control del Arsenal de Cristal (Modal)
  const [arsenalBundle, setArsenalBundle] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Handler centralizado con Buffer de Idempotencia para evitar el bucle de "eco"
  const addLog = useCallback((text: string, source: 'sys' | 'operador', idPrefix = '') => {
    setLogs((prev) => {
      // DEDUPLICACIÓN TÁCTICA: Si el texto es idéntico al último mensaje, ignoramos para matar el bucle.
      if (prev.length > 0 && prev[prev.length - 1].text === text) return prev;
      
      const newLog = { 
        id: (idPrefix || Date.now().toString()) + '-' + Math.random().toString(36).substr(2, 5), 
        text, 
        source 
      };
      return prev.length >= 100 ? [...prev.slice(1), newLog] : [...prev, newLog];
    });
  }, []);

  // Suscripción al Socket con Blindaje de Listeners
  useEffect(() => {
    if (!socket) return;
    
    // T-44: Handshake Inicial (Espejo Conversacional)
    const handleBunkerUpdate = (data: { content: string }) => {
      addLog(data.content, 'sys', 'mirror');
    };

    const handleIncomingMessage = (data: { text: string }) => {
      addLog(data.text, 'sys');
      reproducirRespuesta(data.text);
    };

    const handleAuditBundleReady = (data: { content: string }) => {
      setIsBundling(false);
      setArsenalBundle(data.content);
      setIsModalOpen(true); // Apertura aislada de Arsenal
    };

    socket.on('bunker_update', handleBunkerUpdate);
    socket.on('bunker_response', handleIncomingMessage);
    socket.on('audit_bundle_ready', handleAuditBundleReady);

    return () => {
      socket.off('bunker_update', handleBunkerUpdate);
      socket.off('bunker_response', handleIncomingMessage);
      socket.off('audit_bundle_ready', handleAuditBundleReady);
    };
  }, [socket, reproducirRespuesta, addLog]);

  const enviarOrden = () => {
    if (!transcriptText.trim()) return;
    addLog(transcriptText, 'operador');

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
    console.log('[CMDM]: Arsenal copiado.');
  };

  return (
    <Box sx={{ 
      height: '100dvh', display: 'flex', flexDirection: 'column', 
      bgcolor: 'background.default', color: 'text.primary',
      p: { xs: 1, sm: 2 }, overflow: 'hidden', position: 'relative'
    }}>
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
          <Typography variant="caption" sx={{ opacity: 0.7 }}>Protocolo ST-06.6 | Sello de Veracidad</Typography>
        </Box>
      )}

      {/* HEADER: STATUS */}
      <GlassCard sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            CMDM BÚNKER
          </Typography>
          
          <Tooltip title="Capturar Contexto de Mando">
            <IconButton 
              size="small" color={isCapturing ? 'secondary' : 'primary'} 
              onClick={() => capturarContexto(90)}
              disabled={!isConnected || isCapturing}
              sx={{ bgcolor: 'rgba(0, 255, 204, 0.05)', border: '1px solid rgba(0, 255, 204, 0.2)' }}
            >
              {isCapturing ? <CircularProgress size={20} /> : <HubIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Consolidar Arsenal (Google AI Studio)">
            <IconButton 
              size="small" color="primary" onClick={solicitarConsolidacion}
              disabled={!isConnected || isBundling}
              sx={{ bgcolor: 'rgba(255, 215, 0, 0.05)', border: '1px solid rgba(255, 215, 0, 0.2)' }}
            >
              {isBundling ? <CircularProgress size={20} /> : <CodeIcon />}
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box sx={{ 
            width: 10, height: 10, borderRadius: '50%', 
            bgcolor: isConnected ? 'success.main' : 'error.main', 
            boxShadow: isConnected ? '0 0 10px #4caf50' : '0 0 10px #f44336'
          }} />
          <Typography variant="caption" sx={{ opacity: 0.8, letterSpacing: 0.5 }}>
            {isConnected ? 'ENLAZADO' : 'BUSCANDO TÚNEL'}
          </Typography>
        </Stack>
      </GlassCard>

      {/* BODY: MONITOR DUAL (Buffer Circular) */}
      <GlassCard 
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', mb: 2, overflowY: 'auto', scrollBehavior: 'smooth' }} 
        ref={scrollRef}
      >
        {logs.length === 0 ? (
          <Box sx={{ m: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
            <CircularProgress color="primary" variant="indeterminate" disableShrink thickness={2} size={24} sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>Esperando señal de Antigravity...</Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {logs.map((log) => (
              <Box key={log.id} sx={{ 
                alignSelf: log.source === 'operador' ? 'flex-end' : 'flex-start',
                bgcolor: log.source === 'operador' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                px: 2, py: 1.2, borderRadius: 2, maxWidth: '85%',
                borderLeft: log.source === 'sys' ? '3px solid #00FFCC' : 'none',
                borderRight: log.source === 'operador' ? '3px solid #FFD700' : 'none'
              }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {log.text}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </GlassCard>

      {/* FOOTER: CONSOLA DE MANDO (Restaurada) */}
      <GlassCard sx={{ p: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
        <IconButton 
          color={isListening ? 'error' : 'primary'} onClick={isListening ? detenerDictado : iniciarDictado}
          sx={{ transition: 'all 0.2s', transform: isListening ? 'scale(1.1)' : 'scale(1)' }}
        >
          {isListening ? <StopIcon /> : <MicIcon />}
        </IconButton>
        
        <TextField 
          fullWidth variant="standard" placeholder="Dictar comando..."
          value={transcriptText} onChange={(e) => setTranscriptText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviarOrden()}
          slotProps={{ input: { disableUnderline: true, sx: { fontFamily: 'monospace', fontSize: '0.95rem', ml: 1 } } }}
        />

        <IconButton color="primary" onClick={enviarOrden} disabled={!transcriptText.trim()}>
          <SendIcon />
        </IconButton>
      </GlassCard>

      {/* ARSENAL MODAL (Cámara de Cristal) */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        maxWidth="md" 
        fullWidth
        slotProps={{ 
          paper: { 
            sx: { 
              bgcolor: 'rgba(15, 25, 35, 0.95)', 
              backdropFilter: 'blur(20px)', 
              border: '1px solid rgba(255, 215, 0, 0.3)', 
              borderRadius: 3, 
              backgroundImage: 'none' 
            } 
          } 
        }}
      >
        <DialogTitle sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <HistoryIcon />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>ARSENAL CONSOLIDADO</Typography>
          </Stack>
          <IconButton onClick={() => setIsModalOpen(false)} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Box sx={{ bgcolor: 'rgba(0,0,0,0.4)', p: 2, borderRadius: 1, maxHeight: '50vh', overflowY: 'auto' }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: 'primary.light' }}>
              {arsenalBundle}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button startIcon={<ContentCopyIcon />} onClick={() => arsenalBundle && copiarAlPortapapeles(arsenalBundle)} variant="contained" color="primary">
            Copiar para AI Studio
          </Button>
          <Button onClick={() => setIsModalOpen(false)} sx={{ color: 'text.secondary' }}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
