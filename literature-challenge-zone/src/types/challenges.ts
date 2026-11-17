export type ChallengeId = 'reading' | 'letter' | 'picture' | 'quote' | 'idiom';

export type LevelNumber = 1 | 2 | 3;

export type PictureImageKey = 'glass_slipper' | 'wooden_puppet' | 'raven_study';

export interface ReadingPassage {
  id: string;
  level: LevelNumber;
  title: string;
  author: string;
  passage: string;
  recommendedSeconds: number;
  source: 'ai' | 'backup';
}

export interface PicturePuzzle {
  id: string;
  level: LevelNumber;
  answer: string;
  acceptedAnswers: string[];
  category: 'Book' | 'Character' | 'Author' | 'Poem' | 'Story';
  hint: string;
  imageKey?: PictureImageKey;
  svgMarkup?: string;
  captionNote: string;
  source: 'ai' | 'backup';
}

export interface QuoteQuestion {
  id: string;
  level: LevelNumber;
  quote: string;
  options: string[];
  correctIndex: number;
  workTitle: string;
  author: string;
  origin?: 'indian' | 'international';
  askType: 'book' | 'author';
  source: 'ai' | 'backup';
}

export interface IdiomQuestion {
  id: string;
  level: LevelNumber;
  idiom: string;
  options: string[];
  correctIndex: number;
  meaning: string;
  example: string;
  source: 'ai' | 'backup';
}

export interface LetterResponse {
  letter: string;
  signOff: string;
  transcribedText?: string;
  readable?: boolean;
  error?: string;
  source: 'ai' | 'backup';
}
