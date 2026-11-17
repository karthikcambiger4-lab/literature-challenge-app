import { useEffect, useRef, useState } from 'react';
import { BookOpen, CheckCircle2, Play, Timer, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { LEVEL_READING_SECONDS } from '../data/fallbackData.ts';
import { useTimedChallenge } from '../hooks/useTimedChallenge.ts';
import type { ReadingPassage } from '../types/challenges.ts';
import { fetchReadingRound } from '../utils/challengeApi.ts';
import { OutcomeScreen } from './OutcomeScreen.tsx';
import { TimedChallengeHeader } from './TimedChallengeHeader.tsx';

interface QuickReadingChallengeProps {
  usedKeys: string[];
  onMarkUsed: (keys: string[], promptCount?: number) => void;
  onHome: () => void;
}

const ACCENT_HEX = '#059669';

export function QuickReadingChallenge({
  usedKeys,
  onMarkUsed,
  onHome,
}: QuickReadingChallengeProps) {
  const {
    phase,
    level,
    remainingSeconds,
    elapsedSeconds,
    setIsPaused,
    lossReason,
    start,
    reset,
    advanceLevel,
    failAttempt,
  } = useTimedChallenge();

  const [roundItems, setRoundItems] = useState<ReadingPassage[]>([]);
  const [loading, setLoading] = useState(false);
  const [levelElapsed, setLevelElapsed] = useState(0);
  const markedIdsRef = useRef<Set<string>>(new Set());
  const usedKeysRef = useRef(usedKeys);
  usedKeysRef.current = usedKeys;

  const passage = roundItems[level - 1] ?? null;

  // Mark each passage used when actually displayed to the visitor
  useEffect(() => {
    if (phase !== 'playing' || loading || !passage) return;
    if (markedIdsRef.current.has(passage.id)) return;
    markedIdsRef.current.add(passage.id);
    onMarkUsed([passage.id, passage.title, passage.passage.slice(0, 48)], 1);
  }, [phase, loading, passage, onMarkUsed]);

  // Per-level reading stopwatch
  useEffect(() => {
    if (phase !== 'playing' || loading) return;
    setLevelElapsed(0);
    const timer = setInterval(() => {
      setLevelElapsed((prev) => +(prev + 0.2).toFixed(1));
    }, 200);
    return () => clearInterval(timer);
  }, [phase, loading, level]);

  const handleStart = async () => {
    markedIdsRef.current = new Set();
    setRoundItems([]);
    setLevelElapsed(0);
    setLoading(true);
    start();
    setIsPaused(true);

    const items = await fetchReadingRound(usedKeysRef.current);
    setRoundItems(items);
    setLoading(false);
    setIsPaused(false);
  };

  const handleReset = () => {
    markedIdsRef.current = new Set();
    setRoundItems([]);
    setLevelElapsed(0);
    setLoading(false);
    reset();
  };

  const handlePass = () => {
    advanceLevel();
  };

  const handleFail = () => {
    failAttempt(
      `Stopped at Level ${level}. Take a breath and try again on your next visit!`,
      passage ? `Passage: “${passage.title}” by ${passage.author}` : undefined
    );
  };

  const levelTargetSeconds = LEVEL_READING_SECONDS[level];
  const levelProgressPct = Math.min(100, (levelElapsed / levelTargetSeconds) * 100);
  const targetExceeded = levelElapsed >= levelTargetSeconds;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen flex flex-col relative z-10"
    >
      <TimedChallengeHeader
        title="Quick Reading"
        accentHex={ACCENT_HEX}
        accentBgClass="bg-emerald-50"
        accentTextClass="text-emerald-800"
        accentBorderClass="border-emerald-400"
        currentLevel={level}
        remainingSeconds={remainingSeconds}
        isPlaying={phase === 'playing'}
        isWon={phase === 'won'}
        onHome={onHome}
        onReset={handleReset}
      />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 py-6">
        {phase === 'ready' && (
          <div className="w-full max-w-2xl bg-white/85 backdrop-blur-sm border border-[#DFD3BD] rounded-2xl p-8 sm:p-10 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-emerald-700 mb-2">
              Challenge 1 · 90 Seconds Total
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1C18] mb-3">
              Quick Reading Challenge
            </h1>
            <p className="text-base sm:text-lg text-[#4B4338] leading-relaxed mb-6">
              Read three freshly generated English literature passages aloud without pausing. Clear
              all three levels within 90 seconds total to win your treat!
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8 text-left">
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="text-xs font-bold uppercase text-emerald-800">Level 1</div>
                <div className="font-serif font-bold text-lg text-[#1F1C18]">~20 Seconds</div>
                <div className="text-xs text-[#574E42]">Friendly story opener</div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="text-xs font-bold uppercase text-emerald-800">Level 2</div>
                <div className="font-serif font-bold text-lg text-[#1F1C18]">~15 Seconds</div>
                <div className="text-xs text-[#574E42]">Lively classic prose</div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="text-xs font-bold uppercase text-emerald-800">Level 3</div>
                <div className="font-serif font-bold text-lg text-[#1F1C18]">~10 Seconds</div>
                <div className="text-xs text-[#574E42]">Brisk literary classic</div>
              </div>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              className="cta-highlight inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xl shadow-sm cursor-pointer transition-colors"
            >
              <Play className="w-6 h-6 fill-current" aria-hidden="true" />
              <span>Start Challenge</span>
            </motion.button>
          </div>
        )}

        {phase === 'playing' && (
          <div className="w-full max-w-4xl bg-white/85 backdrop-blur-sm border border-[#DFD3BD] rounded-2xl p-6 sm:p-9 shadow-sm flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EAE0CE]">
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-emerald-700">
                  Level {level} of 3
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#1F1C18]">
                  Read Aloud Without Pausing
                </h2>
              </div>

              <div className="flex items-center gap-3 bg-[#FAF5E9] border border-[#E2D6C0] rounded-xl px-4 py-2.5">
                <Timer
                  className={`w-5 h-5 ${targetExceeded ? 'text-amber-700' : 'text-emerald-700'}`}
                  aria-hidden="true"
                />
                <div className="text-sm">
                  <div className="font-semibold text-[#1F1C18] tabular-nums">
                    Level Pace: {Math.floor(levelElapsed)}s / {levelTargetSeconds}s target
                  </div>
                  <div className="w-40 h-1.5 bg-[#E4DAC6] rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full transition-all duration-200 ${
                        targetExceeded ? 'bg-amber-600' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${levelProgressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="min-h-[200px] flex flex-col justify-center bg-[#FCF8EE] border border-[#E5DAC4] rounded-xl p-6 sm:p-8">
              {loading || !passage ? (
                <div className="text-center py-8 text-[#6E6455] font-serif text-xl italic">
                  Generating a fresh English literature round...
                </div>
              ) : (
                <>
                  <p className="font-serif text-2xl sm:text-[28px] text-[#1F1C18] leading-relaxed tracking-normal">
                    “{passage.passage}”
                  </p>
                  <div className="mt-5 pt-3 border-t border-[#E5DAC4]/80 flex flex-wrap items-center justify-between gap-2 text-sm text-[#665C4E]">
                    <span>
                      <strong className="font-semibold text-[#1F1C18]">{passage.title}</strong> ·{' '}
                      {passage.author}
                    </span>
                    {targetExceeded && (
                      <span className="font-semibold text-amber-800">
                        Target reading time reached — Staff: mark Pass or Fail
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                disabled={loading || !passage}
                onClick={handlePass}
                className="inline-flex items-center justify-center gap-3 px-6 py-4.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xl shadow-xs cursor-pointer transition-colors"
              >
                <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
                <span>{level < 3 ? `Pass — Go to Level ${level + 1}` : 'Pass — Finish & Win!'}</span>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                disabled={loading || !passage}
                onClick={handleFail}
                className="inline-flex items-center justify-center gap-3 px-6 py-4.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xl shadow-xs cursor-pointer transition-colors"
              >
                <XCircle className="w-7 h-7" aria-hidden="true" />
                <span>Fail — End Attempt</span>
              </motion.button>
            </div>
          </div>
        )}

        {(phase === 'won' || phase === 'lost') && (
          <OutcomeScreen
            outcome={phase}
            reason={lossReason}
            elapsedSeconds={elapsedSeconds}
            accentHex={ACCENT_HEX}
            onReset={handleReset}
            onHome={onHome}
          />
        )}
      </main>
    </motion.div>
  );
}
