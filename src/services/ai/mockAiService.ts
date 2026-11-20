import type { FaqResult, LevelRecommendation, PretestScores } from "@/types/ai";

/**
 * JAWABAN TIRUAN untuk pengembangan frontend tanpa backend (VITE_AUTH_MODE=mock).
 * Bukan data program yang sebenarnya.
 */
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockAskFaq(question: string): Promise<FaqResult> {
  await wait(900);
  return {
    answer: `(Jawaban tiruan) Pertanyaan Anda: "${question}". Hubungkan ke backend untuk mendapat jawaban dari data program Haoxing.`,
    sources: ["data tiruan"],
    mode: "fallback",
  };
}

const LEVELS = ["Basic", "Tingkat 1", "Tingkat 2", "Tingkat 3", "Tingkat 4"];

export async function mockPredictLevel(scores: PretestScores): Promise<LevelRecommendation> {
  await wait(700);
  const avg = (scores.skor_pretest + scores.skor_listening + scores.skor_grammar) / 3;
  const index = Math.min(4, Math.floor(avg / 20));
  const probabilities = LEVELS.map((level, i) => ({
    level,
    probability: i === index ? 0.8 : i === index - 1 || i === index + 1 ? 0.1 : 0,
  }));
  return {
    recommendedLevel: LEVELS[index],
    confidence: 0.8,
    probabilities,
    model: "Tiruan (bukan model asli)",
  };
}
