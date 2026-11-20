import { useEffect, useRef, useState } from "react";
import { Loader2, Send, TriangleAlert } from "lucide-react";

import { LevelRecommendation } from "@/components/ai/LevelRecommendation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { askFaq } from "@/services/ai/aiService";
import { ApiError, type FaqResult } from "@/types/ai";

const MAX_LENGTH = 500;
const SLOW_AFTER_MS = 8_000;

const EXAMPLES = [
  "Berapa harga kelas HSK?",
  "Kapan kelas dimulai?",
  "Apa bedanya kelas online dan offline?",
  "Apakah bisa refund?",
];

interface Entry {
  id: number;
  question: string;
  result: FaqResult;
}

export default function AiAssistantPage() {
  const { session, role } = useAuth();
  const [question, setQuestion] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextId = useRef(1);

  // Tampilkan pesan "layanan sedang bangun" bila menunggu lama.
  useEffect(() => {
    if (!loading) {
      setSlow(false);
      return;
    }
    const timer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [loading]);

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!session || !trimmed || loading) return;
    setError(null);
    setLoading(true);
    try {
      const result = await askFaq(session.accessToken, trimmed);
      setEntries((prev) => [{ id: nextId.current++, question: trimmed, result }, ...prev]);
      setQuestion("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Asisten AI</h1>
        <p className="text-sm text-muted-foreground">
          Tanya seputar program, harga, dan jadwal. Jawaban AI bisa keliru, jadi periksa kembali sebelum diteruskan ke calon siswa.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit(question);
            }}
            className="flex flex-col gap-3"
          >
            <label htmlFor="faq-question" className="sr-only">
              Pertanyaan
            </label>
            <Textarea
              id="faq-question"
              value={question}
              maxLength={MAX_LENGTH}
              placeholder="Contoh: Berapa harga HSK 2?"
              disabled={loading}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  void submit(question);
                }
              }}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground tabular-nums">
                {question.length}/{MAX_LENGTH}
              </span>
              <Button type="submit" disabled={loading || question.trim().length === 0}>
                {loading ? <Loader2 className="animate-spin" /> : <Send />}
                {loading ? "Mencari jawaban..." : "Tanya"}
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2" aria-label="Contoh pertanyaan">
            {EXAMPLES.map((example) => (
              <Button
                key={example}
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={() => void submit(example)}
              >
                {example}
              </Button>
            ))}
          </div>

          {slow && (
            <p className="text-sm text-muted-foreground" role="status">
              Layanan AI sedang bangun, ini bisa memakan waktu sampai satu menit. Mohon tunggu.
            </p>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>Pertanyaan belum terjawab</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {entries.length === 0 && !loading && !error && (
        <p className="text-sm text-muted-foreground">Belum ada pertanyaan. Coba salah satu contoh di atas.</p>
      )}

      <div className="flex flex-col gap-4" aria-live="polite">
        {entries.map(({ id, question: q, result }) => (
          <Card key={id} className="gap-3 py-5">
            <CardHeader>
              <CardDescription>Pertanyaan</CardDescription>
              <CardTitle className="text-base">{q}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Badge variant={result.mode === "generative" ? "secondary" : "outline"}>
                  {result.mode === "generative" ? "Dijawab AI" : "Mode cadangan"}
                </Badge>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.answer}</p>
              {result.mode === "fallback" && (
                <p className="text-xs text-muted-foreground">
                  AI generatif sedang tidak tersedia, jadi jawaban berupa kutipan data program.
                </p>
              )}
              {result.sources.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <p className="font-bold">Sumber</p>
                  <ul className="list-inside list-disc">
                    {result.sources.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sementara di sini untuk menguji integrasi. Pindahkan ke form pre-test siswa nanti. */}
      {role === "admin" && <LevelRecommendation />}
    </div>
  );
}
