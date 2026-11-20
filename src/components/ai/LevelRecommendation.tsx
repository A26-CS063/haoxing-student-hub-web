import { useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { predictLevel } from "@/services/ai/aiService";
import { ApiError, type LevelRecommendation as Recommendation } from "@/types/ai";

interface Props {
  /** Dipanggil saat admin menekan "Gunakan level ini" (mis. mengisi form pre-test). */
  onUse?: (level: string) => void;
}

const FIELDS = [
  { name: "skor_pretest", label: "Skor pre-test" },
  { name: "skor_listening", label: "Skor listening" },
  { name: "skor_grammar", label: "Skor grammar" },
] as const;

type FieldName = (typeof FIELDS)[number]["name"];

function parseScore(raw: string): number | null {
  if (raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : null;
}

export function LevelRecommendation({ onUse }: Props) {
  const { session } = useAuth();
  const [values, setValues] = useState<Record<FieldName, string>>({
    skor_pretest: "",
    skor_listening: "",
    skor_grammar: "",
  });
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setError(null);
    setResult(null);

    const pretest = parseScore(values.skor_pretest);
    const listening = parseScore(values.skor_listening);
    const grammar = parseScore(values.skor_grammar);
    if (pretest === null || listening === null || grammar === null) {
      setFieldError("Isi ketiga skor dengan angka antara 0 dan 100.");
      return;
    }
    setFieldError(null);

    setLoading(true);
    try {
      setResult(
        await predictLevel(session.accessToken, {
          skor_pretest: pretest,
          skor_listening: listening,
          skor_grammar: grammar,
        }),
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Rekomendasi gagal. Silakan isi level secara manual.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rekomendasi level (uji coba)</CardTitle>
        <CardDescription>
          Saran tingkat kelas dari skor pre-test. Hanya saran: admin yang memutuskan level akhir.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {FIELDS.map(({ name, label }) => (
              <div key={name} className="flex flex-col gap-2">
                <Label htmlFor={name}>{label}</Label>
                <Input
                  id={name}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  value={values[name]}
                  aria-invalid={!!fieldError && parseScore(values[name]) === null}
                  onChange={(e) => setValues((v) => ({ ...v, [name]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}
          <div>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              {loading ? "Menghitung..." : "Dapatkan rekomendasi"}
            </Button>
          </div>
        </form>

        {loading && (
          <p className="text-sm text-muted-foreground" role="status">
            Layanan AI kadang perlu waktu sekitar satu menit untuk bangun. Mohon tunggu.
          </p>
        )}

        {error && (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>Rekomendasi belum tersedia</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="flex flex-col gap-4 rounded-lg border bg-muted/50 p-4" role="status">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground">Disarankan:</span>
              <span className="font-heading text-xl font-semibold">{result.recommendedLevel}</span>
              <Badge variant="secondary">Keyakinan {Math.round(result.confidence * 100)}%</Badge>
            </div>

            <ul className="flex flex-col gap-2" aria-label="Peluang tiap tingkat">
              {result.probabilities.map(({ level, probability }) => (
                <li key={level} className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-3 text-sm">
                  <span>{level}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-secondary">
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${Math.round(probability * 100)}%` }}
                    />
                  </span>
                  <span className="text-right tabular-nums text-muted-foreground">
                    {Math.round(probability * 100)}%
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Model: {result.model ?? "tidak diketahui"}. Dilatih dari data contoh, jadi tetap periksa sebelum dipakai.
              </p>
              {onUse && (
                <Button type="button" size="sm" onClick={() => onUse(result.recommendedLevel)}>
                  Gunakan level ini
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
