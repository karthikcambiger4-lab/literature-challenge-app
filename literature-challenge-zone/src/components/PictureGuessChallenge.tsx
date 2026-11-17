import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  Image as ImageIcon,
  Play,
  Send,
  XCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { PICTURE_IMAGE_ASSETS } from '../data/imageAssets.ts';
import { useTimedChallenge } from '../hooks/useTimedChallenge.ts';
import type { LevelNumber, PicturePuzzle } from '../types/challenges.ts';
import { fetchPicturePuzzle } from '../utils/challengeApi.ts';
import { isGuessCorrect } from '../utils/matching.ts';
import { OutcomeScreen } from './OutcomeScreen.tsx';
import { TimedChallengeHeader } from './TimedChallengeHeader.tsx';

interface PictureGuessChallengeProps {
  usedKeys: string[];
  onMarkUsed: (keys: string[], promptCount?: number) => void;
  onHome: () => void;
}

const ACCENT_HEX = '#4F46E5';

export function PictureGuessChallenge({
  usedKeys,
  onMarkUsed,
  onHome,
}: PictureGuessChallengeProps) {
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

  const [puzzle, setPuzzle] = useState<PicturePuzzle | null>(null);
  const [loading, setLoading] = useState(false);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'retry'; text: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [peekAnswer, setPeekAnswer] = useState(false);
  const [imgError, setImgError] = useState(false);

  const roundPromisesRef = useRef<Partial<Record<LevelNumber, Promise<PicturePuzzle>>>>({});
  const roundRunIdRef = useRef<number>(0);
  const markedIdsRef = useRef<Set<string>>(new Set());
  const usedKeysRef = useRef(usedKeys);
  usedKeysRef.current = usedKeys;

  const beginFreshRoundPromises = () => {
    const runId = Date.now();
    roundRunIdRef.current = runId;
    const baseUsed = [...usedKeysRef.current];
    roundPromisesRef.current = {
      1: fetchPicturePuzzle(1, baseUsed),
      2: fetchPicturePuzzle(2, baseUsed),
      3: fetchPicturePuzzle(3, baseUsed),
    };
    return runId;
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    let cancelled = false;
    const activeRunId = roundRunIdRef.current;

    const loadCurrentLevel = async () => {
      setGuess('');
      setFeedback(null);
      setShowHint(false);
      setPeekAnswer(false);
      setImgError(false);
      setLoading(true);
      setIsPaused(true);

      const promise =
        roundPromisesRef.current[level] ?? fetchPicturePuzzle(level, usedKeysRef.current);
      const item = await promise;
      if (cancelled || roundRunIdRef.current !== activeRunId) return;

      setPuzzle(item);
      if (!markedIdsRef.current.has(item.id)) {
        markedIdsRef.current.add(item.id);
        onMarkUsed([item.id, item.answer], 1);
      }
      setLoading(false);
      setIsPaused(false);
    };

    loadCurrentLevel();
    return () => {
      cancelled = true;
    };
  }, [phase, level, onMarkUsed, setIsPaused]);

  const handleStart = () => {
    markedIdsRef.current = new Set();
    setPuzzle(null);
    beginFreshRoundPromises();
    start();
  };

  const handleReset = () => {
    roundRunIdRef.current = 0;
    roundPromisesRef.current = {};
    markedIdsRef.current = new Set();
    setPuzzle(null);
    setGuess('');
    setFeedback(null);
    setShowHint(false);
    setPeekAnswer(false);
    reset();
  };

  const handleCorrect = () => {
    if (!puzzle || feedback?.type === 'correct') return;
    setFeedback({ type: 'correct', text: `Correct! It is ${puzzle.answer}.` });
    setTimeout(() => {
      advanceLevel();
    }, 420);
  };

  const handleWrong = () => {
    if (!puzzle) return;
    failAttempt(
      `Stopped at Level ${level}. Nice effort on this visual clue!`,
      `Answer: ${puzzle.answer} (${puzzle.category})`
    );
  };

  const handleCheckGuess = (e: FormEvent) => {
    e.preventDefault();
    if (!puzzle || loading) return;
    if (!guess.trim()) return;

    const allAccepted = [puzzle.answer, ...(puzzle.acceptedAnswers || [])];
    if (isGuessCorrect(guess, allAccepted)) {
      handleCorrect();
    } else {
      setFeedback({
        type: 'retry',
        text: 'Not quite that title—try another guess or ask staff to judge!',
      });
    }
  };

  const imageUrl = puzzle?.imageKey ? PICTURE_IMAGE_ASSETS[puzzle.imageKey] : undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen flex flex-col relative z-10"
    >
      <TimedChallengeHeader
        title="Picture Guess"
        accentHex={ACCENT_HEX}
        accentBgClass="bg-indigo-50"
        accentTextClass="text-indigo-800"
        accentBorderClass="border-indigo-400"
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
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
              <ImageIcon className="w-8 h-8" />
            </div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-indigo-700 mb-2">
              Challenge 3 · 90 Seconds Total
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1C18] mb-3">
              Picture Guess Challenge
            </h1>
            <p className="text-base sm:text-lg text-[#4B4338] leading-relaxed mb-8">
              Each illustration points to a famous English literature story, character, book, poem,
              or author. Name all three freshly generated clues from Level 1 to Level 3 within 90
              seconds!
            </p>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              className="cta-highlight inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl shadow-sm cursor-pointer transition-colors"
            >
              <Play className="w-6 h-6 fill-current" aria-hidden="true" />
              <span>Start Challenge</span>
            </motion.button>
          </div>
        )}

        {phase === 'playing' && (
          <div className="w-full max-w-5xl bg-white/85 backdrop-blur-sm border border-[#DFD3BD] rounded-2xl p-5 sm:p-7 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <div className="rounded-xl overflow-hidden border-2 border-[#DED2BC] bg-[#FAF4E6] aspect-[4/3] flex items-center justify-center">
                {loading || !puzzle ? (
                  <div className="p-8 text-center font-serif italic text-xl text-[#6E6455]">
                    Sketching a brand-new literary clue...
                  </div>
                ) : imageUrl && !imgError ? (
                  <img
                    src={imageUrl}
                    alt={`Literary visual clue for Level ${level}`}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : puzzle.svgMarkup ? (
                  <div
                    className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                    dangerouslySetInnerHTML={{ __html: puzzle.svgMarkup }}
                  />
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <ImageIcon className="w-14 h-14 mx-auto text-indigo-600 opacity-75" />
                    <p className="font-serif text-xl text-[#3B342B]">{puzzle.captionNote}</p>
                  </div>
                )}
              </div>
              {puzzle && !loading && (
                <p className="mt-2.5 text-sm font-serif italic text-[#5C5243] text-center">
                  {puzzle.captionNote}
                </p>
              )}
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-indigo-700">
                    Level {level} of 3 {puzzle ? `· ${puzzle.category} Clue` : ''}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1C18]">
                  What does this picture represent?
                </h2>

                {puzzle && !loading && (
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowHint((v) => !v)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-sm font-semibold hover:bg-indigo-100 cursor-pointer transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" aria-hidden="true" />
                      <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPeekAnswer((v) => !v)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F5EFE2] border border-[#D8CCB6] text-[#4B4338] text-sm font-semibold hover:bg-[#ECE2CE] cursor-pointer transition-colors"
                    >
                      {peekAnswer ? (
                        <EyeOff className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                      <span>{peekAnswer ? 'Hide Answer' : 'Staff: Peek Answer'}</span>
                    </button>
                  </div>
                )}

                {showHint && puzzle && (
                  <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-sm text-indigo-950">
                    <strong className="font-semibold">Hint:</strong> {puzzle.hint}
                  </div>
                )}

                {peekAnswer && puzzle && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-sm text-amber-950">
                    <strong className="font-semibold">Staff Answer Key:</strong> {puzzle.answer}
                  </div>
                )}
              </div>

              <form onSubmit={handleCheckGuess} className="space-y-2.5 pt-1">
                <label htmlFor="picture-guess-input" className="block text-sm font-semibold text-[#4B4338]">
                  Type Visitor’s Answer (optional — or use Staff buttons below)
                </label>
                <div className="flex gap-2">
                  <input
                    id="picture-guess-input"
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    disabled={loading || !puzzle}
                    placeholder="e.g., Cinderella, Poe..."
                    className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-white border border-[#CFC1AA] text-base text-[#1F1C18] focus:outline-none focus:border-indigo-600"
                  />
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.96 }}
                    disabled={loading || !puzzle || !guess.trim()}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-base cursor-pointer transition-colors shrink-0"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                    <span>Check</span>
                  </motion.button>
                </div>

                {feedback && (
                  <div
                    className={`px-3.5 py-2.5 rounded-lg text-sm font-semibold ${
                      feedback.type === 'correct'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {feedback.text}
                  </div>
                )}
              </form>

              <div className="pt-3 border-t border-[#EAE0CE] space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#6E6455]">
                  Staff Decision Override
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    disabled={loading || !puzzle}
                    onClick={handleCorrect}
                    className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-lg shadow-xs cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                    <span>Correct</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    disabled={loading || !puzzle}
                    onClick={handleWrong}
                    className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-lg shadow-xs cursor-pointer transition-colors"
                  >
                    <XCircle className="w-6 h-6" aria-hidden="true" />
                    <span>Wrong</span>
                  </motion.button>
                </div>
              </div>
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
