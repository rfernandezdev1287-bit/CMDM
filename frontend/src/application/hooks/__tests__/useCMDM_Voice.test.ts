import { renderHook, act } from '@testing-library/react';
import { useCMDM_Voice } from '../useCMDM_Voice';
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';

describe('useCMDM_Voice (ST-05.1 TTS Refactor)', () => {
  let cancelMock: ReturnType<typeof vi.fn>;
  let speakMock: ReturnType<typeof vi.fn>;
  let getVoicesMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    cancelMock = vi.fn();
    speakMock = vi.fn();
    getVoicesMock = vi.fn().mockReturnValue([
      { lang: 'en-US', name: 'English' },
      { lang: 'es-MX', name: 'Latino' }
    ]);

    // Mock del motor nativo
    vi.stubGlobal('speechSynthesis', {
      cancel: cancelMock,
      speak: speakMock,
      getVoices: getVoicesMock
    });

    // Mock del constructor de Utterance
    vi.stubGlobal('SpeechSynthesisUtterance', class {
      text: string;
      lang: string;
      rate: number;
      pitch: number;
      voice: any;
      onend: () => void;
      onerror: (e: any) => void;
      constructor(text: string) {
        this.text = text;
        this.lang = '';
        this.rate = 1;
        this.pitch = 1;
        this.onend = () => {};
        this.onerror = () => {};
      }
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('Debe mapear la voz nativa de forma síncrona', () => {
    const { result } = renderHook(() => useCMDM_Voice());

    act(() => {
      result.current.reproducirRespuesta("Prueba de rigor");
    });

    expect(cancelMock).toHaveBeenCalledTimes(1);
    expect(speakMock).toHaveBeenCalledTimes(1);
    
    const utteranceArg = speakMock.mock.calls[0][0];
    expect(utteranceArg.text).toBe('Prueba de rigor');
    expect(utteranceArg.lang).toBe('es-MX');

    // 5. Los eventos anti-bug silencioso existen
    expect(typeof utteranceArg.onend).toBe('function');
    expect(typeof utteranceArg.onerror).toBe('function');
  });
});
