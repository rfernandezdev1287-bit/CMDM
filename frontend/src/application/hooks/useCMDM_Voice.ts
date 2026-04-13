import { useState, useRef, useCallback } from 'react';

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

  // Motor TTS
  const reproducirRespuesta = useCallback((texto: string) => {
    if (!('speechSynthesis' in window)) {
      console.error('El sistema carece de cuerdas vocales (TTS NO soportado).');
      return;
    }

    // Sellado y purga de buffers viejos
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-MX'; // Priorizamos el dialecto hispano estándar
    utterance.rate = 1.0; 
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  }, []);

  return {
    isListening,
    transcriptText,
    setTranscriptText, // Expuesto para limpieza manual del Operador
    iniciarDictado,
    detenerDictado,
    reproducirRespuesta
  };
};
