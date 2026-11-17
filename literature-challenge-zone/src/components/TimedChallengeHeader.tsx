import { Check, Clock, Home, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import type { LevelNumber } from '../types/challenges.ts';

interface TimedChallengeHeaderProps {
  title: string;
  accentHex: string;
  accentBgClass: string;
  accentTextClass: string;
  accentBorderClass: string;
  currentLevel: LevelNumber;
  remainingSeconds: number;
  isPlaying: boolean;
  isWon?: boolean;
  onHome: () => void;
  onReset: () => void;
}

export function formatTimer(totalSeconds: number): string {
  const clamped = Math.max(0, Math.ceil(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function TimedChallengeHeader({
  title,
  accentHex,
  accentBgClass,
  accentTextClass,
  accentBorderClass,
  currentLevel,
  remainingSeconds,
  isPlaying,
  isWon = false,
  onHome,
  onReset,
}: TimedChallengeHeaderProps) {
  const isUrgent = remainingSeconds <= 15 && isPlaying;
  const isWarning = remainingSeconds > 15 && remainingSeconds <= 30 && isPlaying;
  const clampedSeconds = Math.max(0, Math.min(90, remainingSeconds));
  const remainingPercent = (clampedSeconds / 90) * 100;

  return (
    <header className="w-full border-b border-[#E3D8C3] bg-[#FCF9F2]/90 backdrop-blur-sm px-4 sm:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Big Clear Home Button & Title */}
        <div className="flex items-center gap-4 min-w-0">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onHome}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white border border-[#D8CCB6] text-[#1F1C18] font-semibold text-base shadow-xs hover:bg-[#F5EFE2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            <span>Home</span>
          </motion.button>

          <div className="hidden sm:block min-w-0">
            <h2 className="font-serif text-xl lg:text-2xl font-bold text-[#1F1C18] truncate">
              {title}
            </h2>
            <div className="flex items-center gap-2 text-xs font-medium text-[#6B6254]">
              <span>90-Second Challenge</span>
              <span aria-hidden="true">·</span>
              <span>3 Levels in Order</span>
            </div>
          </div>
        </div>

        {/* Center: Sequential Pop-In Level 1, Level 2, Level 3 Badges */}
        <div className="flex items-center gap-2" aria-label="Challenge levels">
          {([1, 2, 3] as LevelNumber[]).map((lvl, idx) => {
            const isCompleted = isWon || lvl < currentLevel;
            const isActive = !isWon && lvl === currentLevel && isPlaying;
            return (
              <motion.div
                key={`${isPlaying ? 'play' : 'idle'}-${lvl}`}
                initial={isPlaying ? { opacity: 0, scale: 0.72, y: -6 } : false}
                animate={{ opacity: 1, scale: isActive ? 1.04 : 1, y: 0 }}
                transition={{
                  delay: isPlaying ? idx * 0.12 : 0,
                  type: 'spring',
                  stiffness: 380,
                  damping: 22,
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 text-sm font-bold transition-colors whitespace-nowrap shadow-xs ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                    : isActive
                    ? `${accentBgClass} ${accentTextClass} ${accentBorderClass}`
                    : 'bg-white/80 text-[#7A7062] border-[#E3D8C3]'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-emerald-700 stroke-[2.75]" aria-hidden="true" />
                ) : (
                  <span>{lvl}.</span>
                )}
                <span>Level {lvl}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Large Countdown Timer with Progress Bar + Reset */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`min-w-[185px] sm:min-w-[205px] flex flex-col gap-2 px-5 py-2.5 rounded-xl border-2 transition-colors ${
              isUrgent
                ? 'bg-rose-50 border-rose-500 text-rose-800'
                : isWarning
                ? 'bg-amber-50 border-amber-500 text-amber-900'
                : 'bg-white border-[#D8CCB6] text-[#1F1C18]'
            }`}
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <Clock
                className="w-6 h-6 shrink-0"
                style={{ color: isUrgent ? '#BE123C' : isWarning ? '#B45309' : accentHex }}
                aria-hidden="true"
              />
              <div className="leading-tight">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6254]">
                  {isUrgent ? 'Hurry! Time Left' : 'Total Time Left'}
                </div>
                <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold tracking-tight">
                  {formatTimer(remainingSeconds)}
                </div>
              </div>
            </div>

            {/* Visual 90-second remaining progress bar */}
            <div
              role="progressbar"
              aria-label="Remaining 90-second challenge time"
              aria-valuemin={0}
              aria-valuemax={90}
              aria-valuenow={Math.round(clampedSeconds)}
              className="w-full h-2.5 rounded-full bg-[#E8DEC9] overflow-hidden"
            >
              <div
                className="h-full rounded-full transition-[width] duration-200 ease-linear"
                style={{
                  width: `${remainingPercent}%`,
                  backgroundColor: accentHex,
                }}
              />
            </div>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#D8CCB6] text-[#3F3930] font-semibold text-base hover:bg-[#F5EFE2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
            title="Reset challenge for next visitor"
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
            <span>Reset</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
