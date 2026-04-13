import { renderHook, act } from '@testing-library/react';
import { useCMDM_Voice } from '../useCMDM_Voice';
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';

describe('useCMDM_Voice (ST-05.3 DMS Remediation)', () => {
  let speakMock: ReturnType<typeof vi.fn>;
  let cancelMock: ReturnType<typeof vi.fn>;
  let resumeMock: ReturnType<typeof vi.fn>;
  let getVoicesMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    speakMock = vi.fn();
    cancelMock = vi.fn();
    resumeMock = vi.fn();
    getVoicesMock = vi.fn().mockReturnValue([
      { lang: 'en-US', name: 'English' },
      { lang: 'es-MX', name: 'Latino' }
    ]);

    // Mock del motor nativo
    vi.stubGlobal('speechSynthesis', {
      speak: speakMock,
      resume: resumeMock,
      cancel: cancelMock,
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

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  test('Debe ejecutar purga en el Warm-Up síncrono', () => {
    const { result } = renderHook(() => useCMDM_Voice());

    act(() => {
      result.current.desbloquearMotorDeVoz();
    });

    // Avanzamos timer de guillotina (50ms)
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Validamos que forzó la cancelación para evitar el cuelgue
    expect(cancelMock).toHaveBeenCalledTimes(2); // 1 inicial, 1 en el timeout
  });

  test('Debe activar Dead Mans Switch si el motor macOS cuelga el onend', () => {
    const { result } = renderHook(() => useCMDM_Voice());
    
    act(() => {
      // Texto de longitud 10. Timeout = (10 * 100) + 2000 = 3000ms
      result.current.reproducirRespuesta("1234567890"); 
      // Cola interna tiene 1 elemento
      // Simulamos enviar otro para ver si la cola avanza tras el DMS
      result.current.reproducirRespuesta("Segundo");
    });

    expect(speakMock).toHaveBeenCalledTimes(1);
    // cancelMock ha sido llamado 0 veces en el contexto de cola en este momento
    cancelMock.mockClear();

    // Avanzamos 2999ms (antes del timeout)
    act(() => {
      vi.advanceTimersByTime(2999);
    });
    // No debe haber disparado el cancel de seguridad aún
    expect(cancelMock).not.toHaveBeenCalled();

    // Avanzamos el MS faltante para detonar el DMS
    act(() => {
      vi.advanceTimersByTime(1);
    });

    // 1. El Switch forzado se ejecutó limpiando colas del navegador
    expect(cancelMock).toHaveBeenCalledTimes(1);
    // 2. Se disparó el segundo elemento de la cola internamente
    expect(speakMock).toHaveBeenCalledTimes(2);
  });
});
