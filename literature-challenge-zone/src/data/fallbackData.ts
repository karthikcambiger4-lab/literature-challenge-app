import type {
  IdiomQuestion,
  LevelNumber,
  PicturePuzzle,
  QuoteQuestion,
  ReadingPassage,
} from '../types/challenges.ts';

export const LEVEL_READING_SECONDS: Record<LevelNumber, number> = {
  1: 20,
  2: 15,
  3: 10,
};

export const BACKUP_READING_PASSAGES: ReadingPassage[] = [
  // LEVEL 1 (~20s, accessible for young readers & everyone)
  {
    id: 'read-l1-1',
    level: 1,
    title: 'The Tale of Peter Rabbit',
    author: 'Beatrix Potter',
    passage:
      'Once upon a time there were four little rabbits, and their names were Flopsy, Mopsy, Cotton-tail, and Peter. They lived with their mother in a sand-bank, underneath the root of a very big fir-tree.',
    recommendedSeconds: 20,
    source: 'backup',
  },
  {
    id: 'read-l1-2',
    level: 1,
    title: 'Winnie-the-Pooh',
    author: 'A. A. Milne',
    passage:
      'Here is Edward Bear, coming downstairs now, bump, bump, bump, on the back of his head, behind Christopher Robin. It is, as far as he knows, the only way of coming downstairs.',
    recommendedSeconds: 20,
    source: 'backup',
  },
  {
    id: 'read-l1-3',
    level: 1,
    title: 'The Velveteen Rabbit',
    author: 'Margery Williams',
    passage:
      'There was once a velveteen rabbit, and in the beginning he was really splendid. He was fat and bunchy, as a rabbit should be, and his coat was spotted brown and white.',
    recommendedSeconds: 20,
    source: 'backup',
  },
  {
    id: 'read-l1-4',
    level: 1,
    title: 'The Tortoise and the Hare',
    author: 'Aesop (English Retelling)',
    passage:
      'The hare laughed at the slow little tortoise and boasted that nobody could beat him in a race. Yet step by steady step, the quiet tortoise kept moving forward until he crossed the finish line first.',
    recommendedSeconds: 20,
    source: 'backup',
  },
  {
    id: 'read-l1-5',
    level: 1,
    title: 'Peter Pan',
    author: 'J. M. Barrie',
    passage:
      'All children, except one, grow up. They soon know that they will grow up, and the way Wendy knew was this. One day when she was two years old she was playing in a garden.',
    recommendedSeconds: 20,
    source: 'backup',
  },
  {
    id: 'read-l1-6',
    level: 1,
    title: 'The Wind in the Willows',
    author: 'Kenneth Grahame',
    passage:
      'The Mole had been working very hard all the morning, spring-cleaning his little home. Suddenly he flung down his brush on the floor, said "Bother!" and bolted out of the house into the warm spring sun.',
    recommendedSeconds: 20,
    source: 'backup',
  },

  // LEVEL 2 (~15s, lively intermediate classics)
  {
    id: 'read-l2-1',
    level: 2,
    title: "Alice's Adventures in Wonderland",
    author: 'Lewis Carroll',
    passage:
      'Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it.',
    recommendedSeconds: 15,
    source: 'backup',
  },
  {
    id: 'read-l2-2',
    level: 2,
    title: 'The Wonderful Wizard of Oz',
    author: 'L. Frank Baum',
    passage:
      'Dorothy lived in the midst of the great Kansas prairies, with Uncle Henry, who was a farmer, and Aunt Em, who was the farmer’s wife. Their house was small, for the lumber to build it had to be carried by wagon many miles.',
    recommendedSeconds: 15,
    source: 'backup',
  },
  {
    id: 'read-l2-3',
    level: 2,
    title: 'Treasure Island',
    author: 'Robert Louis Stevenson',
    passage:
      'I remember him as if it were yesterday, as he came plodding to the inn door, his sea-chest following behind him in a hand-barrow; a tall, strong, heavy, nut-brown man, with a sabre cut across one cheek.',
    recommendedSeconds: 15,
    source: 'backup',
  },
  {
    id: 'read-l2-4',
    level: 2,
    title: 'The Secret Garden',
    author: 'Frances Hodgson Burnett',
    passage:
      'She walked under one of the fairy-like gray arches between the trees and looked up at the sprays and tendrils which formed them. High above the hidden wall, a robin redbreast hopped along a crooked branch.',
    recommendedSeconds: 15,
    source: 'backup',
  },
  {
    id: 'read-l2-5',
    level: 2,
    title: 'The Jungle Book',
    author: 'Rudyard Kipling',
    passage:
      'It was seven o’clock of a very warm evening in the Seeonee hills when Father Wolf woke up from his day’s rest, scratched himself, yawned, and spread out his paws one after the other to get rid of the sleepy feeling.',
    recommendedSeconds: 15,
    source: 'backup',
  },
  {
    id: 'read-l2-6',
    level: 2,
    title: 'Little Women',
    author: 'Louisa May Alcott',
    passage:
      'Christmas won’t be Christmas without any presents, grumbled Jo, lying on the rug. It’s so dreadful to be poor, sighed Meg, looking down at her old dress, while Beth hummed softly beside the crackling hearth.',
    recommendedSeconds: 15,
    source: 'backup',
  },

  // LEVEL 3 (~10s, richer classic prose & poetry)
  {
    id: 'read-l3-1',
    level: 3,
    title: 'A Tale of Two Cities',
    author: 'Charles Dickens',
    passage:
      'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.',
    recommendedSeconds: 10,
    source: 'backup',
  },
  {
    id: 'read-l3-2',
    level: 3,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    passage:
      'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife, however little known the feelings or views of such a man may be.',
    recommendedSeconds: 10,
    source: 'backup',
  },
  {
    id: 'read-l3-3',
    level: 3,
    title: 'Frankenstein',
    author: 'Mary Shelley',
    passage:
      'It was on a dreary night of November that I beheld the accomplishment of my toils, with an anxiety that almost amounted to agony, collecting the instruments of life around me.',
    recommendedSeconds: 10,
    source: 'backup',
  },
  {
    id: 'read-l3-4',
    level: 3,
    title: 'As You Like It',
    author: 'William Shakespeare',
    passage:
      'All the world’s a stage, and all the men and women merely players; they have their exits and their entrances, and one man in his time plays many parts.',
    recommendedSeconds: 10,
    source: 'backup',
  },
  {
    id: 'read-l3-5',
    level: 3,
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    passage:
      'There was no possibility of taking a walk that day; the cold winter wind had brought with it clouds so sombre, and a rain so penetrating, that further out-door exercise was out of the question.',
    recommendedSeconds: 10,
    source: 'backup',
  },
  {
    id: 'read-l3-6',
    level: 3,
    title: 'The Tyger',
    author: 'William Blake',
    passage:
      'Tyger Tyger, burning bright, in the forests of the night; what immortal hand or eye, could frame thy fearful symmetry?',
    recommendedSeconds: 10,
    source: 'backup',
  },
];

// Hand-crafted clean SVG bookplate illustrations for offline/backup Picture Guess reliability
const SVG_RED_RIDING_HOOD = `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" fill="#FBF5E6"/>
  <rect x="24" y="24" width="592" height="432" rx="12" fill="none" stroke="#D9CBB3" stroke-width="3"/>
  <path d="M80 390 Q320 350 560 390 L560 430 L80 430 Z" fill="#D4DFC7"/>
  <g fill="#4F6D4A" opacity="0.75">
    <polygon points="130,375 160,210 190,375"/>
    <polygon points="460,375 495,190 530,375"/>
    <polygon points="210,375 235,250 260,375"/>
  </g>
  <path d="M295 140 C255 150 235 210 220 340 L405 340 C390 215 370 150 330 140 Z" fill="#C81E32"/>
  <path d="M312 135 C278 135 262 175 274 202 C295 190 330 190 348 202 C360 175 345 135 312 135 Z" fill="#9F1239"/>
  <circle cx="312" cy="176" r="24" fill="#FDE6D2"/>
  <path d="M355 280 L435 280 L422 336 L368 336 Z" fill="#C68B45" stroke="#784B1D" stroke-width="3"/>
  <path d="M368 280 C368 238 422 238 422 280" fill="none" stroke="#784B1D" stroke-width="5"/>
  <path d="M360 280 L430 280" stroke="#F8FAFC" stroke-width="6" stroke-dasharray="10 6"/>
  <circle cx="385" cy="274" r="9" fill="#DC2626"/>
  <circle cx="408" cy="274" r="9" fill="#B91C1C"/>
</svg>`;

const SVG_GOLDILOCKS_BEARS = `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" fill="#FAF4E6"/>
  <rect x="24" y="24" width="592" height="432" rx="12" fill="none" stroke="#D9CBB3" stroke-width="3"/>
  <rect x="80" y="330" width="480" height="24" rx="6" fill="#9C6B3B"/>
  <rect x="115" y="354" width="22" height="80" fill="#7C5229"/>
  <rect x="503" y="354" width="22" height="80" fill="#7C5229"/>
  <path d="M125 275 Q195 355 265 275 Z" fill="#2563EB" stroke="#1E3A8A" stroke-width="3"/>
  <ellipse cx="195" cy="275" rx="70" ry="14" fill="#FDE68A"/>
  <path d="M275 290 Q330 350 385 290 Z" fill="#059669" stroke="#065F46" stroke-width="3"/>
  <ellipse cx="330" cy="290" rx="55" ry="11" fill="#FDE68A"/>
  <path d="M405 304 Q445 344 485 304 Z" fill="#E11D48" stroke="#9F1239" stroke-width="3"/>
  <ellipse cx="445" cy="304" rx="40" ry="8" fill="#FDE68A"/>
  <path d="M180 250 Q168 228 184 205 M208 248 Q220 225 204 200" fill="none" stroke="#B49A78" stroke-width="3" stroke-linecap="round"/>
  <path d="M330 268 Q318 248 332 230" fill="none" stroke="#B49A78" stroke-width="3" stroke-linecap="round"/>
  <circle cx="320" cy="128" r="36" fill="#F59E0B" opacity="0.22"/>
  <path d="M292 135 Q306 105 320 135 Q334 105 348 135" fill="none" stroke="#D97706" stroke-width="6" stroke-linecap="round"/>
</svg>`;

const SVG_CHARLOTTES_WEB = `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" fill="#F9F4E8"/>
  <rect x="24" y="24" width="592" height="432" rx="12" fill="none" stroke="#D9CBB3" stroke-width="3"/>
  <polygon points="150,240 320,130 490,240 490,415 150,415" fill="#B91C1C" opacity="0.16"/>
  <g stroke="#78716C" stroke-width="2" opacity="0.75">
    <line x1="320" y1="220" x2="120" y2="80"/>
    <line x1="320" y1="220" x2="320" y2="55"/>
    <line x1="320" y1="220" x2="520" y2="80"/>
    <line x1="320" y1="220" x2="550" y2="220"/>
    <line x1="320" y1="220" x2="510" y2="380"/>
    <line x1="320" y1="220" x2="320" y2="410"/>
    <line x1="320" y1="220" x2="130" y2="380"/>
    <line x1="320" y1="220" x2="90" y2="220"/>
    <circle cx="320" cy="220" r="45" fill="none"/>
    <circle cx="320" cy="220" r="85" fill="none"/>
    <circle cx="320" cy="220" r="130" fill="none"/>
    <circle cx="320" cy="220" r="175" fill="none"/>
  </g>
  <line x1="320" y1="220" x2="320" y2="270" stroke="#44403C" stroke-width="2"/>
  <circle cx="320" cy="285" r="16" fill="#292524"/>
  <circle cx="320" cy="268" r="10" fill="#292524"/>
  <g stroke="#292524" stroke-width="3" fill="none" stroke-linecap="round">
    <path d="M310 272 Q285 258 275 278"/>
    <path d="M330 272 Q355 258 365 278"/>
    <path d="M306 284 Q280 282 272 302"/>
    <path d="M334 284 Q360 282 368 302"/>
  </g>
  <ellipse cx="320" cy="390" rx="58" ry="34" fill="#F9A8D4" stroke="#BE185D" stroke-width="2.5"/>
  <circle cx="368" cy="382" r="22" fill="#F9A8D4" stroke="#BE185D" stroke-width="2.5"/>
  <ellipse cx="386" cy="386" rx="8" ry="6" fill="#F472B6"/>
  <circle cx="366" cy="376" r="2.5" fill="#1F1C18"/>
</svg>`;

const SVG_PETER_PAN = `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" fill="#1E293B"/>
  <rect x="24" y="24" width="592" height="432" rx="12" fill="none" stroke="#64748B" stroke-width="2"/>
  <polygon points="480,75 490,104 520,104 496,122 505,150 480,133 455,150 464,122 440,104 470,104" fill="#FDE047"/>
  <circle cx="370" cy="110" r="5" fill="#FEF08A"/>
  <circle cx="150" cy="95" r="3" fill="#E2E8F0"/>
  <circle cx="230" cy="150" r="2.5" fill="#E2E8F0"/>
  <rect x="110" y="230" width="90" height="210" fill="#0F172A"/>
  <polygon points="105,230 155,140 205,230" fill="#0F172A"/>
  <circle cx="155" cy="272" r="26" fill="#FEF3C7"/>
  <line x1="155" y1="272" x2="155" y2="254" stroke="#0F172A" stroke-width="3"/>
  <line x1="155" y1="272" x2="169" y2="272" stroke="#0F172A" stroke-width="3"/>
  <path d="M315 245 L430 235 L355 180 Z" fill="#15803D"/>
  <path d="M360 205 Q410 150 438 140" stroke="#DC2626" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="445" cy="195" r="7" fill="#FDE047"/>
  <circle cx="410" cy="215" r="4" fill="#FEF08A"/>
  <circle cx="385" cy="230" r="3" fill="#FEF08A"/>
  <circle cx="355" cy="245" r="2.5" fill="#FEF08A"/>
</svg>`;

const SVG_ALICE_WONDERLAND = `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" fill="#FAF3E4"/>
  <rect x="24" y="24" width="592" height="432" rx="12" fill="none" stroke="#D6C6AC" stroke-width="3"/>
  <circle cx="245" cy="260" r="95" fill="#FDE68A" stroke="#B45309" stroke-width="8"/>
  <circle cx="245" cy="260" r="78" fill="#FFFDF7" stroke="#D97706" stroke-width="2"/>
  <rect x="232" y="142" width="26" height="22" rx="4" fill="#B45309"/>
  <circle cx="245" cy="132" r="16" fill="none" stroke="#B45309" stroke-width="6"/>
  <line x1="245" y1="260" x2="245" y2="205" stroke="#1F1C18" stroke-width="6" stroke-linecap="round"/>
  <line x1="245" y1="260" x2="290" y2="275" stroke="#DC2626" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="420" cy="135" rx="22" ry="70" transform="rotate(-12 420 135)" fill="#FFFFFF" stroke="#57534E" stroke-width="3"/>
  <ellipse cx="468" cy="142" rx="22" ry="70" transform="rotate(14 468 142)" fill="#FFFFFF" stroke="#57534E" stroke-width="3"/>
  <ellipse cx="420" cy="140" rx="10" ry="48" transform="rotate(-12 420 140)" fill="#FBCFE8"/>
  <ellipse cx="468" cy="146" rx="10" ry="48" transform="rotate(14 468 146)" fill="#FBCFE8"/>
  <rect x="385" y="275" width="115" height="82" rx="6" fill="#0F766E"/>
  <rect x="360" y="352" width="165" height="16" rx="8" fill="#115E59"/>
  <rect x="385" y="330" width="115" height="18" fill="#F59E0B"/>
</svg>`;

const SVG_TREASURE_ISLAND = `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" fill="#F7EED8"/>
  <rect x="24" y="24" width="592" height="432" rx="12" fill="none" stroke="#CBB792" stroke-width="3"/>
  <path d="M50 370 Q130 340 210 370 T370 370 T530 370 L590 370 L590 440 L50 440 Z" fill="#0284C7" opacity="0.24"/>
  <rect x="130" y="95" width="380" height="230" rx="8" fill="#FDECC8" stroke="#92400E" stroke-width="4"/>
  <path d="M180 265 Q240 165 320 220 T445 155" fill="none" stroke="#78350F" stroke-width="5" stroke-dasharray="12 10"/>
  <line x1="425" y1="130" x2="470" y2="175" stroke="#DC2626" stroke-width="10" stroke-linecap="round"/>
  <line x1="470" y1="130" x2="425" y2="175" stroke="#DC2626" stroke-width="10" stroke-linecap="round"/>
  <circle cx="205" cy="175" r="34" fill="none" stroke="#78350F" stroke-width="2.5"/>
  <polygon points="205,135 215,175 205,215 195,175" fill="#B45309"/>
  <polygon points="165,175 205,165 245,175 205,185" fill="#D97706"/>
  <circle cx="290" cy="365" r="24" fill="#F59E0B" stroke="#92400E" stroke-width="3"/>
  <circle cx="332" cy="378" r="24" fill="#FBBF24" stroke="#92400E" stroke-width="3"/>
  <circle cx="372" cy="364" r="24" fill="#F59E0B" stroke="#92400E" stroke-width="3"/>
</svg>`;

const SVG_SHERLOCK_HOLMES = `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" fill="#F6F1E4"/>
  <rect x="24" y="24" width="592" height="432" rx="12" fill="none" stroke="#D1C7B4" stroke-width="3"/>
  <circle cx="265" cy="215" r="95" fill="#E0F2FE" stroke="#78350F" stroke-width="14"/>
  <path d="M210 175 Q245 140 295 160" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.8"/>
  <line x1="335" y1="285" x2="430" y2="385" stroke="#451A03" stroke-width="22" stroke-linecap="round"/>
  <path d="M350 165 C350 100 470 100 470 165 Z" fill="#78716C"/>
  <ellipse cx="410" cy="165" rx="82" ry="16" fill="#57534E"/>
  <path d="M125 320 Q180 375 230 330 L245 305 L278 310 L268 345 Q200 410 118 332 Z" fill="#5C2D16"/>
  <ellipse cx="250" cy="205" rx="12" ry="20" transform="rotate(-15 250 205)" fill="#334155" opacity="0.5"/>
  <ellipse cx="285" cy="235" rx="12" ry="20" transform="rotate(-15 285 235)" fill="#334155" opacity="0.5"/>
</svg>`;

const SVG_WIZARD_OF_OZ = `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" fill="#EFF6FF"/>
  <rect x="24" y="24" width="592" height="432" rx="12" fill="none" stroke="#BFDBFE" stroke-width="3"/>
  <path d="M80 280 A240 200 0 0 1 560 280" fill="none" stroke="#EF4444" stroke-width="14" opacity="0.75"/>
  <path d="M94 280 A226 186 0 0 1 546 280" fill="none" stroke="#F59E0B" stroke-width="14" opacity="0.75"/>
  <path d="M108 280 A212 172 0 0 1 532 280" fill="none" stroke="#10B981" stroke-width="14" opacity="0.75"/>
  <path d="M122 280 A198 158 0 0 1 518 280" fill="none" stroke="#3B82F6" stroke-width="14" opacity="0.75"/>
  <polygon points="275,260 295,155 315,260" fill="#059669"/>
  <polygon points="305,260 325,130 345,260" fill="#047857"/>
  <polygon points="335,260 355,165 375,260" fill="#10B981"/>
  <polygon points="295,260 355,260 490,440 160,440" fill="#FACC15" stroke="#CA8A04" stroke-width="3"/>
  <line x1="265" y1="305" x2="388" y2="305" stroke="#CA8A04" stroke-width="3"/>
  <line x1="230" y1="355" x2="425" y2="355" stroke="#CA8A04" stroke-width="3"/>
  <line x1="190" y1="405" x2="465" y2="405" stroke="#CA8A04" stroke-width="3"/>
  <path d="M235 370 Q260 390 295 390 L295 405 L228 405 Z" fill="#DC2626"/>
  <path d="M350 370 Q375 390 410 390 L410 405 L343 405 Z" fill="#DC2626"/>
</svg>`;

const SVG_JUNGLE_BOOK = `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" fill="#ECFDF5"/>
  <rect x="24" y="24" width="592" height="432" rx="12" fill="none" stroke="#A7F3D0" stroke-width="3"/>
  <path d="M60 120 Q180 60 260 180 Q140 200 60 120 Z" fill="#059669"/>
  <path d="M580 120 Q460 60 380 180 Q500 200 580 120 Z" fill="#047857"/>
  <circle cx="320" cy="255" r="105" fill="#F97316"/>
  <circle cx="240" cy="175" r="28" fill="#F97316"/>
  <circle cx="400" cy="175" r="28" fill="#F97316"/>
  <ellipse cx="320" cy="295" rx="52" ry="38" fill="#FFF7ED"/>
  <polygon points="302,272 338,272 320,295" fill="#1F1C18"/>
  <circle cx="275" cy="235" r="10" fill="#1F1C18"/>
  <circle cx="365" cy="235" r="10" fill="#1F1C18"/>
  <path d="M295 162 L308 196 L320 160 L332 196 L345 162" fill="none" stroke="#1F1C18" stroke-width="7" stroke-linecap="round"/>
  <ellipse cx="500" cy="365" rx="22" ry="18" fill="#334155" opacity="0.45"/>
</svg>`;

const SVG_MOBY_DICK = `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" fill="#E0F2FE"/>
  <rect x="24" y="24" width="592" height="432" rx="12" fill="none" stroke="#BAE6FD" stroke-width="3"/>
  <path d="M30 290 Q110 260 190 290 T350 290 T510 290 T610 290 L610 450 L30 450 Z" fill="#0369A1"/>
  <path d="M130 315 C140 205 310 175 430 235 C475 258 510 285 520 315 C450 328 210 330 130 315 Z" fill="#FFFFFF" stroke="#64748B" stroke-width="4"/>
  <path d="M510 290 L570 245 L555 290 L575 330 Z" fill="#F8FAFC" stroke="#64748B" stroke-width="3"/>
  <circle cx="205" cy="268" r="7" fill="#0F172A"/>
  <path d="M210 198 Q195 135 160 120 M216 198 Q232 135 268 120" fill="none" stroke="#38BDF8" stroke-width="8" stroke-linecap="round"/>
  <path d="M405 355 L525 355 L500 390 L425 390 Z" fill="#78350F"/>
</svg>`;

const SVG_GREAT_GATSBY = `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" fill="#0F172A"/>
  <rect x="24" y="24" width="592" height="432" rx="12" fill="none" stroke="#D4AF37" stroke-width="3"/>
  <path d="M60 400 L320 90 L580 400" fill="none" stroke="#D4AF37" stroke-width="2" opacity="0.45"/>
  <rect x="24" y="310" width="592" height="146" fill="#1E293B"/>
  <polygon points="80,456 260,310 300,310 190,456" fill="#451A03"/>
  <circle cx="480" cy="255" r="56" fill="#10B981" opacity="0.22"/>
  <circle cx="480" cy="255" r="32" fill="#34D399" opacity="0.45"/>
  <circle cx="480" cy="255" r="14" fill="#6EE7B7"/>
  <ellipse cx="480" cy="355" rx="18" ry="6" fill="#34D399" opacity="0.6"/>
  <ellipse cx="480" cy="380" rx="28" ry="6" fill="#10B981" opacity="0.4"/>
  <path d="M160 155 L240 155 L200 205 Z" fill="#FDE68A" opacity="0.9"/>
  <line x1="200" y1="205" x2="200" y2="255" stroke="#D4AF37" stroke-width="4"/>
  <line x1="178" y1="255" x2="222" y2="255" stroke="#D4AF37" stroke-width="4"/>
</svg>`;

const SVG_HAMLET = `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" fill="#F5F0E6"/>
  <rect x="24" y="24" width="592" height="432" rx="12" fill="none" stroke="#C8BFA8" stroke-width="3"/>
  <path d="M60 60 Q140 150 60 320 L60 60 Z" fill="#881337" opacity="0.8"/>
  <path d="M580 60 Q500 150 580 320 L580 60 Z" fill="#881337" opacity="0.8"/>
  <circle cx="320" cy="215" r="82" fill="#FEFCE8" stroke="#44403C" stroke-width="4"/>
  <rect x="282" y="272" width="76" height="45" rx="10" fill="#FEFCE8" stroke="#44403C" stroke-width="4"/>
  <circle cx="290" cy="215" r="20" fill="#292524"/>
  <circle cx="350" cy="215" r="20" fill="#292524"/>
  <polygon points="320,236 308,260 332,260" fill="#292524"/>
  <line x1="300" y1="295" x2="300" y2="317" stroke="#44403C" stroke-width="3"/>
  <line x1="320" y1="295" x2="320" y2="317" stroke="#44403C" stroke-width="3"/>
  <line x1="340" y1="295" x2="340" y2="317" stroke="#44403C" stroke-width="3"/>
  <polygon points="415,375 425,320 455,345 480,310 505,345 535,320 545,375" fill="#F59E0B" stroke="#92400E" stroke-width="3"/>
</svg>`;

const SVG_FRANKENSTEIN = `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" fill="#1E1B2E"/>
  <rect x="24" y="24" width="592" height="432" rx="12" fill="none" stroke="#6D28D9" stroke-width="2"/>
  <polygon points="150,55 110,165 155,165 125,255 205,135 160,135" fill="#FDE047"/>
  <polygon points="500,55 460,165 505,165 475,255 555,135 510,135" fill="#FDE047"/>
  <rect x="245" y="160" width="150" height="175" rx="18" fill="#65A30D" stroke="#365314" stroke-width="4"/>
  <rect x="235" y="148" width="170" height="32" fill="#18181B"/>
  <rect x="220" y="288" width="26" height="18" rx="3" fill="#94A3B8"/>
  <rect x="394" y="288" width="26" height="18" rx="3" fill="#94A3B8"/>
  <path d="M272 205 L312 195" stroke="#1F2937" stroke-width="4"/>
  <line x1="282" y1="192" x2="285" y2="210" stroke="#1F2937" stroke-width="3"/>
  <line x1="298" y1="189" x2="301" y2="207" stroke="#1F2937" stroke-width="3"/>
  <circle cx="285" cy="240" r="9" fill="#18181B"/>
  <circle cx="355" cy="240" r="9" fill="#18181B"/>
  <line x1="290" y1="295" x2="350" y2="295" stroke="#18181B" stroke-width="5"/>
</svg>`;

const SVG_LITTLE_PRINCE = `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" fill="#1E293B"/>
  <rect x="24" y="24" width="592" height="432" rx="12" fill="none" stroke="#FBBF24" stroke-width="2"/>
  <circle cx="120" cy="90" r="4" fill="#FDE047"/>
  <circle cx="510" cy="110" r="5" fill="#FDE047"/>
  <circle cx="210" cy="130" r="2.5" fill="#FEF08A"/>
  <circle cx="430" cy="75" r="3" fill="#FEF08A"/>
  <circle cx="320" cy="360" r="115" fill="#D97706"/>
  <circle cx="275" cy="340" r="18" fill="#B45309" opacity="0.6"/>
  <circle cx="365" cy="380" r="24" fill="#B45309" opacity="0.6"/>
  <path d="M265 250 L265 180 A55 55 0 0 1 375 180 L375 250 Z" fill="#BAE6FD" opacity="0.28" stroke="#E0F2FE" stroke-width="3"/>
  <line x1="320" y1="248" x2="320" y2="185" stroke="#22C55E" stroke-width="5"/>
  <path d="M320 220 Q345 205 342 225 Q332 232 320 220 Z" fill="#22C55E"/>
  <circle cx="320" cy="175" r="22" fill="#E11D48"/>
  <path d="M308 175 Q320 162 332 175" fill="none" stroke="#9F1239" stroke-width="3"/>
</svg>`;

const SVG_ROMEO_JULIET = `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="480" fill="#FFF1F2"/>
  <rect x="24" y="24" width="592" height="432" rx="12" fill="none" stroke="#FECDD3" stroke-width="3"/>
  <rect x="140" y="210" width="360" height="24" fill="#CBD5E1" stroke="#64748B" stroke-width="3"/>
  <rect x="165" y="135" width="310" height="75" fill="none" stroke="#64748B" stroke-width="4"/>
  <line x1="215" y1="135" x2="215" y2="210" stroke="#64748B" stroke-width="5"/>
  <line x1="265" y1="135" x2="265" y2="210" stroke="#64748B" stroke-width="5"/>
  <line x1="320" y1="135" x2="320" y2="210" stroke="#64748B" stroke-width="5"/>
  <line x1="375" y1="135" x2="375" y2="210" stroke="#64748B" stroke-width="5"/>
  <line x1="425" y1="135" x2="425" y2="210" stroke="#64748B" stroke-width="5"/>
  <circle cx="515" cy="95" r="36" fill="#FDE047"/>
  <circle cx="530" cy="88" r="32" fill="#FFF1F2"/>
  <path d="M170 420 Q190 320 175 234" fill="none" stroke="#15803D" stroke-width="6"/>
  <circle cx="185" cy="300" r="14" fill="#E11D48"/>
  <circle cx="170" cy="360" r="14" fill="#E11D48"/>
  <circle cx="320" cy="335" r="46" fill="#E11D48" opacity="0.18"/>
  <path d="M320 365 C270 330 270 285 302 285 C315 285 320 296 320 296 C320 296 325 285 338 285 C370 285 370 330 320 365 Z" fill="#E11D48"/>
</svg>`;

export const BACKUP_PICTURE_PUZZLES: PicturePuzzle[] = [
  // LEVEL 1
  {
    id: 'pic-l1-1',
    level: 1,
    answer: 'Cinderella',
    acceptedAnswers: ['Cinderella', 'Glass Slipper', 'Cinderellas Glass Slipper'],
    category: 'Story',
    hint: 'A fairy tale princess who leaves something behind at midnight.',
    imageKey: 'glass_slipper',
    captionNote: 'A sparkling slipper left behind before the stroke of twelve.',
    source: 'backup',
  },
  {
    id: 'pic-l1-2',
    level: 1,
    answer: 'Pinocchio',
    acceptedAnswers: ['Pinocchio', 'Geppetto', 'The Adventures of Pinocchio'],
    category: 'Character',
    hint: 'A carved puppet who dreams of becoming a real boy.',
    imageKey: 'wooden_puppet',
    captionNote: 'Carved from pine wood on an old carpenter’s bench.',
    source: 'backup',
  },
  {
    id: 'pic-l1-3',
    level: 1,
    answer: 'Little Red Riding Hood',
    acceptedAnswers: ['Little Red Riding Hood', 'Red Riding Hood'],
    category: 'Story',
    hint: 'She walks through the forest carrying a basket for her grandmother.',
    svgMarkup: SVG_RED_RIDING_HOOD,
    captionNote: 'A bright scarlet cloak and a woven picnic basket in the woods.',
    source: 'backup',
  },
  {
    id: 'pic-l1-4',
    level: 1,
    answer: 'Goldilocks and the Three Bears',
    acceptedAnswers: ['Goldilocks', 'Goldilocks and the Three Bears', 'Three Bears'],
    category: 'Story',
    hint: 'Too hot, too cold, and just right!',
    svgMarkup: SVG_GOLDILOCKS_BEARS,
    captionNote: 'Three steaming bowls waiting upon a wooden cottage table.',
    source: 'backup',
  },
  {
    id: 'pic-l1-5',
    level: 1,
    answer: "Charlotte's Web",
    acceptedAnswers: ["Charlotte's Web", 'Charlottes Web', 'Charlotte', 'Wilbur'],
    category: 'Book',
    hint: 'A clever barn spider writes messages to save her friend Wilbur.',
    svgMarkup: SVG_CHARLOTTES_WEB,
    captionNote: 'Silken threads spun high above a friendly little farmyard pig.',
    source: 'backup',
  },
  {
    id: 'pic-l1-6',
    level: 1,
    answer: 'Peter Pan',
    acceptedAnswers: ['Peter Pan', 'Neverland', 'Tinker Bell'],
    category: 'Character',
    hint: 'Second star to the right and straight on till morning!',
    svgMarkup: SVG_PETER_PAN,
    captionNote: 'Pixie dust, a feathered green cap, and London’s night sky.',
    source: 'backup',
  },

  // LEVEL 2
  {
    id: 'pic-l2-1',
    level: 2,
    answer: 'Edgar Allan Poe',
    acceptedAnswers: ['Edgar Allan Poe', 'Poe', 'The Raven'],
    category: 'Author',
    hint: '“Quoth the Raven, Nevermore.”',
    imageKey: 'raven_study',
    captionNote: 'A midnight bird perched above an antique marble bust.',
    source: 'backup',
  },
  {
    id: 'pic-l2-2',
    level: 2,
    answer: "Alice's Adventures in Wonderland",
    acceptedAnswers: ['Alice in Wonderland', "Alice's Adventures in Wonderland", 'Alice', 'White Rabbit', 'Mad Hatter'],
    category: 'Book',
    hint: 'Follow the White Rabbit down the rabbit hole.',
    svgMarkup: SVG_ALICE_WONDERLAND,
    captionNote: 'A hurrying pocket watch, long white ears, and a whimsical hat.',
    source: 'backup',
  },
  {
    id: 'pic-l2-3',
    level: 2,
    answer: 'Treasure Island',
    acceptedAnswers: ['Treasure Island', 'Jim Hawkins', 'Long John Silver', 'Robert Louis Stevenson'],
    category: 'Book',
    hint: 'X marks the spot in Robert Louis Stevenson’s pirate classic.',
    svgMarkup: SVG_TREASURE_ISLAND,
    captionNote: 'An old sea chart marked with a crimson cross and gold coins.',
    source: 'backup',
  },
  {
    id: 'pic-l2-4',
    level: 2,
    answer: 'Sherlock Holmes',
    acceptedAnswers: ['Sherlock Holmes', 'Sherlock', 'Arthur Conan Doyle', 'Conan Doyle'],
    category: 'Character',
    hint: 'The world’s most famous detective of 221B Baker Street.',
    svgMarkup: SVG_SHERLOCK_HOLMES,
    captionNote: 'A magnifying glass, curved briar pipe, and deerstalker cap.',
    source: 'backup',
  },
  {
    id: 'pic-l2-5',
    level: 2,
    answer: 'The Wizard of Oz',
    acceptedAnswers: ['The Wizard of Oz', 'Wizard of Oz', 'The Wonderful Wizard of Oz', 'Dorothy'],
    category: 'Book',
    hint: 'Follow the Yellow Brick Road beyond the rainbow.',
    svgMarkup: SVG_WIZARD_OF_OZ,
    captionNote: 'A golden brick path winding toward emerald spires.',
    source: 'backup',
  },
  {
    id: 'pic-l2-6',
    level: 2,
    answer: 'The Jungle Book',
    acceptedAnswers: ['The Jungle Book', 'Jungle Book', 'Mowgli', 'Shere Khan', 'Rudyard Kipling'],
    category: 'Book',
    hint: 'Rudyard Kipling’s tales of Mowgli, Baloo, and Shere Khan.',
    svgMarkup: SVG_JUNGLE_BOOK,
    captionNote: 'Deep forest leaves and the fierce stripes of the Indian jungle.',
    source: 'backup',
  },

  // LEVEL 3
  {
    id: 'pic-l3-1',
    level: 3,
    answer: 'Moby-Dick',
    acceptedAnswers: ['Moby Dick', 'Moby-Dick', 'Herman Melville', 'Captain Ahab'],
    category: 'Book',
    hint: 'Captain Ahab’s relentless hunt across the open ocean.',
    svgMarkup: SVG_MOBY_DICK,
    captionNote: 'A colossal white whale breaching beside a small whaling boat.',
    source: 'backup',
  },
  {
    id: 'pic-l3-2',
    level: 3,
    answer: 'The Great Gatsby',
    acceptedAnswers: ['The Great Gatsby', 'Great Gatsby', 'Gatsby', 'F. Scott Fitzgerald', 'Fitzgerald'],
    category: 'Book',
    hint: 'A green light shining across the bay in the Jazz Age.',
    svgMarkup: SVG_GREAT_GATSBY,
    captionNote: 'A distant emerald beacon shimmering across dark waters.',
    source: 'backup',
  },
  {
    id: 'pic-l3-3',
    level: 3,
    answer: 'Hamlet',
    acceptedAnswers: ['Hamlet', 'William Shakespeare', 'Shakespeare', 'Prince of Denmark'],
    category: 'Book',
    hint: '“Alas, poor Yorick! I knew him, Horatio.”',
    svgMarkup: SVG_HAMLET,
    captionNote: 'A player’s skull and a fallen crown beneath stage curtains.',
    source: 'backup',
  },
  {
    id: 'pic-l3-4',
    level: 3,
    answer: 'Frankenstein',
    acceptedAnswers: ['Frankenstein', 'Mary Shelley', "Frankenstein's Monster"],
    category: 'Book',
    hint: 'Mary Shelley’s Gothic tale brought to life by a spark.',
    svgMarkup: SVG_FRANKENSTEIN,
    captionNote: 'Lightning strikes above a stitched creation in the laboratory.',
    source: 'backup',
  },
  {
    id: 'pic-l3-5',
    level: 3,
    answer: 'The Little Prince',
    acceptedAnswers: ['The Little Prince', 'Little Prince', 'Saint-Exupery'],
    category: 'Book',
    hint: 'A lone rose protected under glass on a tiny asteroid.',
    svgMarkup: SVG_LITTLE_PRINCE,
    captionNote: 'A cherished flower beneath a glass dome on a distant planet.',
    source: 'backup',
  },
  {
    id: 'pic-l3-6',
    level: 3,
    answer: 'Romeo and Juliet',
    acceptedAnswers: ['Romeo and Juliet', 'Romeo & Juliet', 'Shakespeare', 'William Shakespeare'],
    category: 'Book',
    hint: 'A moonlit balcony in fair Verona.',
    svgMarkup: SVG_ROMEO_JULIET,
    captionNote: 'A stone balcony entwined with crimson roses beneath the crescent moon.',
    source: 'backup',
  },
];

// Easy, short, very famous quotes mixing Indian English writers & World writers
export const BACKUP_QUOTE_QUESTIONS: QuoteQuestion[] = [
  // LEVEL 1 — Super iconic, easy for 1st graders through adults
  {
    id: 'quote-l1-in-1',
    level: 1,
    quote: '“Where the mind is without fear and the head is held high.”',
    options: ['Rabindranath Tagore', 'Roald Dahl', 'Charles Dickens', 'Lewis Carroll'],
    correctIndex: 0,
    workTitle: 'Gitanjali',
    author: 'Rabindranath Tagore',
    origin: 'indian',
    askType: 'author',
    source: 'backup',
  },
  {
    id: 'quote-l1-in-2',
    level: 1,
    quote: '“What do you weigh, O ye vendors? Saffron and lentil and rice.”',
    options: ['Sarojini Naidu', 'Jane Austen', 'William Shakespeare', 'A. A. Milne'],
    correctIndex: 0,
    workTitle: 'In the Bazaars of Hyderabad',
    author: 'Sarojini Naidu',
    origin: 'indian',
    askType: 'author',
    source: 'backup',
  },
  {
    id: 'quote-l1-intl-1',
    level: 1,
    quote: '“You’re braver than you believe, stronger than you seem, and smarter than you think.”',
    options: ['A. A. Milne', 'Charles Dickens', 'R. K. Narayan', 'Mulk Raj Anand'],
    correctIndex: 0,
    workTitle: 'Winnie-the-Pooh',
    author: 'A. A. Milne',
    origin: 'international',
    askType: 'author',
    source: 'backup',
  },
  {
    id: 'quote-l1-intl-2',
    level: 1,
    quote: '“Please, sir, I want some more.”',
    options: ['Oliver Twist', 'Winnie-the-Pooh', 'Matilda', 'Alice in Wonderland'],
    correctIndex: 0,
    workTitle: 'Oliver Twist',
    author: 'Charles Dickens',
    origin: 'international',
    askType: 'book',
    source: 'backup',
  },
  {
    id: 'quote-l1-intl-3',
    level: 1,
    quote: '“Those who don’t believe in magic will never find it.”',
    options: ['Roald Dahl', 'William Shakespeare', 'Jane Austen', 'Sarojini Naidu'],
    correctIndex: 0,
    workTitle: 'The Minpins',
    author: 'Roald Dahl',
    origin: 'international',
    askType: 'author',
    source: 'backup',
  },
  {
    id: 'quote-l1-intl-4',
    level: 1,
    quote: '“Curiouser and curiouser!”',
    options: ["Alice's Adventures in Wonderland", 'Oliver Twist', 'Malgudi Days', 'Hamlet'],
    correctIndex: 0,
    workTitle: "Alice's Adventures in Wonderland",
    author: 'Lewis Carroll',
    origin: 'international',
    askType: 'book',
    source: 'backup',
  },
  {
    id: 'quote-l1-intl-5',
    level: 1,
    quote: '“All the world’s a stage, and all the men and women merely players.”',
    options: ['William Shakespeare', 'Roald Dahl', 'Ruskin Bond', 'R. K. Narayan'],
    correctIndex: 0,
    workTitle: 'As You Like It',
    author: 'William Shakespeare',
    origin: 'international',
    askType: 'author',
    source: 'backup',
  },

  // LEVEL 2 — Easy, well-known favorites (Indian + World mix)
  {
    id: 'quote-l2-in-1',
    level: 2,
    quote: '“Lightly, O lightly we bear her along, she sways like a flower in the wind.”',
    options: ['Sarojini Naidu', 'Jane Austen', 'Roald Dahl', 'Charles Dickens'],
    correctIndex: 0,
    workTitle: 'Palanquin Bearers',
    author: 'Sarojini Naidu',
    origin: 'indian',
    askType: 'author',
    source: 'backup',
  },
  {
    id: 'quote-l2-in-2',
    level: 2,
    quote: '“It was Monday morning. Swaminathan was reluctant to open his eyes.”',
    options: ['R. K. Narayan', 'William Shakespeare', 'Lewis Carroll', 'A. A. Milne'],
    correctIndex: 0,
    workTitle: 'Swami and Friends',
    author: 'R. K. Narayan',
    origin: 'indian',
    askType: 'author',
    source: 'backup',
  },
  {
    id: 'quote-l2-in-3',
    level: 2,
    quote: '“And when all the wars are over, a butterfly will still be beautiful.”',
    options: ['Ruskin Bond', 'Charles Dickens', 'Jane Austen', 'William Shakespeare'],
    correctIndex: 0,
    workTitle: 'Selected Stories',
    author: 'Ruskin Bond',
    origin: 'indian',
    askType: 'author',
    source: 'backup',
  },
  {
    id: 'quote-l2-in-4',
    level: 2,
    quote: '“You cannot cross the sea merely by standing and staring at the water.”',
    options: ['Rabindranath Tagore', 'Roald Dahl', 'A. A. Milne', 'Lewis Carroll'],
    correctIndex: 0,
    workTitle: 'Collected Writings',
    author: 'Rabindranath Tagore',
    origin: 'indian',
    askType: 'author',
    source: 'backup',
  },
  {
    id: 'quote-l2-intl-1',
    level: 2,
    quote: '“It was the best of times, it was the worst of times.”',
    options: ['Charles Dickens', 'R. K. Narayan', 'Arundhati Roy', 'A. A. Milne'],
    correctIndex: 0,
    workTitle: 'A Tale of Two Cities',
    author: 'Charles Dickens',
    origin: 'international',
    askType: 'author',
    source: 'backup',
  },
  {
    id: 'quote-l2-intl-2',
    level: 2,
    quote: '“To be, or not to be: that is the question.”',
    options: ['Hamlet', 'Pride and Prejudice', 'Malgudi Days', 'Matilda'],
    correctIndex: 0,
    workTitle: 'Hamlet',
    author: 'William Shakespeare',
    origin: 'international',
    askType: 'book',
    source: 'backup',
  },
  {
    id: 'quote-l2-intl-3',
    level: 2,
    quote: '“Somewhere inside all of us is the power to change the world.”',
    options: ['Matilda', 'Swami and Friends', 'Oliver Twist', 'Pride and Prejudice'],
    correctIndex: 0,
    workTitle: 'Matilda',
    author: 'Roald Dahl',
    origin: 'international',
    askType: 'book',
    source: 'backup',
  },

  // LEVEL 3 — Only slightly harder than Level 1 & 2, still short and famous
  {
    id: 'quote-l3-in-1',
    level: 3,
    quote: '“Faith is the bird that feels the light when the dawn is still dark.”',
    options: ['Rabindranath Tagore', 'Jane Austen', 'Lewis Carroll', 'Roald Dahl'],
    correctIndex: 0,
    workTitle: 'Fireflies / Stray Birds',
    author: 'Rabindranath Tagore',
    origin: 'indian',
    askType: 'author',
    source: 'backup',
  },
  {
    id: 'quote-l3-in-2',
    level: 3,
    quote: '“Things can change in a day.”',
    options: ['Arundhati Roy', 'Charles Dickens', 'A. A. Milne', 'William Shakespeare'],
    correctIndex: 0,
    workTitle: 'The God of Small Things',
    author: 'Arundhati Roy',
    origin: 'indian',
    askType: 'author',
    source: 'backup',
  },
  {
    id: 'quote-l3-in-3',
    level: 3,
    quote: '“Punctually at midday he opened his bag and spread out his professional equipment.”',
    options: ['Malgudi Days', 'Pride and Prejudice', 'Winnie-the-Pooh', 'A Christmas Carol'],
    correctIndex: 0,
    workTitle: 'Malgudi Days',
    author: 'R. K. Narayan',
    origin: 'indian',
    askType: 'book',
    source: 'backup',
  },
  {
    id: 'quote-l3-intl-1',
    level: 3,
    quote: '“It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.”',
    options: ['Jane Austen', 'Sarojini Naidu', 'Ruskin Bond', 'Roald Dahl'],
    correctIndex: 0,
    workTitle: 'Pride and Prejudice',
    author: 'Jane Austen',
    origin: 'international',
    askType: 'author',
    source: 'backup',
  },
  {
    id: 'quote-l3-intl-2',
    level: 3,
    quote: '“How lucky I am to have something that makes saying goodbye so hard.”',
    options: ['A. A. Milne', 'Charles Dickens', 'Mulk Raj Anand', 'R. K. Narayan'],
    correctIndex: 0,
    workTitle: 'Winnie-the-Pooh',
    author: 'A. A. Milne',
    origin: 'international',
    askType: 'author',
    source: 'backup',
  },
  {
    id: 'quote-l3-intl-3',
    level: 3,
    quote: '“The course of true love never did run smooth.”',
    options: ['William Shakespeare', 'Roald Dahl', 'Ruskin Bond', 'Rabindranath Tagore'],
    correctIndex: 0,
    workTitle: "A Midsummer Night's Dream",
    author: 'William Shakespeare',
    origin: 'international',
    askType: 'author',
    source: 'backup',
  },
  {
    id: 'quote-l3-intl-4',
    level: 3,
    quote: '“Why, sometimes I’ve believed as many as six impossible things before breakfast.”',
    options: ['Lewis Carroll', 'Jane Austen', 'Sarojini Naidu', 'Arundhati Roy'],
    correctIndex: 0,
    workTitle: 'Through the Looking-Glass',
    author: 'Lewis Carroll',
    origin: 'international',
    askType: 'author',
    source: 'backup',
  },
];

// Idiom Challenge: Level 1 (first-grader easy), Level 2 (teen familiar), Level 3 (adult well-known)
export const BACKUP_IDIOM_QUESTIONS: IdiomQuestion[] = [
  // LEVEL 1 — Very common, easy idioms a first grader could guess
  {
    id: 'idiom-l1-1',
    level: 1,
    idiom: 'Piece of cake',
    options: [
      'Something very easy to do',
      'A sweet reward after dinner',
      'A small piece of a puzzle',
      'Something that breaks easily',
    ],
    correctIndex: 0,
    meaning: 'Used when a task is very easy or simple to finish.',
    example: 'After practicing all week, the spelling test was a piece of cake!',
    source: 'backup',
  },
  {
    id: 'idiom-l1-2',
    level: 1,
    idiom: 'Raining cats and dogs',
    options: [
      'Raining very heavily',
      'Pets playing in the garden',
      'A gentle morning drizzle',
      'Wind blowing through the trees',
    ],
    correctIndex: 0,
    meaning: 'Describes a very heavy rainstorm pouring down.',
    example: 'Grab your umbrella—it is raining cats and dogs outside!',
    source: 'backup',
  },
  {
    id: 'idiom-l1-3',
    level: 1,
    idiom: 'Busy as a bee',
    options: [
      'Working hard with lots of energy',
      'Buzzing loudly in class',
      'Sleeping through the afternoon',
      'Collecting flowers in a basket',
    ],
    correctIndex: 0,
    meaning: 'Very active and cheerfully occupied with tasks.',
    example: 'Before the science fair, the whole class was as busy as a bee.',
    source: 'backup',
  },
  {
    id: 'idiom-l1-4',
    level: 1,
    idiom: 'Under the weather',
    options: [
      'Feeling slightly sick or tired',
      'Standing in the rain without a coat',
      'Waiting for sunny skies',
      'Looking up at the clouds',
    ],
    correctIndex: 0,
    meaning: 'Feeling mildly unwell or low on energy.',
    example: 'Leo stayed home with warm soup because he felt a bit under the weather.',
    source: 'backup',
  },
  {
    id: 'idiom-l1-5',
    level: 1,
    idiom: 'Spill the beans',
    options: [
      'Give away a secret by mistake',
      'Drop food on the kitchen floor',
      'Plant seeds in a garden',
      'Share lunch with a friend',
    ],
    correctIndex: 0,
    meaning: 'To reveal secret or surprise news before you were supposed to.',
    example: 'Don’t spill the beans about Grandma’s surprise party!',
    source: 'backup',
  },
  {
    id: 'idiom-l1-6',
    level: 1,
    idiom: 'Cool as a cucumber',
    options: [
      'Very calm and relaxed',
      'Shivering in the winter cold',
      'Eating healthy green snacks',
      'Running fast in a race',
    ],
    correctIndex: 0,
    meaning: 'Staying calm and steady even in an exciting or tense moment.',
    example: 'Even before her turn on stage, Ananya stayed cool as a cucumber.',
    source: 'backup',
  },

  // LEVEL 2 — Familiar idioms for teens
  {
    id: 'idiom-l2-1',
    level: 2,
    idiom: 'Break the ice',
    options: [
      'Help people feel comfortable and start talking',
      'Skate across a frozen pond',
      'End a friendship suddenly',
      'Open a cold bottle of water',
    ],
    correctIndex: 0,
    meaning: 'To make a quiet or awkward moment friendly by starting a conversation.',
    example: 'Playing a quick name game helped break the ice on the first day of camp.',
    source: 'backup',
  },
  {
    id: 'idiom-l2-2',
    level: 2,
    idiom: 'Once in a blue moon',
    options: [
      'Very rarely',
      'Every single night',
      'Only during winter',
      'Without any warning',
    ],
    correctIndex: 0,
    meaning: 'Happening only occasionally or very infrequently.',
    example: 'Our cousins live far away, so we only meet once in a blue moon.',
    source: 'backup',
  },
  {
    id: 'idiom-l2-3',
    level: 2,
    idiom: 'On cloud nine',
    options: [
      'Extremely happy and excited',
      'Daydreaming during class',
      'Flying on an airplane',
      'Unsure what to decide',
    ],
    correctIndex: 0,
    meaning: 'Feeling overjoyed, proud, and wonderfully happy.',
    example: 'Priya was on cloud nine after winning first prize in the poetry contest.',
    source: 'backup',
  },
  {
    id: 'idiom-l2-4',
    level: 2,
    idiom: 'The ball is in your court',
    options: [
      'It is your turn to decide or act next',
      'The game has already ended',
      'You dropped something important',
      'Everyone is waiting outside',
    ],
    correctIndex: 0,
    meaning: 'It is now up to you to take the next step or give a reply.',
    example: 'I sent over my project ideas, so the ball is in your court now.',
    source: 'backup',
  },
  {
    id: 'idiom-l2-5',
    level: 2,
    idiom: 'Hit the books',
    options: [
      'Start studying hard',
      'Stack books on a library shelf',
      'Close the bookstore early',
      'Drop your school bag',
    ],
    correctIndex: 0,
    meaning: 'To begin studying or reading seriously for an exam or assignment.',
    example: 'I need to hit the books tonight before tomorrow’s English quiz.',
    source: 'backup',
  },
  {
    id: 'idiom-l2-6',
    level: 2,
    idiom: 'Barking up the wrong tree',
    options: [
      'Blaming the wrong person or looking in the wrong place',
      'Making too much noise outdoors',
      'Climbing higher than expected',
      'Refusing to listen to advice',
    ],
    correctIndex: 0,
    meaning: 'Following a mistaken clue or accusing someone who did nothing wrong.',
    example: 'If you think Sam ate the cookies, you are barking up the wrong tree.',
    source: 'backup',
  },

  // LEVEL 3 — Slightly harder idioms for adults, still well known
  {
    id: 'idiom-l3-1',
    level: 3,
    idiom: 'A blessing in disguise',
    options: [
      'Something that seems bad at first but turns out well',
      'A secret gift left on a doorstep',
      'A polite compliment from a stranger',
      'A plan that fails at the last minute',
    ],
    correctIndex: 0,
    meaning: 'An apparent setback that unexpectedly leads to something good.',
    example: 'Missing the early train was a blessing in disguise when we bumped into our old friend.',
    source: 'backup',
  },
  {
    id: 'idiom-l3-2',
    level: 3,
    idiom: 'Read between the lines',
    options: [
      'Understand a hidden or unspoken meaning',
      'Skim a page very quickly',
      'Check a story for spelling mistakes',
      'Memorize a poem word for word',
    ],
    correctIndex: 0,
    meaning: 'To sense what someone truly means even when it is not written directly.',
    example: 'Her note sounded cheerful, yet reading between the lines, you could tell she missed home.',
    source: 'backup',
  },
  {
    id: 'idiom-l3-3',
    level: 3,
    idiom: 'Bite off more than you can chew',
    options: [
      'Take on a task that is too big to handle',
      'Eat dinner too quickly',
      'Speak loudly in a quiet room',
      'Give up before trying',
    ],
    correctIndex: 0,
    meaning: 'To promise or take on more responsibility than you can realistically manage.',
    example: 'Joining four clubs and directing a play meant he had bitten off more than he could chew.',
    source: 'backup',
  },
  {
    id: 'idiom-l3-4',
    level: 3,
    idiom: 'Leave no stone unturned',
    options: [
      'Try every possible way to find or achieve something',
      'Keep a garden neat and tidy',
      'Wait patiently without moving',
      'Finish a task in one minute',
    ],
    correctIndex: 0,
    meaning: 'To search thoroughly and make every effort to succeed.',
    example: 'The young detectives left no stone unturned while hunting for the missing library key.',
    source: 'backup',
  },
  {
    id: 'idiom-l3-5',
    level: 3,
    idiom: 'Bite the bullet',
    options: [
      'Face a difficult task bravely without putting it off',
      'Avoid an argument by leaving early',
      'Celebrate before a race begins',
      'Repeat someone else’s exact words',
    ],
    correctIndex: 0,
    meaning: 'To accept and push through something challenging with courage.',
    example: 'I was nervous about speaking on stage, so I bit the bullet and stepped up to the mic.',
    source: 'backup',
  },
  {
    id: 'idiom-l3-6',
    level: 3,
    idiom: 'Play devil’s advocate',
    options: [
      'Argue the opposite side to test an idea thoroughly',
      'Always agree with the loudest person',
      'Refuse to listen to new facts',
      'Change your mind every five minutes',
    ],
    correctIndex: 0,
    meaning: 'To voice a counter-argument—even if you do not hold it—to test how strong a plan is.',
    example: 'Let me play devil’s advocate: what is our backup plan if it rains during the outdoor fair?',
    source: 'backup',
  },
];
