import { useCallback, useEffect, useRef, useState } from 'react';
import type { LevelNumber } from '../types/challenges.ts';

export type ChallengePhase = 'ready' | 'playing' | 'won' | 'lost';

const TOTAL_MS = 90_000;

export function useTimedChallenge() {
  const [phase, setPhase] = useState<ChallengePhase>('ready');
  const [level, setLevel] = useState<LevelNumber>(1);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(90);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [lossReason, setLossReason] = useState<string>('');
  const [detailReveal, setDetailReveal] = useState<string>('');

  const remainingMsRef = useRef<number>(TOTAL_MS);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== 'playing' || isPaused) {
      lastTickRef.current = null;
      return;
    }

    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      if (lastTickRef.current === null) {
        lastTickRef.current = Date.now();
        return;
      }
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;
      remainingMsRef.current = Math.max(0, remainingMsRef.current - delta);
      setRemainingSeconds(remainingMsRef.current / 1000);

      if (remainingMsRef.current <= 0) {
        clearInterval(interval);
        setLossReason('Time is up! The 90-second timer finished before all three levels were cleared.');
        setPhase('lost');
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phase, isPaused]);

  const start = useCallback(() => {
    remainingMsRef.current = TOTAL_MS;
    lastTickRef.current = null;
    setRemainingSeconds(90);
    setLevel(1);
    setLossReason('');
    setDetailReveal('');
    setIsPaused(false);
    setPhase('playing');
  }, []);

  const reset = useCallback(() => {
    remainingMsRef.current = TOTAL_MS;
    lastTickRef.current = null;
    setRemainingSeconds(90);
    setLevel(1);
    setLossReason('');
    setDetailReveal('');
    setIsPaused(false);
    setPhase('ready');
  }, []);

  const advanceLevel = useCallback(() => {
    setLevel((prev) => {
      if (prev === 1) return 2;
      if (prev === 2) return 3;
      setPhase('won');
      return 3;
    });
  }, []);

  const failAttempt = useCallback((reason: string, reveal?: string) => {
    setLossReason(reason);
    setDetailReveal(reveal || '');
    setPhase('lost');
  }, []);

  const elapsedSeconds = (TOTAL_MS - remainingMsRef.current) / 1000;

  return {
    phase,
    level,
    remainingSeconds,
    elapsedSeconds,
    isPaused,
    setIsPaused,
    lossReason,
    detailReveal,
    setDetailReveal,
    start,
    reset,
    advanceLevel,
    failAttempt,
  };
}
