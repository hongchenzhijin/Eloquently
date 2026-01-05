
export interface WordEntry {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  etymology?: string;
}

export interface EvaluationResult {
  score: number;
  feedback: string;
  suggestion?: string;
  isExcellent: boolean;
}

export interface AppState {
  currentWordIndex: number;
  userSentence: string;
  evaluation: EvaluationResult | null;
  isLoading: boolean;
}
