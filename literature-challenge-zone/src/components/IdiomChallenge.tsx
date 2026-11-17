import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, MessageSquareQuote, Play, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useTimedChallenge } from '../hooks/useTimedChallenge.ts';
import type { IdiomQuestion } from '../types/challenges.ts';
import { fetchIdiomRound } from '../utils/challengeApi.ts';
import { OutcomeScreen } from './OutcomeScreen.tsx';
import { TimedChallengeHeader } from './TimedChallengeHeader.tsx';

interface IdiomChallengeProps {
  usedKeys: string[];
  onMarkUsed: (keys: string[], promptCount?: number) => void;
  onHome: () => void;
}

const ACCENT_HEX = '#0D9488';
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function IdiomChallenge({
  usedKeys,
  onMarkUsed,
  onHome,
}: IdiomChallengeProps) {
  const {
    phase,
    level,
    remainingSeconds,
    elapsedSeconds,
    setIsPaused,
    lossReason,
    detailReveal,
    start,
    reset,
    advanceLevel,
    failAttempt,
  } = useTimedChallenge();

  const [roundItems, setRoundItems] = useState<IdiomQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const markedIdsRef = useRef<Set<string>>(new Set());
  const usedKeysRef = useRef(usedKeys);
  usedKeysRef.current = usedKeys;

  const currentQuestion = roundItems[level - 1] ?? null;

  useEffect(() => {
    if (phase !== 'playing' || loading || !currentQuestion) return;
    if (markedIdsRef.current.has(currentQuestion.id)) return;
    markedIdsRef.current.add(currentQuestion.id);
    onMarkUsed([currentQuestion.id, currentQuestion.idiom], 1);
  }, [phase, loading, currentQuestion, onMarkUsed]);

  const handleStart = async () => {
    markedIdsRef.current = new Set();
    setRoundItems([]);
    setSelectedIndex(null);
    setLoading(true);
    start();
    setIsPaused(true);

    const items = await fetchIdiomRound(usedKeysRef.current);
    setRoundItems(items);
    setLoading(false);
    setIsPaused(false);
  };

  const handleReset = () => {
    markedIdsRef.current = new Set();
    setRoundItems([]);
    setSelectedIndex(null);
    setLoading(false);
    reset();
  };

  const handlePickOption = (idx: number) => {
    if (!currentQuestion || loading || selectedIndex !== null) return;
    setSelectedIndex(idx);
    setIsPaused(true);
  };

  const handleContinueAfterFeedback = () => {
    if (!currentQuestion || selectedIndex === null) return;
    const isCorrect = selectedIndex === currentQuestion.correctIndex;

    if (isCorrect) {
      setSelectedIndex(null);
      if (level < 3) {
        setIsPaused(false);
      }
      advanceLevel();
    } else {
      failAttempt(
        `Stopped at Level ${level}. Now you know a new English idiom for next time!`,
        `“${currentQuestion.idiom}” means: ${currentQuestion.meaning}`
      );
    }
  };

  const hasAnswered = selectedIndex !== null && currentQuestion !== null;
  const isCorrectPick = hasAnswered && selectedIndex === currentQuestion.correctIndex;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen flex flex-col relative z-10"
    >
      <TimedChallengeHeader
        title="Idiom Challenge"
        accentHex={ACCENT_HEX}
        accentBgClass="bg-teal-50"
        accentTextClass="text-teal-800"
        accentBorderClass="border-teal-400"
        currentLevel={level}
        remainingSeconds={remainingSeconds}
        isPlaying={phase === 'playing'}
        isWon={phase === 'won'}
        onHome={onHome}
        onReset={handleReset}
      />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 py-5">
        {phase === 'ready' && (
          <div className="w-full max-w-2xl bg-white/85 backdrop-blur-sm border border-[#DFD3BD] rounded-2xl p-8 sm:p-10 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-teal-600 text-white flex items-center justify-center">
              <MessageSquareQuote className="w-8 h-8" />
            </div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-teal-700 mb-2">
              Challenge 5 · 90 Seconds Total
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1C18] mb-3">
              English Idiom Challenge
            </h1>
            <p className="text-base sm:text-lg text-[#4B4338] leading-relaxed mb-8">
              Guess the true meaning of three well-known English idioms—from easy everyday sayings
              in Level 1 to clever classics in Level 3—within 90 seconds!
            </p>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              className="cta-highlight inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xl shadow-sm cursor-pointer transition-colors"
            >
              <Play className="w-6 h-6 fill-current" aria-hidden="true" />
              <span>Start Challenge</span>
            </motion.button>
          </div>
        )}

        {phase === 'playing' && (
          <div className="w-full max-w-4xl bg-white/85 backdrop-blur-sm border border-[#DFD3BD] rounded-2xl p-5 sm:p-8 shadow-sm flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EAE0CE]">
              <span className="text-sm font-bold uppercase tracking-wider text-teal-700">
                Level {level} of 3
              </span>
              <span className="text-sm sm:text-base font-semibold text-[#4B4338]">
                What does this English idiom mean?
              </span>
            </div>

            <div className="min-h-[108px] flex items-center justify-center bg-[#FCF8EE] border border-[#E5DAC4] rounded-xl px-6 py-5 text-center">
              {loading || !currentQuestion ? (
                <div className="font-serif italic text-xl text-[#6E6455]">
                  Generating fresh idioms for this round...
                </div>
              ) : (
                <div className="font-serif font-bold text-3xl sm:text-4xl text-[#1F1C18] text-balance">
                  “{currentQuestion.idiom}”
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {(currentQuestion?.options ?? ['', '', '', '']).map((optionText, idx) => {
                const isPicked = selectedIndex === idx;
                const isAnswer = currentQuestion && idx === currentQuestion.correctIndex;

                let btnStyle =
                  'bg-white border-[#D6C9B2] hover:border-teal-400 hover:bg-teal-50/50 text-[#1F1C18]';
                if (hasAnswered) {
                  if (isAnswer) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950';
                  } else if (isPicked) {
                    btnStyle = 'bg-rose-50 border-rose-500 text-rose-950';
                  } else {
                    btnStyle = 'bg-white/60 border-[#E5DAC4] text-[#8A7F6E]';
                  }
                }

                return (
                  <motion.button
                    key={`${currentQuestion?.id ?? 'loading'}-${idx}`}
                    type="button"
                    whileTap={!hasAnswered ? { scale: 0.98 } : undefined}
                    disabled={loading || !currentQuestion || hasAnswered}
                    onClick={() => handlePickOption(idx)}
                    className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border-2 text-left font-semibold text-base sm:text-lg transition-colors cursor-pointer disabled:cursor-default ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                          hasAnswered && isAnswer
                            ? 'bg-emerald-600 text-white'
                            : hasAnswered && isPicked
                            ? 'bg-rose-600 text-white'
                            : 'bg-[#F4ECE0] text-[#4A4237]'
                        }`}
                      >
                        {OPTION_LETTERS[idx]}
                      </span>
                      <span className="leading-snug">{loading ? '...' : optionText}</span>
                    </div>

                    {hasAnswered && isAnswer && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" aria-hidden="true" />
                    )}
                    {hasAnswered && isPicked && !isAnswer && (
                      <XCircle className="w-6 h-6 text-rose-600 shrink-0" aria-hidden="true" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {hasAnswered && currentQuestion && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`rounded-xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCorrectPick
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : 'bg-amber-50/90 border-amber-300'
                }`}
              >
                <div className="space-y-1 text-sm sm:text-base text-[#1F1C18]">
                  <div className="font-bold">
                    {isCorrectPick ? 'Correct! Here is a quick note:' : 'Good guess — here is what it means:'}
                  </div>
                  <p className="text-[#3B342B]">
                    <strong className="font-semibold">Meaning:</strong> {currentQuestion.meaning}
                  </p>
                  <p className="font-serif italic text-[#4A4237]">
                    Example: “{currentQuestion.example}”
                  </p>
                </div>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleContinueAfterFeedback}
                  style={{ backgroundColor: isCorrectPick ? '#059669' : '#D97706' }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold text-base sm:text-lg shadow-xs cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <span>
                    {isCorrectPick
                      ? level < 3
                        ? `Continue to Level ${level + 1}`
                        : 'Finish & Win Treat!'
                      : 'Continue'}
                  </span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </motion.button>
              </motion.div>
            )}
          </div>
        )}

        {(phase === 'won' || phase === 'lost') && (
          <OutcomeScreen
            outcome={phase}
            reason={lossReason}
            detailReveal={detailReveal}
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
