import { useEffect } from 'react';
import { motion } from 'motion/react';
import type { ChallengeId } from '../types/challenges.ts';

interface ChallengeOpeningTransitionProps {
  challengeId: ChallengeId;
  onComplete: () => void;
}

const CHALLENGE_META: Record<
  ChallengeId,
  { title: string; subtitle: string; accent: string; bgTint: string }
> = {
  reading: {
    title: 'Quick Reading',
    subtitle: 'Opening the storybook...',
    accent: '#059669',
    bgTint: 'from-emerald-50/95 via-[#FAF6EC] to-emerald-100/80',
  },
  letter: {
    title: 'Letter to Your Future Self',
    subtitle: 'Unfolding your stationery...',
    accent: '#D97706',
    bgTint: 'from-amber-50/95 via-[#FAF6EC] to-amber-100/80',
  },
  picture: {
    title: 'Picture Guess',
    subtitle: 'Revealing the literary frame...',
    accent: '#4F46E5',
    bgTint: 'from-indigo-50/95 via-[#FAF6EC] to-indigo-100/80',
  },
  quote: {
    title: 'Quote Match',
    subtitle: 'Framing famous lines...',
    accent: '#E11D48',
    bgTint: 'from-rose-50/95 via-[#FAF6EC] to-rose-100/80',
  },
  idiom: {
    title: 'Idiom Challenge',
    subtitle: 'Popping open expressions...',
    accent: '#0D9488',
    bgTint: 'from-teal-50/95 via-[#FAF6EC] to-teal-100/80',
  },
};

export function ChallengeOpeningTransition({
  challengeId,
  onComplete,
}: ChallengeOpeningTransitionProps) {
  const meta = CHALLENGE_META[challengeId];

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReduced ? 60 : 580;
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br ${meta.bgTint} backdrop-blur-sm px-6`}
      aria-live="polite"
    >
      <div className="flex flex-col items-center text-center gap-5">
        {/* 1. Quick Reading: Book opening & pages flipping */}
        {challengeId === 'reading' && (
          <div className="relative w-36 h-28 flex items-center justify-center" style={{ perspective: '700px' }}>
            {/* Left cover & page */}
            <motion.div
              initial={{ rotateY: 25, opacity: 0.5 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="w-16 h-24 rounded-l-lg bg-[#FFFDF8] border-2 border-emerald-700 shadow-md flex flex-col justify-center gap-2 px-2.5"
            >
              <div className="h-1.5 bg-emerald-200 rounded w-full" />
              <div className="h-1.5 bg-emerald-200 rounded w-4/5" />
              <div className="h-1.5 bg-emerald-200 rounded w-full" />
            </motion.div>
            {/* Right cover & page */}
            <motion.div
              initial={{ rotateY: -25, opacity: 0.5 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="w-16 h-24 rounded-r-lg bg-[#FFFDF8] border-2 border-emerald-700 border-l-emerald-300 shadow-md flex flex-col justify-center gap-2 px-2.5"
            >
              <div className="h-1.5 bg-emerald-200 rounded w-full" />
              <div className="h-1.5 bg-emerald-200 rounded w-3/4" />
              <div className="h-1.5 bg-emerald-200 rounded w-full" />
            </motion.div>
            {/* Flipping page */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -170 }}
              transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left center' }}
              className="absolute left-1/2 w-15 h-23 rounded-r-md bg-emerald-50 border border-emerald-400 shadow-sm"
            />
          </div>
        )}

        {/* 2. Letter to Future Self: Envelope opening & letter unfolding */}
        {challengeId === 'letter' && (
          <div className="relative w-36 h-32 flex items-end justify-center">
            {/* Unfolding letter rising */}
            <motion.div
              initial={{ y: 24, scaleY: 0.5, opacity: 0 }}
              animate={{ y: -14, scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="w-24 h-20 rounded-t-lg bg-[#FFFDF8] border-2 border-amber-500 shadow-sm px-3 py-2.5 flex flex-col gap-1.5 z-10"
            >
              <div className="h-1.5 w-10 bg-amber-400 rounded" />
              <div className="h-1.5 w-full bg-amber-200 rounded" />
              <div className="h-1.5 w-4/5 bg-amber-200 rounded" />
            </motion.div>
            {/* Envelope body */}
            <div className="absolute bottom-0 w-32 h-20 rounded-b-xl bg-amber-100 border-2 border-amber-700 shadow-md z-20" />
            {/* Envelope flap opening */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: 165 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'top center' }}
              className="absolute bottom-10 w-0 h-0 border-l-[62px] border-r-[62px] border-t-[42px] border-l-transparent border-r-transparent border-t-amber-600 z-30"
            />
          </div>
        )}

        {/* 3. Picture Guess: Frame flip & camera flash reveal */}
        {challengeId === 'picture' && (
          <div className="relative w-36 h-28 flex items-center justify-center" style={{ perspective: '700px' }}>
            <motion.div
              initial={{ rotateY: -90, scale: 0.85 }}
              animate={{ rotateY: 0, scale: 1 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="w-32 h-24 rounded-xl bg-white border-4 border-indigo-600 shadow-lg flex items-center justify-center overflow-hidden relative"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-indigo-400 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-indigo-600" />
              </div>
              {/* Camera flash burst */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.95, 0] }}
                transition={{ duration: 0.4, delay: 0.14 }}
                className="absolute inset-0 bg-white"
              />
            </motion.div>
          </div>
        )}

        {/* 4. Quote Match: Quotation marks sliding in */}
        {challengeId === 'quote' && (
          <div className="relative w-44 h-24 flex items-center justify-center gap-6">
            <motion.span
              initial={{ x: -56, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-7xl font-bold text-rose-600 leading-none select-none"
            >
              “
            </motion.span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="w-16 h-1.5 rounded-full bg-rose-300"
            />
            <motion.span
              initial={{ x: 56, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-7xl font-bold text-rose-600 leading-none select-none"
            >
              ”
            </motion.span>
          </div>
        )}

        {/* 5. Idiom Challenge: Speech bubble popping up */}
        {challengeId === 'idiom' && (
          <motion.div
            initial={{ scale: 0.35, y: 20, opacity: 0 }}
            animate={{ scale: [0.35, 1.08, 1], y: 0, opacity: 1 }}
            transition={{ duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-teal-600 text-white px-7 py-5 rounded-3xl shadow-lg flex items-center gap-2.5"
          >
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="w-3 h-3 rounded-full bg-white"
            />
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="w-3 h-3 rounded-full bg-white"
            />
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.35, delay: 0.35 }}
              className="w-3 h-3 rounded-full bg-white"
            />
            <div className="absolute -bottom-2.5 left-8 w-5 h-5 bg-teal-600 rotate-45 rounded-xs" />
          </motion.div>
        )}

        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1C18]">
            {meta.title}
          </h2>
          <p className="text-base font-medium mt-1" style={{ color: meta.accent }}>
            {meta.subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
