import { useState, useRef, useCallback, useEffect } from 'react';

// Spanglish Law: Mapeo de objetos experimentales nativos
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useCMDM_Voice = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  
  const recognitionRef = useRef<any>(null);

  // Inicialización Lazy del Motor de STT
  const getRecognition = () => {
    if (recognitionRef.current) return recognitionRef.current;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('El búnker no detecta hardware STT. Es indispensable usar Chrome.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Cortar grabación al silencio del Operador
    recognition.interimResults = true; // Para ver el flujo en tiempo real (Visual CoT)
    recognition.lang = 'es-ES'; // Ley Cavernícola: Español obligatorio
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      // Volcado del buffer a nuestro estado
      if (finalTranscript) {
        setTranscriptText((prev) => (prev ? prev + ' ' + finalTranscript.trim() : finalTranscript.trim()));
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Falla en ignición STT:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      // Cambio de estado reactivo al finalizar captura
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return recognition;
  };

  const iniciarDictado = useCallback(() => {
    const recognition = getRecognition();
    if (recognition && !isListening) {
      recognition.start();
      setIsListening(true);
    }
  }, [isListening]);

  const detenerDictado = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const synthQueueRef = useRef<SpeechSynthesisUtterance[]>([]);
  const isSpeakingRef = useRef<boolean>(false);
  const voicesRef = useRef<any[]>([]);

  // T-02: Escucha Asíncrona de Voces del SO
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // T-01: Módulo Warm-up Síncrono (The Icebreaker)
  const desbloquearMotorDeVoz = useCallback(() => {
    if (!window.speechSynthesis) return;
    const warmupUtterance = new SpeechSynthesisUtterance('');
    warmupUtterance.volume = 0; // Mudo pero válido para activar permiso
    window.speechSynthesis.speak(warmupUtterance);
  }, []);

  // T-04: Cola Asíncrona sin .cancel()
  const procesarCola = useCallback(() => {
    if (isSpeakingRef.current || synthQueueRef.current.length === 0) return;

    const utterance = synthQueueRef.current[0];
    isSpeakingRef.current = true;

    // Callbacks vitalicios para limpiar colas
    utterance.onend = () => {
      synthQueueRef.current.shift(); 
      isSpeakingRef.current = false;
      procesarCola();
    };

    utterance.onerror = (e: any) => {
      if (e.error !== 'interrupted') {
        console.error('[CMDM TTS]: Error físico en lectura ->', e);
      }
      synthQueueRef.current.shift();
      isSpeakingRef.current = false;
      procesarCola();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // Motor TTS Carga Pasiva
  const reproducirRespuesta = useCallback((texto: string) => {
    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(texto);
    
    // Binding Dinámico
    const vozHispana = voicesRef.current.find(v => v.lang.startsWith('es-')) || voicesRef.current.find(v => v.lang.startsWith('es'));
    if (vozHispana) {
      utterance.voice = vozHispana;
    }
    
    utterance.lang = 'es-MX'; // Fallback dialecto
    utterance.rate = 1.0; 
    utterance.pitch = 1.0;

    synthQueueRef.current.push(utterance);
    procesarCola();
  }, [procesarCola]);

  return {
    isListening,
    transcriptText,
    setTranscriptText,
    iniciarDictado,
    detenerDictado,
    reproducirRespuesta,
    desbloquearMotorDeVoz
  };
};
