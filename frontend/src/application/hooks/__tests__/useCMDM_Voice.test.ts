import { renderHook, act } from '@testing-library/react';
import { useCMDM_Voice } from '../useCMDM_Voice';
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';

describe('useCMDM_Voice (ST-05.2 Autoplay Remediation)', () => {
  let speakMock: ReturnType<typeof vi.fn>;
  let getVoicesMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    speakMock = vi.fn();
    getVoicesMock = vi.fn().mockReturnValue([
      { lang: 'en-US', name: 'English' },
      { lang: 'es-MX', name: 'Latino' }
    ]);

    // Mock del motor nativo sin .cancel (se eliminó en la refactorización)
    vi.stubGlobal('speechSynthesis', {
      speak: speakMock,
      resume: vi.fn(),
      getVoices: getVoicesMock,
      onvoiceschanged: undefined
    });

    // Mock del constructor de Utterance
    vi.stubGlobal('SpeechSynthesisUtterance', class {
      text: string;
      lang: string;
      rate: number;
      pitch: number;
      volume: number;
      voice: any;
      onend: () => void;
      onerror: (e: any) => void;
      constructor(text: string) {
        this.text = text;
        this.lang = '';
        this.rate = 1;
        this.pitch = 1;
        this.volume = 1;
        this.onend = () => {};
        this.onerror = () => {};
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('Debe integrar Warm-up Síncrono (desbloquearMotorDeVoz) enlazado con volumen 0', () => {
    const { result } = renderHook(() => useCMDM_Voice());

    act(() => {
      result.current.desbloquearMotorDeVoz();
    });

    expect(speakMock).toHaveBeenCalledTimes(1);
    const warmupUtterance = speakMock.mock.calls[0][0];
    
    // Verificamos el payload de rompehielo (texto no vacío para macOS, volumen cero)
    expect(warmupUtterance.text).toBe('x');
    expect(warmupUtterance.volume).toBe(0);
  });

  test('Debe agendar en cola TTS asíncrona', () => {
    const { result } = renderHook(() => useCMDM_Voice());

    act(() => {
      // Inyección pasiva de Voz Post-Socket sin romper el engine
      result.current.reproducirRespuesta("Trazabilidad detectada");
    });

    // La cola lo procesa automáticamente si no hay audios activos
    expect(speakMock).toHaveBeenCalledTimes(1);
    
    const utteranceArg = speakMock.mock.calls[0][0];
    // Garantizar que amarró la voz real cargada del getVoices
    expect(utteranceArg.voice.lang).toBe('es-MX');
  });
});
