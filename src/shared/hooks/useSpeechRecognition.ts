/**
 * useSpeechRecognition
 * ─────────────────────────────────────────────────────────────────────────────
 * Encapsulates the Web Speech API (SpeechRecognition / webkitSpeechRecognition)
 * and all related TypeScript types that were previously duplicated inside
 * Home.tsx. Import this hook in any component that needs voice search.
 *
 * Usage:
 *   const { isListening, voiceError, startListening } = useSpeechRecognition({
 *     onResult: (transcript) => setSearchTerm(transcript),
 *   });
 */

import { useCallback, useRef, useState } from 'react';

// ─── Web Speech API types ─────────────────────────────────────────────────────

export interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  abort: () => void;
  start: () => void;
  stop: () => void;
}

export interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

export interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0?: SpeechRecognitionAlternativeLike;
}

export interface SpeechRecognitionResultListLike {
  length: number;
  item: (index: number) => SpeechRecognitionResultLike;
  [index: number]: SpeechRecognitionResultLike;
}

export interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}

export interface SpeechRecognitionErrorEventLike {
  error?: string;
}

export type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseSpeechRecognitionOptions {
  /** Called with the combined (final + interim) transcript on each result event. */
  onResult: (transcript: string) => void;
  /** BCP 47 language tag. Defaults to 'en-US'. */
  lang?: string;
  /**
   * Milliseconds of silence after the last interim result before the
   * recognition session is auto-stopped. Defaults to 2000 ms.
   */
  silenceTimeout?: number;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  voiceError: string;
  /** Toggle listening on/off. Pass the current search term so the hook can
   *  prepend it when building the next transcript. */
  toggleListening: (currentTerm: string) => void;
  /** Imperatively stop recognition (e.g. on component unmount). */
  stop: () => void;
  clearError: () => void;
}

export function useSpeechRecognition({
  onResult,
  lang = 'en-US',
  silenceTimeout = 100000,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError]   = useState('');

  const recognitionRef    = useRef<SpeechRecognitionLike | null>(null);
  const voiceBaseTermRef  = useRef('');
  const silenceTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.abort();
    clearSilenceTimer();
    setIsListening(false);
  }, [clearSilenceTimer]);

  const toggleListening = useCallback((currentTerm: string) => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      clearSilenceTimer();
      
      return;
    }



    const Recognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceError('Voice search is not supported in this browser.');
      return;
    }

    const recognition = new Recognition();
    recognitionRef.current   = recognition;
    voiceBaseTermRef.current = currentTerm.trim();

    recognition.continuous     = true;
    recognition.interimResults = true;
    recognition.lang           = lang;

    recognition.onresult = (event) => {
      let finalTranscript   = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; i += 1) {
        const result     = event.results[i] ?? event.results.item(i);
        const transcript = result?.[0]?.transcript ?? '';
        if (result?.isFinal) finalTranscript   += transcript;
        else                  interimTranscript += transcript;
      }

      const spoken   = `${finalTranscript} ${interimTranscript}`.trim();
      const combined = `${voiceBaseTermRef.current} ${spoken}`.trim();

      setVoiceError('');
      onResult(combined);

      // Reset the silence timer on every new result
      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(() => {
        recognitionRef.current?.stop();
        setIsListening(false);
      }, silenceTimeout);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setVoiceError(
        event.error === 'not-allowed'
          ? 'Microphone access was blocked.'
          : 'We could not hear that clearly. Please try again.',
      );
    };

    recognition.onend = () => {
      setIsListening(false);
      clearSilenceTimer();
    };

    setVoiceError('');
    setIsListening(true);
    recognition.start();
    
  }, [clearSilenceTimer, isListening, lang, onResult, silenceTimeout]);

  return { isListening, voiceError, toggleListening, stop,clearError: () => setVoiceError('') };

  
}
