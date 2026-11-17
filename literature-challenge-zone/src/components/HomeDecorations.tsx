import type { ChallengeId } from '../types/challenges.ts';

/**
 * Clean, flat, colorful English-literature SVG illustrations placed gently
 * around the home page edges and behind the hero section.
 * Light opacity ensures all foreground text and cards stay effortless to read.
 */
export function HomeDecorations() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* Top-left: Lit Reading Lamp (brass & emerald shade with warm glow) */}
      <div className="home-float-slow absolute -top-2 left-2 sm:left-6 w-24 sm:w-36 opacity-25 sm:opacity-35">
        <svg viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Warm light cone */}
          <path d="M54 78 L22 162 H126 L94 78 Z" fill="#FDE68A" fillOpacity="0.45" />
          {/* Lamp base & stem */}
          <ellipse cx="78" cy="162" rx="34" ry="8" fill="#B45309" />
          <rect x="73" y="84" width="10" height="76" rx="4" fill="#D97706" />
          <path d="M78 84 C78 60 98 52 106 58" stroke="#B45309" strokeWidth="6" strokeLinecap="round" />
          {/* Emerald shade */}
          <path d="M42 78 C46 52 104 52 108 78 Z" fill="#059669" />
          <path d="M42 78 H108" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
          <circle cx="75" cy="79" r="7" fill="#FEF08A" />
        </svg>
      </div>

      {/* Behind Hero (Center-Right): Open Book with Pages Flying */}
      <div className="home-float-alt absolute top-14 right-4 sm:right-16 lg:right-24 w-44 sm:w-64 opacity-20 sm:opacity-28">
        <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Flying detached pages */}
          <g transform="rotate(-14 70 50)">
            <rect x="52" y="28" width="38" height="28" rx="4" fill="#FFFDF7" stroke="#CBD5E1" strokeWidth="2" />
            <path d="M58 37 H82 M58 44 H78" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g transform="rotate(12 135 34)">
            <rect x="116" y="16" width="42" height="30" rx="4" fill="#FFFDF7" stroke="#CBD5E1" strokeWidth="2" />
            <path d="M123 26 H150 M123 33 H144" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g transform="rotate(24 185 68)">
            <rect x="168" y="52" width="36" height="26" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            <path d="M174 61 H196 M174 68 H192" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          </g>
          {/* Open book cover & pages */}
          <path d="M26 112 L120 132 L214 112 V170 L120 186 L26 170 Z" fill="#4F46E5" />
          <path d="M34 104 C66 94 96 100 120 120 C144 100 174 94 206 104 V162 C174 152 144 158 120 176 C96 158 66 152 34 162 Z" fill="#FFFDF8" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M120 120 V176" stroke="#94A3B8" strokeWidth="2.5" />
          <path d="M48 118 C68 114 90 116 106 124 M48 134 C68 130 90 132 106 140 M134 124 C150 116 172 114 192 118 M134 140 C150 132 172 130 192 134" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Top-Right Corner: Quill & Inkwell */}
      <div className="home-float-slow absolute top-3 -right-2 sm:right-4 w-24 sm:w-32 opacity-25 sm:opacity-35" style={{ animationDelay: '0.8s' }}>
        <svg viewBox="0 0 150 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Feather quill */}
          <path d="M72 110 C74 66 100 30 134 16 C128 52 108 86 78 106 Z" fill="#0D9488" />
          <path d="M72 110 C88 76 110 46 132 18" stroke="#CCFBF1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M70 118 L78 104" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
          {/* Inkwell bottle */}
          <rect x="44" y="96" width="38" height="12" rx="4" fill="#312E81" />
          <path d="M36 112 C36 106 90 106 90 112 L96 144 C96 150 30 150 30 144 Z" fill="#4338CA" />
          <rect x="48" y="120" width="30" height="16" rx="3" fill="#EEF2FF" />
        </svg>
      </div>

      {/* Mid-Left Margin: Glass Slipper */}
      <div className="home-float-alt hidden sm:block absolute top-[44%] left-2 lg:left-5 w-24 lg:w-28 opacity-28" style={{ animationDelay: '1.1s' }}>
        <svg viewBox="0 0 150 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sparkle stars */}
          <path d="M36 28 L40 38 L50 42 L40 46 L36 56 L32 46 L22 42 L32 38 Z" fill="#FBBF24" />
          <path d="M116 20 L118 26 L124 28 L118 30 L116 36 L114 30 L108 28 L114 26 Z" fill="#38BDF8" />
          {/* Cinderella glass slipper */}
          <path d="M26 76 C44 82 54 64 58 46 L70 50 C68 68 82 88 124 92 C132 93 132 104 120 106 C90 110 66 102 50 92 L44 110 H30 L34 86 C26 84 22 80 26 76 Z" fill="#7DD3FC" fillOpacity="0.8" stroke="#0284C7" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M62 66 C68 78 86 90 114 94" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Mid-Right Margin: Raven */}
      <div className="home-float-slow hidden sm:block absolute top-[46%] right-2 lg:right-5 w-24 lg:w-28 opacity-28" style={{ animationDelay: '0.4s' }}>
        <svg viewBox="0 0 150 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Golden crescent */}
          <path d="M112 22 A20 20 0 1 0 128 48 A15 15 0 1 1 112 22 Z" fill="#F59E0B" />
          {/* Perch branch */}
          <path d="M22 114 C56 108 92 110 128 118" stroke="#92400E" strokeWidth="6" strokeLinecap="round" />
          {/* Flat stylized raven */}
          <path d="M46 68 C46 44 66 34 84 40 L104 44 L88 54 C92 72 82 92 64 104 L34 122 L42 96 C40 86 46 78 46 68 Z" fill="#312E81" />
          <path d="M58 66 C68 66 78 76 74 90 C62 88 54 78 58 66 Z" fill="#4338CA" />
          <circle cx="78" cy="46" r="3" fill="#FEF3C7" />
          <path d="M66 102 V112 M74 98 V112" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Bottom-Left: Stack of Classic Books */}
      <div className="home-float-alt absolute -bottom-2 left-1 sm:left-6 w-32 sm:w-44 opacity-25 sm:opacity-35" style={{ animationDelay: '0.6s' }}>
        <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bottom crimson book */}
          <rect x="20" y="106" width="152" height="28" rx="5" fill="#E11D48" />
          <rect x="34" y="112" width="124" height="16" rx="2" fill="#FFF1F2" fillOpacity="0.35" />
          <rect x="18" y="106" width="14" height="28" rx="3" fill="#BE123C" />
          {/* Middle emerald book */}
          <rect x="32" y="76" width="136" height="28" rx="5" fill="#059669" />
          <rect x="46" y="82" width="108" height="16" rx="2" fill="#ECFDF5" fillOpacity="0.35" />
          <rect x="30" y="76" width="14" height="28" rx="3" fill="#047857" />
          {/* Top mustard book */}
          <rect x="44" y="48" width="114" height="26" rx="5" fill="#D97706" />
          <rect x="58" y="54" width="86" height="14" rx="2" fill="#FEF3C7" fillOpacity="0.45" />
          <rect x="42" y="48" width="12" height="26" rx="3" fill="#B45309" />
          {/* Bookmark ribbon */}
          <path d="M132 48 V92 L125 84 L118 92 V48 Z" fill="#F43F5E" />
        </svg>
      </div>

      {/* Bottom-Right: Vintage Typewriter */}
      <div className="home-float-slow absolute -bottom-1 right-1 sm:right-6 w-32 sm:w-44 opacity-25 sm:opacity-35" style={{ animationDelay: '1.3s' }}>
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Paper sheet sticking out */}
          <rect x="56" y="18" width="88" height="58" rx="4" fill="#FFFDF7" stroke="#CBD5E1" strokeWidth="2.5" />
          <path d="M68 32 H130 M68 42 H122 M68 52 H112" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Carriage bar */}
          <rect x="36" y="68" width="128" height="14" rx="5" fill="#334155" />
          {/* Teal typewriter body */}
          <path d="M32 82 H168 L178 128 C178 134 172 138 166 138 H34 C28 138 22 134 22 128 Z" fill="#0D9488" />
          <rect x="44" y="96" width="112" height="32" rx="6" fill="#134E4A" />
          {/* Keys */}
          <circle cx="60" cy="105" r="4" fill="#FEF3C7" />
          <circle cx="76" cy="105" r="4" fill="#FEF3C7" />
          <circle cx="92" cy="105" r="4" fill="#FEF3C7" />
          <circle cx="108" cy="105" r="4" fill="#FEF3C7" />
          <circle cx="124" cy="105" r="4" fill="#FEF3C7" />
          <circle cx="140" cy="105" r="4" fill="#FEF3C7" />
          <rect x="66" y="116" width="68" height="6" rx="3" fill="#FDE68A" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Small matching flat illustration floating gracefully near each challenge card.
 */
export function CardFloatingIllo({ challengeId }: { challengeId: ChallengeId }) {
  switch (challengeId) {
    case 'reading':
      // Flat colorful open/closed book
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-xs" fill="none">
          <rect x="8" y="10" width="32" height="28" rx="4" fill="#10B981" />
          <rect x="8" y="10" width="7" height="28" rx="2" fill="#047857" />
          <rect x="19" y="15" width="16" height="8" rx="2" fill="#ECFDF5" />
          <path d="M19 28 H34 M19 32 H30" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'letter':
      // Flat colorful quill and envelope
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-xs" fill="none">
          <rect x="6" y="18" width="30" height="22" rx="4" fill="#FBBF24" />
          <path d="M6 20 L21 31 L36 20" stroke="#92400E" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M27 25 C28 15 35 8 43 5 C41 14 36 21 29 25 Z" fill="#D97706" />
          <path d="M26 27 L41 7" stroke="#FEF3C7" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );

    case 'picture':
      // Flat colorful picture frame
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-xs" fill="none">
          <rect x="7" y="9" width="34" height="30" rx="5" fill="#6366F1" />
          <rect x="12" y="14" width="24" height="20" rx="2" fill="#E0E7FF" />
          <circle cx="19" cy="20" r="3.2" fill="#F59E0B" />
          <path d="M12 34 L21 24 L27 30 L31 26 L36 34 Z" fill="#4F46E5" />
        </svg>
      );

    case 'quote':
      // Flat colorful quotation marks
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-xs" fill="none">
          <circle cx="15" cy="24" r="7" fill="#F43F5E" />
          <path d="M22 24 C22 31 18 36 12 37" stroke="#E11D48" strokeWidth="4" strokeLinecap="round" />
          <circle cx="33" cy="24" r="7" fill="#FB7185" />
          <path d="M40 24 C40 31 36 36 30 37" stroke="#E11D48" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'idiom':
      // Flat colorful speech bubble
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-xs" fill="none">
          <path
            d="M8 14 C8 10 11 8 15 8 H35 C39 8 42 10 42 14 V28 C42 32 39 34 35 34 H21 L12 41 V34 C10 34 8 32 8 28 Z"
            fill="#14B8A6"
          />
          <circle cx="19" cy="21" r="2.4" fill="#FFFFFF" />
          <circle cx="25" cy="21" r="2.4" fill="#FFFFFF" />
          <circle cx="31" cy="21" r="2.4" fill="#FFFFFF" />
        </svg>
      );
  }
}
