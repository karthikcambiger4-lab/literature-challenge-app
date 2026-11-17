/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { ChallengeOpeningTransition } from './components/ChallengeOpeningTransition.tsx';
import { FutureLetterView } from './components/FutureLetterView.tsx';
import { HomeDecorations } from './components/HomeDecorations.tsx';
import { HomeScreen } from './components/HomeScreen.tsx';
import { IdiomChallenge } from './components/IdiomChallenge.tsx';
import { PaperOrnaments } from './components/PaperOrnaments.tsx';
import { PictureGuessChallenge } from './components/PictureGuessChallenge.tsx';
import { QuickReadingChallenge } from './components/QuickReadingChallenge.tsx';
import { QuoteMatchChallenge } from './components/QuoteMatchChallenge.tsx';
import type { ChallengeId } from './types/challenges.ts';

const HISTORY_STORAGE_KEY = 'lcz_recent_history_v2';
const COUNT_STORAGE_KEY = 'lcz_served_count_v2';
const MAX_HISTORY_KEYS = 300;

function loadUsedKeys(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function loadServedCount(): number {
  try {
    const raw = localStorage.getItem(COUNT_STORAGE_KEY);
    const num = raw ? Number(raw) : 0;
    return Number.isFinite(num) && num >= 0 ? num : 0;
  } catch {
    return 0;
  }
}

export default function App() {
  const [activeChallenge, setActiveChallenge] = useState<ChallengeId | null>(null);
  const [openingChallenge, setOpeningChallenge] = useState<ChallengeId | null>(null);
  const [usedKeys, setUsedKeys] = useState<string[]>(loadUsedKeys);
  const [servedPromptsCount, setServedPromptsCount] = useState<number>(loadServedCount);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(usedKeys));
    } catch {
      // Ignore storage quota errors
    }
  }, [usedKeys]);

  useEffect(() => {
    try {
      localStorage.setItem(COUNT_STORAGE_KEY, String(servedPromptsCount));
    } catch {
      // Ignore storage quota errors
    }
  }, [servedPromptsCount]);

  const handleSelectChallenge = useCallback((id: ChallengeId) => {
    setOpeningChallenge(id);
  }, []);

  const handleOpeningComplete = useCallback(() => {
    setOpeningChallenge((pending) => {
      if (pending) {
        setActiveChallenge(pending);
      }
      return null;
    });
  }, []);

  const handleMarkUsed = useCallback((keys: string[], promptCount = 1) => {
    setUsedKeys((prev) => {
      const nextSet = new Set(prev);
      for (const k of keys) {
        if (k && k.trim()) nextSet.add(k.trim());
      }
      const arr = Array.from(nextSet);
      return arr.length > MAX_HISTORY_KEYS ? arr.slice(arr.length - MAX_HISTORY_KEYS) : arr;
    });
    if (promptCount > 0) {
      setServedPromptsCount((c) => c + promptCount);
    }
  }, []);

  const handleResetSessionHistory = useCallback(() => {
    setUsedKeys([]);
    setServedPromptsCount(0);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      localStorage.removeItem(COUNT_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const isHome = activeChallenge === null;

  return (
    <div
      className={`${
        isHome ? 'home-paper-canvas' : 'paper-canvas'
      } min-h-screen w-full relative overflow-x-hidden`}
    >
      {isHome ? <HomeDecorations /> : <PaperOrnaments />}

      <AnimatePresence>
        {openingChallenge && (
          <ChallengeOpeningTransition
            key={`open-${openingChallenge}`}
            challengeId={openingChallenge}
            onComplete={handleOpeningComplete}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeChallenge === null && (
          <HomeScreen
            key="home"
            onSelectChallenge={handleSelectChallenge}
            sessionServedCount={servedPromptsCount}
            onResetSessionHistory={handleResetSessionHistory}
          />
        )}

        {activeChallenge === 'reading' && (
          <QuickReadingChallenge
            key="reading"
            usedKeys={usedKeys}
            onMarkUsed={handleMarkUsed}
            onHome={() => setActiveChallenge(null)}
          />
        )}

        {activeChallenge === 'letter' && (
          <FutureLetterView key="letter" onHome={() => setActiveChallenge(null)} />
        )}

        {activeChallenge === 'picture' && (
          <PictureGuessChallenge
            key="picture"
            usedKeys={usedKeys}
            onMarkUsed={handleMarkUsed}
            onHome={() => setActiveChallenge(null)}
          />
        )}

        {activeChallenge === 'quote' && (
          <QuoteMatchChallenge
            key="quote"
            usedKeys={usedKeys}
            onMarkUsed={handleMarkUsed}
            onHome={() => setActiveChallenge(null)}
          />
        )}

        {activeChallenge === 'idiom' && (
          <IdiomChallenge
            key="idiom"
            usedKeys={usedKeys}
            onMarkUsed={handleMarkUsed}
            onHome={() => setActiveChallenge(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
