import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Home, RotateCcw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface OutcomeScreenProps {
  outcome: 'won' | 'lost';
  reason?: string;
  detailReveal?: string;
  elapsedSeconds: number;
  accentHex: string;
  onReset: () => void;
  onHome: () => void;
}

export function OutcomeScreen({
  outcome,
  reason,
  detailReveal,
  elapsedSeconds,
  accentHex,
  onReset,
  onHome,
}: OutcomeScreenProps) {
  useEffect(() => {
    if (outcome !== 'won') return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const fireBurst = () => {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#059669', '#D97706', '#4F46E5', '#E11D48', '#FACC15'],
      });
    };

    fireBurst();
    const t = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.15, y: 0.65 },
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.85, y: 0.65 },
      });
    }, 320);

    return () => clearTimeout(t);
  }, [outcome]);

  const isWin = outcome === 'won';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-2xl mx-auto bg-[#FFFDF8] border border-[#DFD3BD] rounded-2xl p-8 sm:p-10 text-center shadow-sm"
    >
      <div
        className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
          isWin ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
        }`}
      >
        {isWin ? <Award className="w-11 h-11" /> : <Sparkles className="w-10 h-10" />}
      </div>

      <p className="text-sm font-semibold uppercase tracking-widest text-[#6B6254] mb-2">
        {isWin ? 'All 3 Levels Cleared' : 'Challenge Complete'}
      </p>

      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1C18] mb-4 text-balance">
        {isWin ? 'You Have Won Your Treat!' : 'Good try, come play again!'}
      </h2>

      <p className="text-lg text-[#4D453A] mb-4 leading-relaxed">
        {isWin
          ? `Splendid work! You cleared Level 1, Level 2, and Level 3 in ${Math.max(1, Math.round(elapsedSeconds))} seconds.`
          : reason || 'Time ran out before all three levels were cleared. Every reader gets better with each try!'}
      </p>

      {detailReveal && (
        <div className="my-5 px-5 py-3.5 rounded-xl bg-[#FAF4E6] border border-[#E5DAC4] text-[#3B342B] text-base">
          {detailReveal}
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={onReset}
          style={{ backgroundColor: accentHex }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-lg shadow-sm hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 cursor-pointer transition-opacity"
        >
          <RotateCcw className="w-5 h-5" aria-hidden="true" />
          <span>Ready for Next Visitor</span>
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={onHome}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-white border border-[#D8CCB6] text-[#1F1C18] font-semibold text-lg hover:bg-[#F5EFE2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 cursor-pointer transition-colors"
        >
          <Home className="w-5 h-5" aria-hidden="true" />
          <span>Back to Home</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
