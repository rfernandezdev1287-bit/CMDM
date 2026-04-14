import { useState, useEffect, useRef, useCallback, useLayoutEffect, useMemo } from 'react';
import { 
  Box, Stack, Typography, IconButton, TextField, CircularProgress, 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip 
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SendIcon from '@mui/icons-material/Send';
import CodeIcon from '@mui/icons-material/Code';
import HubIcon from '@mui/icons-material/Hub';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { GlassCard } from '../shared/GlassCard';
import { useCMDM_Voice } from '../../../application/hooks/useCMDM_Voice';
import { useCMDM_Socket } from '../../../application/hooks/useCMDM_Socket';
import { useCMDM_Intercession } from '../../../application/hooks/useCMDM_Intercession';

interface LogEntry {
  id: string;
  text: string;
  source: 'sys' | 'operador';
}

export const Dashboard = () => {
  const { isConnected, isSyncing, socket } = useCMDM_Socket();
  const { capturarContexto, isCapturing } = useCMDM_Intercession(socket);
  const { 
    isListening, 
    transcriptText, 
    setTranscriptText, 
    iniciarDictado, 
    detenerDictado, 
    reproducirRespuesta,
    silenciarMotor
  } = useCMDM_Voice();

  // ST-08.1: REMEDIACIÓN DE BUILD - Refactorización de Estado Derivado
  const [fullLogs, setFullLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('cmdm_logs');
    return saved ? JSON.parse(saved) : [];
  });
  
  // 1 Interacción = 1 Par. Reducción a 10 mensajes (5 pares) para evitar saturación visual inicial.
  const [visibleCount, setVisibleCount] = useState(10);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isExpandingPast, setIsExpandingPast] = useState(false);

  /**
   * REGLA REACT 19: Evitar setState en useEffect para data derivada.
   * Usamos useMemo para calcular displayedLogs de forma síncrona durante el render.
   */
  const displayedLogs = useMemo(() => {
    return fullLogs.slice(-visibleCount);
  }, [fullLogs, visibleCount]);

  const [arsenalBundle, setArsenalBundle] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBundling, setIsBundling] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);

  // Persistencia Criogénica
  useEffect(() => {
    localStorage.setItem('cmdm_logs', JSON.stringify(fullLogs));
  }, [fullLogs]);

  /**
   * ST-08.1: ESTABILIZACIÓN DE SCROLL FORENSE 2.1
   * Intervención pre-paint con protección de jank.
   * Se mantiene el uso de useLayoutEffect para asegurar que el salto
   * ocurra antes de que el usuario vea el nuevo contenido prepended.
   */
  useLayoutEffect(() => {
    if (!scrollRef.current) return;

    if (isInitialLoad && displayedLogs.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setIsInitialLoad(false);
    } else if (isExpandingPast && prevScrollHeightRef.current > 0) {
      const delta = scrollRef.current.scrollHeight - prevScrollHeightRef.current;
      if (delta > 0) {
        scrollRef.current.scrollTop = delta;
      }
      setIsExpandingPast(false);
      prevScrollHeightRef.current = 0;
    } else if (!isExpandingPast) {
      const isNearBottom = scrollRef.current.scrollHeight - scrollRef.current.scrollTop - scrollRef.current.clientHeight < 150;
      if (isNearBottom) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedLogs]); // Solo re-reacciona cuando cambia el contenido visible

  const addLog = useCallback((text: string, source: 'sys' | 'operador', idPrefix = '') => {
    setFullLogs((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].text === text) return prev;
      
      const newLog: LogEntry = { 
        id: (idPrefix || Date.now().toString()) + '-' + Math.random().toString(36).substr(2, 5), 
        text, 
        source 
      };
      
      return prev.length >= 1000 ? [...prev.slice(1), newLog] : [...prev, newLog];
    });
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop <= 5 && displayedLogs.length < fullLogs.length && !isExpandingPast) {
      prevScrollHeightRef.current = target.scrollHeight;
      setIsExpandingPast(true);
      setVisibleCount((prev) => Math.min(prev + 10, fullLogs.length));
    }
  };

  useEffect(() => {
    if (!socket) return;
    
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
      setIsModalOpen(true);
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
  };

  return (
    <Box sx={{ 
      height: '100dvh', 
      display: 'flex', 
      flexDirection: 'column', 
      bgcolor: '#0A0F19', 
      color: 'text.primary',
      p: { xs: 1, sm: 2 }, 
      overflow: 'hidden', 
      position: 'relative'
    }}>
      {isSyncing && (
        <Box sx={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          bgcolor: 'rgba(0,0,0,0.9)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(16px)'
        }}>
          <CircularProgress color="primary" sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800 }}>SINCRONIZANDO...</Typography>
        </Box>
      )}

      {/* HEADER: Confinado */}
      <Box sx={{ flexShrink: 0, mb: 1.5 }}>
        <GlassCard sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
              CMDM BÚNKER
            </Typography>
            <Tooltip title="Capturar Contexto de Mando">
              <IconButton 
                size="small" color={isCapturing ? 'secondary' : 'primary'} 
                onClick={() => capturarContexto(90)}
                disabled={!isConnected || isCapturing}
                sx={{ border: '1px solid rgba(0, 255, 204, 0.3)' }}
              >
                {isCapturing ? <CircularProgress size={20} /> : <HubIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Codificar Arsenal">
              <IconButton 
                size="small" color="primary" onClick={solicitarConsolidacion}
                disabled={!isConnected || isBundling}
                sx={{ border: '1px solid rgba(255, 215, 0, 0.3)' }}
              >
                {isBundling ? <CircularProgress size={20} /> : <CodeIcon />}
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box sx={{ 
              width: 10, height: 10, borderRadius: '50%', 
              bgcolor: isConnected ? '#00FFCC' : '#F44336', 
              boxShadow: isConnected ? '0 0 10px #00FFCC' : '0 0 10px #F44336'
            }} />
            <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
              {isConnected ? 'ENLAZADO' : 'SIN RASTRO'}
            </Typography>
          </Stack>
        </GlassCard>
      </Box>

      {/* BODY: MONITOR DUAL (Soberanía Operativa) */}
      <GlassCard 
        sx={{ 
          flex: '1 1 0%',
          minHeight: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          p: 0,
          mb: 1.5, 
          bgcolor: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden'
        }}
      >
        <Box 
          id="cmdm-monitor-dual"
          onScroll={handleScroll}
          ref={scrollRef}
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            p: 2,
            scrollBehavior: isExpandingPast ? 'auto' : 'smooth',
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(0,255,204,0.2)', borderRadius: '10px' }
          }} 
        >
          <Stack spacing={2}>
            {displayedLogs.map((log) => (
              <Box key={log.id} sx={{ 
                alignSelf: log.source === 'operador' ? 'flex-end' : 'flex-start',
                bgcolor: log.source === 'operador' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                px: 2, py: 1, borderRadius: 2, 
                maxWidth: '85%',
                borderLeft: log.source === 'sys' ? '2px solid #00FFCC' : 'none',
                borderRight: log.source === 'operador' ? '2px solid #FFD700' : 'none',
                overflowWrap: 'anywhere',
                wordBreak: 'break-word'
              }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {log.text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </GlassCard>

      {/* FOOTER: CONSOLA */}
      <Box sx={{ flexShrink: 0 }}>
        <GlassCard sx={{ p: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton color={isListening ? 'error' : 'primary'} onClick={isListening ? () => { detenerDictado(); silenciarMotor(); } : iniciarDictado}>
            {isListening ? <StopIcon /> : <MicIcon />}
          </IconButton>
          <TextField 
            fullWidth variant="standard" placeholder="Soberanía del Operador: Dictar comando..."
            value={transcriptText} onChange={(e) => setTranscriptText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviarOrden()}
            slotProps={{ input: { disableUnderline: true, sx: { fontFamily: 'monospace', ml: 1 } } }}
          />
          <IconButton color="primary" onClick={enviarOrden} disabled={!transcriptText.trim()}>
            <SendIcon />
          </IconButton>
        </GlassCard>
      </Box>

      {/* ARSENAL MODAL (Cámara de Cristal) */}
      <Dialog 
        open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth
        slotProps={{ 
          paper: { 
            sx: { 
              bgcolor: 'rgba(10, 15, 25, 0.98)', backdropFilter: 'blur(32px)', 
              border: '1px solid rgba(255, 215, 0, 0.2)', borderRadius: 2, backgroundImage: 'none' 
            } 
          } 
        }}
      >
        <DialogTitle sx={{ color: '#FFD700', p: 2 }}>ARSENAL DE CRISTAL</DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8rem', color: '#00FFCC', whiteSpace: 'pre-wrap' }}>
              {arsenalBundle}
            </pre>
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
