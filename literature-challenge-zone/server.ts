import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  BACKUP_IDIOM_QUESTIONS,
  BACKUP_PICTURE_PUZZLES,
  BACKUP_QUOTE_QUESTIONS,
  BACKUP_READING_PASSAGES,
  LEVEL_READING_SECONDS,
} from './src/data/fallbackData.ts';
import type {
  IdiomQuestion,
  LetterResponse,
  LevelNumber,
  PicturePuzzle,
  QuoteQuestion,
  ReadingPassage,
} from './src/types/challenges.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const AI_TIMEOUT_MS = 14000;

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('AI request timed out')), ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function isAlreadyUsed(usedSet: Set<string>, candidates: string[]): boolean {
  for (const c of candidates) {
    const norm = normalizeKey(c);
    if (norm && usedSet.has(norm)) return true;
  }
  return false;
}

function pickUnusedBackup<T extends { id: string }>(
  items: T[],
  usedKeys: string[],
  getExtraKeys?: (item: T) => string[]
): T {
  const usedSet = new Set(usedKeys.map(normalizeKey));
  const unused = items.filter((item) => {
    if (usedSet.has(normalizeKey(item.id))) return false;
    if (getExtraKeys) {
      for (const k of getExtraKeys(item)) {
        if (usedSet.has(normalizeKey(k))) return false;
      }
    }
    return true;
  });
  const pool = unused.length > 0 ? unused : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

function shuffleOptions<T extends { options: string[]; correctIndex: number }>(item: T): T {
  const correctText = item.options[item.correctIndex];
  const indices = item.options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const shuffledOptions = indices.map((i) => item.options[i]);
  const newCorrectIndex = shuffledOptions.indexOf(correctText);
  return {
    ...item,
    options: shuffledOptions,
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
  };
}

function sanitizeSvgMarkup(svg: string, answer: string): string | null {
  if (!svg || typeof svg !== 'string') return null;
  const trimmed = svg.trim();
  if (!trimmed.startsWith('<svg') || !trimmed.includes('</svg>')) return null;
  if (/<\s*script/i.test(trimmed)) return null;
  if (/<\s*foreignObject/i.test(trimmed)) return null;
  if (/\son[a-z]+\s*=/i.test(trimmed)) return null;
  if (/javascript:/i.test(trimmed)) return null;
  if (/<\s*text[\s>]/i.test(trimmed)) return null;
  if (normalizeKey(trimmed).includes(normalizeKey(answer)) && answer.length > 3) {
    const strippedTags = trimmed.replace(/<[^>]*>/g, ' ').trim();
    if (strippedTags.length > 0) return null;
  }
  if (!/viewBox=/i.test(trimmed)) {
    return trimmed.replace('<svg', '<svg viewBox="0 0 640 480"');
  }
  return trimmed;
}

const READING_THEMES = [
  'forests, rivers, and animals',
  'childhood curiosity and friendship',
  'brave journeys and sea voyages',
  'magic gardens and cozy cottages',
  'clever fables and talking creatures',
  'festivals, seasons, and city streets',
  'mysteries, lanterns, and midnight clues',
];

const PICTURE_THEMES_BY_LEVEL: Record<LevelNumber, string[]> = {
  1: ['classic fairy tale magic', 'beloved animal storybooks', 'nursery & bedtime classics'],
  2: ['pirates, detectives, and adventure', 'wonderlands and fantasy worlds', 'Indian & world children classics'],
  3: ['Shakespearean theatre & tragedies', 'classic 19th-century novels', 'iconic poetry & timeless symbols'],
};

const QUOTE_THEMES = [
  'hope, courage, and wonder',
  'nature, seasons, and childhood',
  'imagination, reading, and wisdom',
  'friendship, kindness, and adventure',
  'dreams, light, and everyday joy',
];

const IDIOM_TOPICS = [
  'school, learning, and effort',
  'weather, animals, and nature',
  'food, celebrations, and friendship',
  'games, sports, and teamwork',
  'surprises, secrets, and feelings',
  'travel, decisions, and daily life',
];

const app = express();
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(ai) });
});

// Challenge 1: Quick Reading (Full 3-level fresh round — always calls Gemini first)
app.post('/api/challenge/reading/round', async (req, res) => {
  const usedKeys: string[] = Array.isArray(req.body?.usedKeys) ? req.body.usedKeys : [];
  const usedSet = new Set(usedKeys.map(normalizeKey));
  const theme = READING_THEMES[Math.floor(Math.random() * READING_THEMES.length)];
  const avoidList = usedKeys.join(' | ');

  if (ai) {
    try {
      const prompt = [
        `Generate a brand-new 3-level Quick Reading aloud round (Levels 1, 2, and 3) from scratch for an English literature exhibition.`,
        `Random creative focus for this visitor: "${theme}" (Seed: ${Date.now()}-${Math.random().toString(36).slice(2, 8)}).`,
        avoidList
          ? `CRITICAL: NEVER repeat, reuse, or closely paraphrase ANY item from this already-used session list:\n${avoidList}`
          : '',
        `Requirements for the 3 distinct passages:`,
        `- Level 1 (20s target, 24-30 words): Easy, cheerful children's literature or fairy tale (e.g., Beatrix Potter, A. A. Milne, Ruskin Bond's children's stories, Aesop, J. M. Barrie, Kenneth Grahame). Clear everyday words.`,
        `- Level 2 (15s target, 26-34 words): Lively classic adventure or family story (e.g., Lewis Carroll, R. K. Narayan, Robert Louis Stevenson, Louisa May Alcott, Roald Dahl, L. Frank Baum).`,
        `- Level 3 (10s target, 22-28 words): Crisp, rhythmic classic English literature (e.g., Charles Dickens, Jane Austen, William Shakespeare, Rabindranath Tagore, Charlotte Brontë, Robert Frost).`,
        `All three works and authors MUST be completely different from each other and NOT in the exclusion list.`,
      ]
        .filter(Boolean)
        .join('\n');

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  level: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  author: { type: Type.STRING },
                  passage: { type: Type.STRING },
                },
                required: ['level', 'title', 'author', 'passage'],
              },
            },
          },
        }),
        AI_TIMEOUT_MS
      );

      const parsed = JSON.parse((response.text ?? '[]').trim()) as Array<{
        level?: number;
        title?: string;
        author?: string;
        passage?: string;
      }>;

      if (Array.isArray(parsed) && parsed.length >= 3) {
        const roundTitles = new Set<string>();
        const roundItems: ReadingPassage[] = ([1, 2, 3] as LevelNumber[])
          .map((lvl, idx): ReadingPassage | null => {
            const match = parsed.find((p) => p.level === lvl) || parsed[idx];
            if (!match?.title || !match?.author || !match?.passage) return null;
            const titleClean = match.title.trim();
            const passageClean = match.passage.trim();
            if (roundTitles.has(normalizeKey(titleClean))) return null;
            if (isAlreadyUsed(usedSet, [titleClean, passageClean.slice(0, 48)])) return null;
            roundTitles.add(normalizeKey(titleClean));
            return {
              id: `ai-read-${lvl}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              level: lvl,
              title: titleClean,
              author: match.author.trim(),
              passage: passageClean,
              recommendedSeconds: LEVEL_READING_SECONDS[lvl],
              source: 'ai',
            };
          })
          .filter((x): x is ReadingPassage => x !== null);

        if (roundItems.length === 3) {
          res.json({ items: roundItems });
          return;
        }
      }
    } catch (err) {
      console.warn('[reading/round] Gemini fallback activated:', err instanceof Error ? err.message : err);
    }
  }

  const localUsed = [...usedKeys];
  const fallbackItems: ReadingPassage[] = ([1, 2, 3] as LevelNumber[]).map((lvl) => {
    const pool = BACKUP_READING_PASSAGES.filter((p) => p.level === lvl);
    const chosen = pickUnusedBackup(pool, localUsed, (p) => [p.title, p.passage.slice(0, 48)]);
    localUsed.push(chosen.id, chosen.title, chosen.passage.slice(0, 48));
    return chosen;
  });
  res.json({ items: fallbackItems });
});

// Challenge 2: Letter to Your Future Self (Handwritten photo OCR + letter generation, or typed lines)
app.post('/api/challenge/letter', async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim().slice(0, 60) : '';
  const age = typeof req.body?.age === 'string' ? req.body.age.trim().slice(0, 20) : '';
  const grade = typeof req.body?.grade === 'string' ? req.body.grade.trim().slice(0, 40) : '';
  const notes = typeof req.body?.notes === 'string' ? req.body.notes.trim().slice(0, 500) : '';
  const rawImage = typeof req.body?.imageBase64 === 'string' ? req.body.imageBase64.trim() : '';
  const rawMime =
    typeof req.body?.imageMimeType === 'string' ? req.body.imageMimeType.trim() : 'image/jpeg';

  if (!name) {
    res.status(400).json({ error: 'Please enter your name so we can address your letter.' });
    return;
  }

  const stageDesc = [age ? `Age ${age}` : '', grade].filter(Boolean).join(', ');

  // Branch A: Handwritten letter photo uploaded or captured
  if (rawImage) {
    const cleanBase64 = rawImage.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
    const mimeType = allowedMimes.includes(rawMime.toLowerCase()) ? rawMime : 'image/jpeg';

    if (ai && cleanBase64.length > 50) {
      try {
        const imagePart = {
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        };
        const textPart = {
          text: [
            `You are reading a photo of a handwritten note or letter written by an exhibition visitor at the Supernova 2026 English Department booth.`,
            `Visitor Name: ${name}`,
            stageDesc ? `Visitor Age / Grade: ${stageDesc}` : '',
            notes ? `Extra typed note from visitor: ${notes}` : '',
            `Step 1: Carefully examine the image for handwritten English text.`,
            `- If the image does NOT contain legible handwriting (e.g., too blurry, too dark, blank paper, random object, or unreadable scribble where you cannot make out at least one meaningful phrase), set readable to false and leave transcribedText, letter, and signOff empty.`,
            `- If you CAN read the handwriting (even imperfect kids' handwriting or brief notes), set readable to true, transcribe what they wrote in transcribedText, and write a warm, uplifting, customized "Letter to Your Future Self" in letter + signOff.`,
            `Letter Guidelines (when readable is true):`,
            `- Address it warmly ("Dear Future ${name},").`,
            `- Directly reference and celebrate the specific hopes, stories, hobbies, or messages found in their handwriting.`,
            `- Tailor the warmth and vocabulary gracefully for ${stageDesc || 'a visitor of any age'}.`,
            `- Include one gentle English-literature touch (about turning a new page or writing their next chapter).`,
            `- Keep it 2–3 short, heartfelt paragraphs (around 95–135 words).`,
          ]
            .filter(Boolean)
            .join('\n'),
        };

        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: { parts: [imagePart, textPart] },
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  readable: { type: Type.BOOLEAN },
                  transcribedText: { type: Type.STRING },
                  letter: { type: Type.STRING },
                  signOff: { type: Type.STRING },
                },
                required: ['readable', 'transcribedText', 'letter', 'signOff'],
              },
            },
          }),
          AI_TIMEOUT_MS
        );

        const parsed = JSON.parse((response.text ?? '{}').trim()) as {
          readable?: boolean;
          transcribedText?: string;
          letter?: string;
          signOff?: string;
        };

        if (parsed.readable && parsed.letter && parsed.letter.trim().length > 30) {
          const result: LetterResponse = {
            readable: true,
            transcribedText: (parsed.transcribedText || '').trim(),
            letter: parsed.letter.trim(),
            signOff: (parsed.signOff || `With warm wishes,\n${name}`).trim(),
            source: 'ai',
          };
          res.json(result);
          return;
        }

        res.json({
          readable: false,
          letter: '',
          signOff: '',
          error:
            "We couldn't read the handwriting clearly in that photo. Please retake the photo in brighter light, or type a few lines below instead.",
          source: 'ai',
        } satisfies LetterResponse);
        return;
      } catch (err) {
        console.warn(
          '[letter/photo] Gemini handwriting read error:',
          err instanceof Error ? err.message : err
        );
      }
    }

    res.json({
      readable: false,
      letter: '',
      signOff: '',
      error:
        "We couldn't read the handwriting from that photo right now. Please retake the photo or type a few lines below instead.",
      source: 'backup',
    } satisfies LetterResponse);
    return;
  }

  // Branch B: Typed lines mode
  if (ai) {
    try {
      const prompt = [
        `Write a warm, uplifting, timeless "Letter to Your Future Self" for a visitor at the Supernova 2026 English Department exhibition.`,
        `Visitor Name: ${name}`,
        stageDesc ? `Visitor Age / Grade: ${stageDesc}` : '',
        notes
          ? `Visitor's hopes or message to their future self: ${notes}`
          : 'Focus on curiosity, kindness, and the joy of stories.',
        `Guidelines:`,
        `- Address it warmly ("Dear Future ${name},").`,
        `- Adjust vocabulary warmly so it delights ${stageDesc || 'a visitor of any age'}—sincere, clear, and encouraging.`,
        `- Weave in one gentle literary touch about turning a new page or writing their own chapter.`,
        `- Keep it to 2–3 short paragraphs (around 90–125 words) so it reads clearly on screen.`,
      ]
        .filter(Boolean)
        .join('\n');

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                letter: { type: Type.STRING },
                signOff: { type: Type.STRING },
              },
              required: ['letter', 'signOff'],
            },
          },
        }),
        AI_TIMEOUT_MS
      );

      const parsed = JSON.parse((response.text ?? '{}').trim()) as {
        letter?: string;
        signOff?: string;
      };

      if (parsed.letter && parsed.letter.trim().length > 30) {
        const result: LetterResponse = {
          readable: true,
          letter: parsed.letter.trim(),
          signOff: (parsed.signOff || `With warm wishes,\n${name}`).trim(),
          source: 'ai',
        };
        res.json(result);
        return;
      }
    } catch (err) {
      console.warn('[letter] Gemini fallback activated:', err instanceof Error ? err.message : err);
    }
  }

  const stagePhrase = stageDesc ? ` (${stageDesc})` : '';
  const focusLine = notes
    ? `Right now, here is what I want you to remember: ${notes}. I hope you still carry that spark with you and feel proud of how far you have come.`
    : `Right now, I am enjoying stories and ideas at the Supernova 2026 English Exhibition. I hope you are still curious, kind, and never too busy to open a good book.`;

  const fallbackLetter: LetterResponse = {
    readable: true,
    letter: `Dear Future ${name},\n\nAs I write this from the Supernova 2026 exhibition${stagePhrase}, I am pausing to imagine the bright chapters ahead of you. Every great story unfolds page by page—full of wonder, discovery, and courage.\n\n${focusLine}\n\nWhenever life feels busy, look back at this moment and keep writing a story you love.`,
    signOff: `Warmly across time,\n${name}`,
    source: 'backup',
  };
  res.json(fallbackLetter);
});

// Challenge 3: Picture Guess (Always calls Gemini AI first with random theme & full usedKeys)
app.post('/api/challenge/picture', async (req, res) => {
  const levelNum = Number(req.body?.level);
  const level: LevelNumber = levelNum === 2 ? 2 : levelNum === 3 ? 3 : 1;
  const usedKeys: string[] = Array.isArray(req.body?.usedKeys) ? req.body.usedKeys : [];
  const usedSet = new Set(usedKeys.map(normalizeKey));

  const levelThemes = PICTURE_THEMES_BY_LEVEL[level];
  const randomTheme = levelThemes[Math.floor(Math.random() * levelThemes.length)];

  const levelGuidance: Record<LevelNumber, string> = {
    1: 'Level 1 (Easy, recognizable to 1st graders & adults): Pick an iconic fairy tale or children’s story character/book/object (e.g., Cinderella, Pinocchio, Little Red Riding Hood, Snow White, Rapunzel, Jack and the Beanstalk, Goldilocks, The Cat in the Hat, The Ugly Duckling, Humpty Dumpty).',
    2: 'Level 2 (Intermediate): Pick a famous English storybook, adventure, or classic character/author (e.g., Alice in Wonderland, Treasure Island, Sherlock Holmes, The Wizard of Oz, The Jungle Book, Winnie-the-Pooh, A Christmas Carol, Robin Hood, Peter Pan, Matilda, Malgudi Days).',
    3: 'Level 3 (Challenging, classic English literature): Pick a celebrated novel, poem, play, or author (e.g., Edgar Allan Poe / The Raven, Moby-Dick, The Great Gatsby, Hamlet, Macbeth, Frankenstein, Romeo and Juliet, The Little Prince, Gulliver’s Travels, Dracula, Gitanjali).',
  };

  if (ai) {
    try {
      const avoidList = usedKeys.join(' | ');
      const prompt = [
        `Design one brand-new "Picture Guess" English literature visual puzzle from scratch.`,
        `Random focus for this request: "${randomTheme}" (Seed: ${Date.now()}-${Math.random().toString(36).slice(2, 8)}).`,
        levelGuidance[level],
        avoidList
          ? `CRITICAL: NEVER repeat any of these previously used answers or titles from this session:\n${avoidList}`
          : '',
        `Provide:`,
        `1. answer: the primary canonical answer.`,
        `2. acceptedAnswers: 3 to 5 reasonable variations (title, main character, author if iconic, short name).`,
        `3. category: one of "Book", "Character", "Author", "Poem", "Story".`,
        `4. hint: a short 1-sentence hint that does not name the answer directly.`,
        `5. captionNote: a 1-sentence visual description of the scene shown (without giving away the answer).`,
        `6. svgMarkup: a clean, charming, colorful, multi-shape storybook illustration as valid <svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">...</svg> markup using a warm parchment background (#FAF4E6 or fitting night/sky scene), framed border, and 8-18 clear geometric/path shapes that unmistakably depict the literary clue! CRITICAL: NEVER put any <text> tags, letters, words, or <script> inside the SVG.`,
      ]
        .filter(Boolean)
        .join('\n');

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                answer: { type: Type.STRING },
                acceptedAnswers: { type: Type.ARRAY, items: { type: Type.STRING } },
                category: { type: Type.STRING },
                hint: { type: Type.STRING },
                captionNote: { type: Type.STRING },
                svgMarkup: { type: Type.STRING },
              },
              required: ['answer', 'acceptedAnswers', 'category', 'hint', 'captionNote', 'svgMarkup'],
            },
          },
        }),
        AI_TIMEOUT_MS
      );

      const parsed = JSON.parse((response.text ?? '{}').trim()) as {
        answer?: string;
        acceptedAnswers?: string[];
        category?: string;
        hint?: string;
        captionNote?: string;
        svgMarkup?: string;
      };

      const safeSvg = parsed.answer && parsed.svgMarkup ? sanitizeSvgMarkup(parsed.svgMarkup, parsed.answer) : null;
      const validCategories = ['Book', 'Character', 'Author', 'Poem', 'Story'] as const;
      const category = validCategories.includes(parsed.category as (typeof validCategories)[number])
        ? (parsed.category as PicturePuzzle['category'])
        : 'Book';

      if (
        parsed.answer &&
        safeSvg &&
        parsed.hint &&
        !isAlreadyUsed(usedSet, [parsed.answer.trim()])
      ) {
        const accepted = Array.from(
          new Set([parsed.answer.trim(), ...(Array.isArray(parsed.acceptedAnswers) ? parsed.acceptedAnswers : [])].filter(Boolean))
        );
        const result: PicturePuzzle = {
          id: `ai-pic-${level}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          level,
          answer: parsed.answer.trim(),
          acceptedAnswers: accepted,
          category,
          hint: parsed.hint.trim(),
          svgMarkup: safeSvg,
          captionNote: (parsed.captionNote || 'Examine the literary clue carefully!').trim(),
          source: 'ai',
        };
        res.json(result);
        return;
      }
    } catch (err) {
      console.warn('[picture] Gemini fallback activated:', err instanceof Error ? err.message : err);
    }
  }

  const levelPool = BACKUP_PICTURE_PUZZLES.filter((p) => p.level === level);
  const backup = pickUnusedBackup(levelPool, usedKeys, (p) => [p.answer]);
  res.json(backup);
});

// Challenge 4: Quote Match (Easy, short famous lines; Indian + World writer mix; full usedKeys)
app.post('/api/challenge/quote/round', async (req, res) => {
  const usedKeys: string[] = Array.isArray(req.body?.usedKeys) ? req.body.usedKeys : [];
  const usedSet = new Set(usedKeys.map(normalizeKey));
  const theme = QUOTE_THEMES[Math.floor(Math.random() * QUOTE_THEMES.length)];
  const avoidList = usedKeys.join(' | ');

  const pattern: Array<'indian' | 'international'> =
    Math.random() > 0.5
      ? ['indian', 'international', 'indian']
      : ['international', 'indian', 'international'];

  if (ai) {
    try {
      const prompt = [
        `Generate a brand-new 3-level Quote Match round (Level 1, Level 2, Level 3) from scratch for an English literature exhibition (first graders up to adults).`,
        `Random literary theme for this round: "${theme}" (Seed: ${Date.now()}-${Math.random().toString(36).slice(2, 8)}).`,
        avoidList
          ? `CRITICAL: NEVER repeat ANY quote, work, or prompt from this already-used session list:\n${avoidList}`
          : '',
        `STRICT RULES:`,
        `1. EASY AT EVERY LEVEL: Quotes must be very famous, short (ideally 1 line, 6–15 words max), and easy to recognize! Level 3 should be ONLY slightly harder than Level 1—never obscure, never long, never trick questions.`,
        `2. INDIAN & WORLD WRITER MIX:`,
        `   - Level 1 origin: ${pattern[0].toUpperCase()} writer (ultra-iconic line even kids or families know).`,
        `   - Level 2 origin: ${pattern[1].toUpperCase()} writer (well-known classic line).`,
        `   - Level 3 origin: ${pattern[2].toUpperCase()} writer (famous line, only slightly more literary).`,
        `   - Indian English writers pool: Rabindranath Tagore, R. K. Narayan, Ruskin Bond, Sarojini Naidu, Mulk Raj Anand, Arundhati Roy.`,
        `   - Outside India writers pool: William Shakespeare, Charles Dickens, Jane Austen, Roald Dahl, A. A. Milne, Lewis Carroll.`,
        `   - Do NOT repeat the same author or book within the 3 levels.`,
        `3. ACCURACY & FAIR OPTIONS:`,
        `   - Every quote MUST be 100% accurately attributed to its true author and workTitle (no disputed quotes).`,
        `   - You may ask for the author (askType: "author") OR a super-famous book title (askType: "book", e.g., Oliver Twist, Alice's Adventures in Wonderland, Matilda, Hamlet, Malgudi Days, Gitanjali).`,
        `   - Provide 4 distinct options where options[0] is the exact correct answer and options[1..3] are believable yet clearly different choices.`,
      ]
        .filter(Boolean)
        .join('\n');

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  level: { type: Type.INTEGER },
                  quote: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  workTitle: { type: Type.STRING },
                  author: { type: Type.STRING },
                  origin: { type: Type.STRING },
                  askType: { type: Type.STRING },
                },
                required: ['level', 'quote', 'options', 'workTitle', 'author', 'origin', 'askType'],
              },
            },
          },
        }),
        AI_TIMEOUT_MS
      );

      const parsed = JSON.parse((response.text ?? '[]').trim()) as Array<{
        level?: number;
        quote?: string;
        options?: string[];
        workTitle?: string;
        author?: string;
        origin?: string;
        askType?: string;
      }>;

      if (Array.isArray(parsed) && parsed.length >= 3) {
        const seenAuthors = new Set<string>();
        const roundItems: QuoteQuestion[] = ([1, 2, 3] as LevelNumber[])
          .map((lvl, idx): QuoteQuestion | null => {
            const match = parsed.find((q) => q.level === lvl) || parsed[idx];
            if (
              !match?.quote ||
              !match?.author ||
              !match?.workTitle ||
              !Array.isArray(match.options) ||
              match.options.length !== 4
            ) {
              return null;
            }
            const cleanQuote = match.quote.trim();
            const cleanWork = match.workTitle.trim();
            const cleanAuthor = match.author.trim();
            const cleanOptions = match.options.map((o) => String(o).trim());
            if (new Set(cleanOptions).size !== 4) return null;

            const authorNorm = normalizeKey(cleanAuthor);
            if (seenAuthors.has(authorNorm)) return null;
            if (isAlreadyUsed(usedSet, [cleanQuote.slice(0, 48), cleanQuote])) return null;
            seenAuthors.add(authorNorm);

            const q: QuoteQuestion = {
              id: `ai-quote-${lvl}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              level: lvl,
              quote: cleanQuote,
              options: cleanOptions,
              correctIndex: 0,
              workTitle: cleanWork,
              author: cleanAuthor,
              origin: match.origin === 'indian' ? 'indian' : 'international',
              askType: match.askType === 'book' ? 'book' : 'author',
              source: 'ai',
            };
            return shuffleOptions(q);
          })
          .filter((x): x is QuoteQuestion => x !== null);

        if (roundItems.length === 3) {
          res.json({ items: roundItems });
          return;
        }
      }
    } catch (err) {
      console.warn('[quote/round] Gemini fallback activated:', err instanceof Error ? err.message : err);
    }
  }

  const localUsed = [...usedKeys];
  const fallbackItems: QuoteQuestion[] = ([1, 2, 3] as LevelNumber[]).map((lvl, idx) => {
    const targetOrigin = pattern[idx];
    const originPool = BACKUP_QUOTE_QUESTIONS.filter(
      (q) => q.level === lvl && q.origin === targetOrigin
    );
    const levelPool =
      originPool.length > 0 ? originPool : BACKUP_QUOTE_QUESTIONS.filter((q) => q.level === lvl);
    const chosen = pickUnusedBackup(levelPool, localUsed, (q) => [
      q.quote.slice(0, 48),
      q.quote,
    ]);
    localUsed.push(chosen.id, chosen.quote.slice(0, 48));
    return shuffleOptions(chosen);
  });

  res.json({ items: fallbackItems });
});

// Challenge 5: Idiom Challenge (Full 3-level fresh round — always calls Gemini AI first)
app.post('/api/challenge/idiom/round', async (req, res) => {
  const usedKeys: string[] = Array.isArray(req.body?.usedKeys) ? req.body.usedKeys : [];
  const usedSet = new Set(usedKeys.map(normalizeKey));
  const topic = IDIOM_TOPICS[Math.floor(Math.random() * IDIOM_TOPICS.length)];
  const avoidList = usedKeys.join(' | ');

  if (ai) {
    try {
      const prompt = [
        `Generate a brand-new 3-level English Idiom Challenge round (Level 1, Level 2, Level 3) from scratch.`,
        `Random topic angle for this visitor: "${topic}" (Seed: ${Date.now()}-${Math.random().toString(36).slice(2, 8)}).`,
        avoidList
          ? `CRITICAL: NEVER repeat ANY idiom from this already-used session list:\n${avoidList}`
          : '',
        `Difficulty guidelines:`,
        `- Level 1: Very common, easy everyday English idioms that even a first grader could guess (e.g., piece of cake, raining cats and dogs, busy as a bee, under the weather, spill the beans, cool as a cucumber).`,
        `- Level 2: Familiar idioms well known to teens (e.g., break the ice, once in a blue moon, on cloud nine, hit the books, the ball is in your court, barking up the wrong tree).`,
        `- Level 3: Slightly harder classic idioms for adults—still common and well known, NEVER obscure (e.g., a blessing in disguise, read between the lines, bite the bullet, play devil's advocate, leave no stone unturned).`,
        `For each level provide:`,
        `- idiom: the clean English idiom phrase.`,
        `- options: 4 clear, distinct meaning options where options[0] is the ONE exact correct meaning and options[1..3] are clearly wrong.`,
        `- meaning: a concise 1-sentence explanation shown after answering.`,
        `- example: a natural 1-sentence example using the idiom.`,
      ]
        .filter(Boolean)
        .join('\n');

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  level: { type: Type.INTEGER },
                  idiom: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  meaning: { type: Type.STRING },
                  example: { type: Type.STRING },
                },
                required: ['level', 'idiom', 'options', 'meaning', 'example'],
              },
            },
          },
        }),
        AI_TIMEOUT_MS
      );

      const parsed = JSON.parse((response.text ?? '[]').trim()) as Array<{
        level?: number;
        idiom?: string;
        options?: string[];
        meaning?: string;
        example?: string;
      }>;

      if (Array.isArray(parsed) && parsed.length >= 3) {
        const seenIdioms = new Set<string>();
        const roundItems: IdiomQuestion[] = ([1, 2, 3] as LevelNumber[])
          .map((lvl, idx): IdiomQuestion | null => {
            const match = parsed.find((q) => q.level === lvl) || parsed[idx];
            if (
              !match?.idiom ||
              !match?.meaning ||
              !match?.example ||
              !Array.isArray(match.options) ||
              match.options.length !== 4
            ) {
              return null;
            }
            const cleanIdiom = match.idiom.trim();
            const cleanOptions = match.options.map((o) => String(o).trim());
            if (new Set(cleanOptions).size !== 4) return null;

            const normIdiom = normalizeKey(cleanIdiom);
            if (seenIdioms.has(normIdiom)) return null;
            if (isAlreadyUsed(usedSet, [cleanIdiom])) return null;
            seenIdioms.add(normIdiom);

            const item: IdiomQuestion = {
              id: `ai-idiom-${lvl}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              level: lvl,
              idiom: cleanIdiom,
              options: cleanOptions,
              correctIndex: 0,
              meaning: match.meaning.trim(),
              example: match.example.trim(),
              source: 'ai',
            };
            return shuffleOptions(item);
          })
          .filter((x): x is IdiomQuestion => x !== null);

        if (roundItems.length === 3) {
          res.json({ items: roundItems });
          return;
        }
      }
    } catch (err) {
      console.warn('[idiom/round] Gemini fallback activated:', err instanceof Error ? err.message : err);
    }
  }

  const localUsed = [...usedKeys];
  const fallbackItems: IdiomQuestion[] = ([1, 2, 3] as LevelNumber[]).map((lvl) => {
    const levelPool = BACKUP_IDIOM_QUESTIONS.filter((q) => q.level === lvl);
    const chosen = pickUnusedBackup(levelPool, localUsed, (q) => [q.idiom]);
    localUsed.push(chosen.id, chosen.idiom);
    return shuffleOptions(chosen);
  });

  res.json({ items: fallbackItems });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Literature Challenge Zone running at http://localhost:${PORT}`);
  });
}

startServer();
