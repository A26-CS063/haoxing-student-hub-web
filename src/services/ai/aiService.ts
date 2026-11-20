import { AUTH_MODE } from "@/services/auth/authService";
import {
  ApiError,
  type FaqResult,
  type LevelRecommendation,
  type PretestScores,
} from "@/types/ai";

import { mockAskFaq, mockPredictLevel } from "./mockAiService";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

/**
 * Backend bisa menunggu layanan AI yang "tidur" sampai sekitar 80 detik (2 percobaan).
 * Frontend menunggu sedikit lebih lama supaya pesan error berasal dari backend, bukan dari sini.
 */
const REQUEST_TIMEOUT_MS = 100_000;

async function post<T>(path: string, token: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(0, "timeout", "Permintaan terlalu lama. Coba lagi sebentar lagi.");
    }
    throw new ApiError(0, "network", "Tidak dapat terhubung ke server. Periksa koneksi, lalu coba lagi.");
  } finally {
    clearTimeout(timer);
  }

  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const e = (data as { error?: { code?: string; message?: string } } | null)?.error;
    throw new ApiError(res.status, e?.code ?? "unknown", e?.message ?? "Terjadi kesalahan. Coba lagi.");
  }
  return data as T;
}

export function askFaq(token: string, question: string): Promise<FaqResult> {
  if (AUTH_MODE === "mock") return mockAskFaq(question);
  return post<FaqResult>("/ai/faq", token, { pertanyaan: question });
}

export function predictLevel(token: string, scores: PretestScores): Promise<LevelRecommendation> {
  if (AUTH_MODE === "mock") return mockPredictLevel(scores);
  return post<LevelRecommendation>("/ai/predict-level", token, scores);
}
