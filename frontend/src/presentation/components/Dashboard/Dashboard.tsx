import { useState, useEffect, useRef } from 'react';
import { Box, Stack, Typography, IconButton, TextField, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SendIcon from '@mui/icons-material/Send';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { GlassCard } from '../shared/GlassCard';
import { useCMDM_Voice } from '../../../application/hooks/useCMDM_Voice';
import { useCMDM_Socket } from '../../../application/hooks/useCMDM_Socket';

export const Dashboard = () => {
  const { isConnected, socket } = useCMDM_Socket();
  const { 
    isListening, 
    transcriptText, 
    setTranscriptText, 
    iniciarDictado, 
    detenerDictado, 
    reproducirRespuesta 
  } = useCMDM_Voice();

  // El Buffer Circular de Soberanía
  const [logs, setLogs] = useState<{ id: string, text: string, source: 'sys' | 'operador' }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll estricto para UX Móvil
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Suscripción al Socket
  useEffect(() => {
    if (!socket) return;
    
    const handleIncomingMessage = (data: { text: string }) => {
      // Buffer Circular: Cap máximo de 100 mensajes para blindar el DOM (O(1) memory cap)
      setLogs((prev) => {
        const newLog = { id: Date.now().toString(), text: data.text, source: 'sys' as const };
        return prev.length >= 100 ? [...prev.slice(1), newLog] : [...prev, newLog];
      });
    };

    socket.on('bunker_response', handleIncomingMessage);
    return () => {
      socket.off('bunker_response', handleIncomingMessage);
    };
  }, [socket]);

  const enviarOrden = () => {
    if (!transcriptText.trim()) return;
    
    // Grillar en el DOM visual del Operador localmente antes de remitir
    setLogs((prev) => {
      const log = { id: Date.now().toString(), text: transcriptText, source: 'operador' as const };
      return prev.length >= 100 ? [...prev.slice(1), log] : [...prev, log];
    });

    if (socket && isConnected) {
      socket.emit('operador_command', { text: transcriptText });
    }
    
    setTranscriptText('');
  };

  return (
    <Box 
      sx={{ 
        height: '100dvh', // Forzado estricto para navegadores móviles
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: 'background.default',
        color: 'text.primary',
        p: { xs: 1, sm: 2 },
        overflow: 'hidden'
      }}
    >
      {/* HEADER: STATUS */}
      <GlassCard sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5 }}>
        <Typography variant="h6" fontWeight={700} color="primary.main" letterSpacing={1}>
          CMDM BÚNKER
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: 10, 
              height: 10, 
              borderRadius: '50%', 
              bgcolor: isConnected ? 'success.main' : 'error.main', 
              boxShadow: isConnected ? '0 0 10px #4caf50' : '0 0 10px #f44336',
              animation: isConnected ? 'none' : 'pulse 1.5s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.5 },
                '100%': { opacity: 1 },
              }
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
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          mb: 2, 
          overflowY: 'auto',
          scrollBehavior: 'smooth'
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
                  bgcolor: log.source === 'operador' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)', // Gold transparente para el humano, blanco tenue para IA
                  px: 2, py: 1.2,
                  borderRadius: 2,
                  maxWidth: '85%',
                  borderLeft: log.source === 'sys' ? '3px solid #00FFCC' : 'none', // Cyan hint para OLAma/AntiGravity
                  borderRight: log.source === 'operador' ? '3px solid #FFD700' : 'none'
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: 'monospace', lineHeight: 1.5 }}>{log.text}</Typography>
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
          fullWidth
          variant="standard"
          placeholder="Dictar comando..."
          value={transcriptText}
          onChange={(e) => setTranscriptText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviarOrden()}
          slotProps={{ 
            input: { 
              disableUnderline: true, 
              sx: { fontFamily: 'monospace', fontSize: '0.95rem', ml: 1 } 
            } 
          }}
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
