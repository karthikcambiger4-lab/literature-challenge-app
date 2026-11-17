import {
  ArrowRight,
  BookOpen,
  Feather,
  Image as ImageIcon,
  MessageSquareQuote,
  Quote,
  RotateCcw,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { EXHIBITION_VIGNETTE_URL } from '../data/imageAssets.ts';
import type { ChallengeId } from '../types/challenges.ts';
import { CardFloatingIllo } from './HomeDecorations.tsx';

interface HomeScreenProps {
  onSelectChallenge: (id: ChallengeId) => void;
  sessionServedCount: number;
  onResetSessionHistory: () => void;
}

interface ChallengeCardConfig {
  id: ChallengeId;
  tag: string;
  timingLabel: string;
  title: string;
  description: string;
  accentHex: string;
  borderClass: string;
  iconBg: string;
  glowBg: string;
  Icon: typeof BookOpen;
}

const CHALLENGES: ChallengeCardConfig[] = [
  {
    id: 'reading',
    tag: 'Challenge 1',
    timingLabel: '90s Total · 3 Levels',
    title: 'Quick Reading',
    description:
      'Read three English literature passages aloud without pausing. Pace quickens from 20s to 15s to 10s across Levels 1–3.',
    accentHex: '#059669',
    borderClass: 'border-emerald-200/80 hover:border-emerald-400',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white',
    glowBg: 'from-emerald-50/70 via-white/85 to-white/85',
    Icon: BookOpen,
  },
  {
    id: 'letter',
    tag: 'Challenge 2',
    timingLabel: 'Untimed · Keepsake Station',
    title: 'Letter to Your Future Self',
    description:
      'Share your name, age, grade, and a few hopeful lines to generate a warm personalized letter—or write one on paper for our post box.',
    accentHex: '#D97706',
    borderClass: 'border-amber-200/80 hover:border-amber-400',
    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-700 text-white',
    glowBg: 'from-amber-50/70 via-white/85 to-white/85',
    Icon: Feather,
  },
  {
    id: 'picture',
    tag: 'Challenge 3',
    timingLabel: '90s Total · 3 Levels',
    title: 'Picture Guess',
    description:
      'Spot the famous book, character, author, or poem hidden in each illustration. Clear all three levels to win a treat.',
    accentHex: '#4F46E5',
    borderClass: 'border-indigo-200/80 hover:border-indigo-400',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white',
    glowBg: 'from-indigo-50/70 via-white/85 to-white/85',
    Icon: ImageIcon,
  },
  {
    id: 'quote',
    tag: 'Challenge 4',
    timingLabel: '90s Total · 3 Levels',
    title: 'Quote Match',
    description:
      'Match short, famous lines from Tagore, Narayan, Ruskin Bond, Shakespeare, Dickens, and Roald Dahl across three quick levels.',
    accentHex: '#E11D48',
    borderClass: 'border-rose-200/80 hover:border-rose-400',
    iconBg: 'bg-gradient-to-br from-rose-500 to-rose-700 text-white',
    glowBg: 'from-rose-50/70 via-white/85 to-white/85',
    Icon: Quote,
  },
  {
    id: 'idiom',
    tag: 'Challenge 5',
    timingLabel: '90s Total · 3 Levels',
    title: 'Idiom Challenge',
    description:
      'Pick the true meaning behind classic English idioms—from easy everyday sayings in Level 1 to clever phrases in Level 3.',
    accentHex: '#0D9488',
    borderClass: 'border-teal-200/80 hover:border-teal-400',
    iconBg: 'bg-gradient-to-br from-teal-500 to-teal-700 text-white',
    glowBg: 'from-teal-50/70 via-white/85 to-white/85',
    Icon: MessageSquareQuote,
  },
];

export function HomeScreen({
  onSelectChallenge,
  sessionServedCount,
  onResetSessionHistory,
}: HomeScreenProps) {
  const [imgError, setImgError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24 }}
      className="min-h-screen flex flex-col justify-between px-4 sm:px-8 lg:px-12 py-4 lg:py-6 max-w-6xl mx-auto relative z-10"
    >
      {/* Centered Floating College Identity Crest */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-center mb-3.5"
      >
        <div className="home-float-card inline-flex items-center gap-3.5 px-5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2D4BC] shadow-sm">
          {!logoError ? (
            <img
              src="/assets/national-college-logo.png"
              alt="The National College, Basavanagudi emblem"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className="h-12 sm:h-14 w-auto object-contain shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-indigo-900 text-amber-300 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" aria-hidden="true" />
            </div>
          )}

          <div className="text-left leading-tight">
            <div className="font-serif text-lg sm:text-xl font-bold text-[#1F1C18] tracking-tight">
              The National College
            </div>
            <div className="text-xs sm:text-[13px] font-medium text-[#5E5446]">
              Autonomous · Basavanagudi, Bengaluru
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lively Glass-Framed Hero Masthead */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl bg-white/84 backdrop-blur-md border border-[#E4D7C0] shadow-sm p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center"
      >
        <div className="lg:col-span-8 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#706556]">
            <span>Supernova 2026</span>
            <span aria-hidden="true">·</span>
            <span>English Department</span>
            <span aria-hidden="true">·</span>
            <span>Ages 6 to Adult</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1C18] tracking-tight text-balance">
            Literature Challenge Zone
          </h1>

          <p className="text-base sm:text-lg text-[#4B4338] max-w-2xl leading-relaxed">
            Welcome to our English exhibition booth! Step up and test your reading speed, visual
            wit, idioms, and literary memory—clear all three levels within{' '}
            <strong className="font-semibold text-[#1F1C18]">90 seconds</strong> to win your treat.
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              onClick={() => onSelectChallenge('quote')}
              className="cta-highlight inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#1F1C18] hover:bg-[#332E27] text-white font-bold text-base shadow-sm cursor-pointer transition-colors"
            >
              <span>Start with Quote Match</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </motion.button>
            <span className="text-sm font-medium text-[#6B6254]">
              or choose any of the five challenges below
            </span>
          </div>
        </div>

        {/* Framed Literary Vignette */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="rounded-2xl overflow-hidden border border-[#DFD2BA] bg-[#F7F0E2] shadow-xs aspect-[16/9]">
            {!imgError ? (
              <img
                src={EXHIBITION_VIGNETTE_URL}
                alt="Open vintage storybook with fountain quill and inkwell"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#7A6D5A] p-4">
                <BookOpen className="w-10 h-10 mb-2" />
                <span className="font-serif text-sm italic">Supernova 2026 Showcase</span>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Five Modern Glass-Style Challenge Cards */}
      <main className="my-5 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 pt-2">
          {CHALLENGES.map((item, idx) => {
            const Icon = item.Icon;
            const spanClass = idx < 2 ? 'lg:col-span-3' : 'lg:col-span-2';

            return (
              <div key={item.id} className={`${spanClass} relative flex`}>
                {/* Small matching flat illustration gently floating near the card */}
                <div
                  className="home-float-card pointer-events-none absolute -top-4 right-20 z-20 opacity-90"
                  style={{ animationDelay: `${idx * 0.45}s` }}
                  aria-hidden="true"
                >
                  <CardFloatingIllo challengeId={item.id} />
                </div>

                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.28,
                    delay: 0.05 * idx,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectChallenge(item.id)}
                  className={`w-full group text-left rounded-3xl border-2 bg-gradient-to-br ${item.glowBg} backdrop-blur-md overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 flex flex-col ${item.borderClass}`}
                >
                  {/* Bold Accent Top Bar */}
                  <div className="h-2 w-full" style={{ backgroundColor: item.accentHex }} />

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#685F50]">
                          <span style={{ color: item.accentHex }}>{item.tag}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.timingLabel}</span>
                        </div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1F1C18] leading-snug">
                          {item.title}
                        </h2>
                      </div>

                      <div
                        className={`icon-float w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-150 group-hover:scale-110 ${item.iconBg}`}
                        style={{ animationDelay: `${idx * 0.35}s` }}
                      >
                        <Icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                    </div>

                    <p className="text-sm sm:text-[15px] text-[#4A4237] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    <div
                      className="inline-flex items-center gap-2 text-sm font-bold pt-0.5"
                      style={{ color: item.accentHex }}
                    >
                      <span>Open Challenge</span>
                      <ArrowRight
                        className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1.5"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </motion.button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer with Accurate Counter & Requested Label */}
      <footer className="pt-3.5 border-t border-[#DED2BC] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-[#6E6455]">
        <div className="font-medium text-[#4D4438]">
          Supernova 2026 · English Department
        </div>

        <div className="flex items-center gap-4">
          <span className="tabular-nums">
            Unique prompts served this session:{' '}
            <strong className="text-[#1F1C18]">{sessionServedCount}</strong>
          </span>
          {sessionServedCount > 0 && (
            <button
              type="button"
              onClick={onResetSessionHistory}
              className="inline-flex items-center gap-1.5 font-semibold text-[#5C5243] hover:text-[#1F1C18] underline underline-offset-4 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset History</span>
            </button>
          )}
        </div>
      </footer>
    </motion.div>
  );
}
