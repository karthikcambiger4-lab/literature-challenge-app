import {
  BACKUP_IDIOM_QUESTIONS,
  BACKUP_PICTURE_PUZZLES,
  BACKUP_QUOTE_QUESTIONS,
  BACKUP_READING_PASSAGES,
} from '../data/fallbackData.ts';
import type {
  IdiomQuestion,
  LetterResponse,
  LevelNumber,
  PicturePuzzle,
  QuoteQuestion,
  ReadingPassage,
} from '../types/challenges.ts';

function pickClientBackup<T extends { id: string }>(
  items: T[],
  usedKeys: string[],
  extraKey?: (item: T) => string
): T {
  const usedSet = new Set(usedKeys.map((k) => k.toLowerCase().trim()));
  const fresh = items.filter((item) => {
    if (usedSet.has(item.id.toLowerCase())) return false;
    if (extraKey && usedSet.has(extraKey(item).toLowerCase().trim())) return false;
    return true;
  });
  const pool = fresh.length > 0 ? fresh : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function fetchReadingRound(usedKeys: string[]): Promise<ReadingPassage[]> {
  try {
    const res = await fetch('/api/challenge/reading/round', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usedKeys }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { items?: ReadingPassage[] };
    if (Array.isArray(data.items) && data.items.length === 3) {
      return data.items;
    }
    throw new Error('Incomplete round');
  } catch {
    const localUsed = [...usedKeys];
    return ([1, 2, 3] as LevelNumber[]).map((lvl) => {
      const pool = BACKUP_READING_PASSAGES.filter((p) => p.level === lvl);
      const chosen = pickClientBackup(pool, localUsed, (p) => p.title);
      localUsed.push(chosen.id, chosen.title);
      return chosen;
    });
  }
}

export async function fetchPicturePuzzle(
  level: LevelNumber,
  usedKeys: string[]
): Promise<PicturePuzzle> {
  try {
    const res = await fetch('/api/challenge/picture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, usedKeys }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as PicturePuzzle;
  } catch {
    const pool = BACKUP_PICTURE_PUZZLES.filter((p) => p.level === level);
    return pickClientBackup(pool, usedKeys, (p) => p.answer);
  }
}

export async function fetchQuoteRound(usedKeys: string[]): Promise<QuoteQuestion[]> {
  try {
    const res = await fetch('/api/challenge/quote/round', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usedKeys }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { items?: QuoteQuestion[] };
    if (Array.isArray(data.items) && data.items.length === 3) {
      return data.items;
    }
    throw new Error('Incomplete round');
  } catch {
    const localUsed = [...usedKeys];
    return ([1, 2, 3] as LevelNumber[]).map((lvl) => {
      const pool = BACKUP_QUOTE_QUESTIONS.filter((q) => q.level === lvl);
      const chosen = pickClientBackup(pool, localUsed, (q) => q.quote.slice(0, 48));
      localUsed.push(chosen.id, chosen.quote.slice(0, 48));
      return chosen;
    });
  }
}

export async function fetchIdiomRound(usedKeys: string[]): Promise<IdiomQuestion[]> {
  try {
    const res = await fetch('/api/challenge/idiom/round', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usedKeys }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { items?: IdiomQuestion[] };
    if (Array.isArray(data.items) && data.items.length === 3) {
      return data.items;
    }
    throw new Error('Incomplete round');
  } catch {
    const localUsed = [...usedKeys];
    return ([1, 2, 3] as LevelNumber[]).map((lvl) => {
      const pool = BACKUP_IDIOM_QUESTIONS.filter((q) => q.level === lvl);
      const chosen = pickClientBackup(pool, localUsed, (q) => q.idiom);
      localUsed.push(chosen.id, chosen.idiom);
      return chosen;
    });
  }
}

export async function fetchPersonalizedLetter(payload: {
  name: string;
  age: string;
  grade: string;
  notes: string;
  imageBase64?: string;
  imageMimeType?: string;
}): Promise<LetterResponse> {
  try {
    const res = await fetch('/api/challenge/letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as LetterResponse;
  } catch {
    if (payload.imageBase64) {
      return {
        readable: false,
        letter: '',
        signOff: '',
        error:
          "We couldn't read the handwriting from that photo right now. Please retake the photo or type a few lines below instead.",
        source: 'backup',
      };
    }
    const focus = payload.notes.trim()
      ? `Right now, my hopes and thoughts are: ${payload.notes.trim()}.`
      : 'Right now, I am exploring stories at the Supernova 2026 English Exhibition.';
    return {
      readable: true,
      letter: `Dear Future ${payload.name.trim()},\n\nI am writing to you from the Supernova 2026 English Exhibition! Every chapter of life brings new stories to read and new pages to write.\n\n${focus}\n\nKeep reading, stay curious, and be proud of who you are becoming.`,
      signOff: `Warmly,\n${payload.name.trim()}`,
      source: 'backup',
    };
  }
}
