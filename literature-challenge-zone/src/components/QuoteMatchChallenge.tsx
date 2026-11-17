import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Play, Quote as QuoteIcon, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useTimedChallenge } from '../hooks/useTimedChallenge.ts';
import type { QuoteQuestion } from '../types/challenges.ts';
import { fetchQuoteRound } from '../utils/challengeApi.ts';
import { OutcomeScreen } from './OutcomeScreen.tsx';
import { TimedChallengeHeader } from './TimedChallengeHeader.tsx';

interface QuoteMatchChallengeProps {
  usedKeys: string[];
  onMarkUsed: (keys: string[], promptCount?: number) => void;
  onHome: () => void;
}

const ACCENT_HEX = '#E11D48';
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function QuoteMatchChallenge({
  usedKeys,
  onMarkUsed,
  onHome,
}: QuoteMatchChallengeProps) {
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

  const [roundItems, setRoundItems] = useState<QuoteQuestion[]>([]);
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
    onMarkUsed(
      [currentQuestion.id, currentQuestion.quote.slice(0, 48), currentQuestion.quote],
      1
    );
  }, [phase, loading, currentQuestion, onMarkUsed]);

  const handleStart = async () => {
    markedIdsRef.current = new Set();
    setRoundItems([]);
    setSelectedIndex(null);
    setLoading(true);
    start();
    setIsPaused(true);

    const items = await fetchQuoteRound(usedKeysRef.current);
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
    const isCorrect = idx === currentQuestion.correctIndex;

    if (isCorrect) {
      setTimeout(() => {
        setSelectedIndex(null);
        advanceLevel();
      }, 420);
    } else {
      setTimeout(() => {
        failAttempt(
          `Missed on Level ${level}. Every great quote is worth remembering!`,
          `Written by ${currentQuestion.author} (${currentQuestion.workTitle}).`
        );
      }, 650);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen flex flex-col relative z-10"
    >
      <TimedChallengeHeader
        title="Quote Match"
        accentHex={ACCENT_HEX}
        accentBgClass="bg-rose-50"
        accentTextClass="text-rose-800"
        accentBorderClass="border-rose-400"
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
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-600 text-white flex items-center justify-center">
              <QuoteIcon className="w-8 h-8" />
            </div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-rose-700 mb-2">
              Challenge 4 · 90 Seconds Total
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1C18] mb-3">
              Quote Match Challenge
            </h1>
            <p className="text-base sm:text-lg text-[#4B4338] leading-relaxed mb-8">
              Match three short, very famous lines from Indian and world writers—like Rabindranath
              Tagore, R. K. Narayan, Ruskin Bond, Sarojini Naidu, Shakespeare, Dickens, Austen, and
              Roald Dahl—within 90 seconds!
            </p>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              className="cta-highlight inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xl shadow-sm cursor-pointer transition-colors"
            >
              <Play className="w-6 h-6 fill-current" aria-hidden="true" />
              <span>Start Challenge</span>
            </motion.button>
          </div>
        )}

        {phase === 'playing' && (
          <div className="w-full max-w-4xl bg-white/85 backdrop-blur-sm border border-[#DFD3BD] rounded-2xl p-6 sm:p-9 shadow-sm flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EAE0CE]">
              <span className="text-sm font-bold uppercase tracking-wider text-rose-700">
                Level {level} of 3
              </span>
              <span className="text-sm sm:text-base font-semibold text-[#4B4338]">
                {currentQuestion?.askType === 'book'
                  ? 'Which famous book or poem is this line from?'
                  : 'Who wrote this famous quote?'}
              </span>
            </div>

            <div className="min-h-[120px] flex items-center justify-center bg-[#FCF8EE] border border-[#E5DAC4] rounded-xl p-6 sm:p-8 text-center">
              {loading || !currentQuestion ? (
                <div className="font-serif italic text-xl text-[#6E6455]">
                  Generating fresh literary quotes for this round...
                </div>
              ) : (
                <blockquote className="font-serif italic text-2xl sm:text-3xl text-[#1F1C18] leading-snug text-balance">
                  {currentQuestion.quote}
                </blockquote>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(currentQuestion?.options ?? ['', '', '', '']).map((optionText, idx) => {
                const isPicked = selectedIndex === idx;
                const isAnswer = currentQuestion && idx === currentQuestion.correctIndex;
                const showResult = selectedIndex !== null && currentQuestion;

                let btnStyle =
                  'bg-white border-[#D6C9B2] hover:border-rose-400 hover:bg-rose-50/50 text-[#1F1C18]';
                if (showResult) {
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
                    whileTap={selectedIndex === null ? { scale: 0.98 } : undefined}
                    disabled={loading || !currentQuestion || selectedIndex !== null}
                    onClick={() => handlePickOption(idx)}
                    className={`flex items-center justify-between gap-3 px-5 py-4.5 rounded-xl border-2 text-left font-semibold text-lg transition-colors cursor-pointer disabled:cursor-default ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base shrink-0 ${
                          showResult && isAnswer
                            ? 'bg-emerald-600 text-white'
                            : showResult && isPicked
                            ? 'bg-rose-600 text-white'
                            : 'bg-[#F4ECE0] text-[#4A4237]'
                        }`}
                      >
                        {OPTION_LETTERS[idx]}
                      </span>
                      <span className="leading-snug">{loading ? '...' : optionText}</span>
                    </div>

                    {showResult && isAnswer && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" aria-hidden="true" />
                    )}
                    {showResult && isPicked && !isAnswer && (
                      <XCircle className="w-6 h-6 text-rose-600 shrink-0" aria-hidden="true" />
                    )}
                  </motion.button>
                );
              })}
            </div>
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
