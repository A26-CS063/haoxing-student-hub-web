export type FaqMode = "generative" | "fallback";

export interface FaqResult {
  answer: string;
  sources: string[];
  mode: FaqMode;
}

export interface LevelProbability {
  level: string;
  probability: number;
}

export interface LevelRecommendation {
  recommendedLevel: string;
  /** 0 sampai 1 */
  confidence: number;
  probabilities: LevelProbability[];
  model: string | null;
}

export interface PretestScores {
  skor_pretest: number;
  skor_listening: number;
  skor_grammar: number;
}

/** Error dari backend Express, dengan format { error: { code, message, details, request_id } }. */
export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}
