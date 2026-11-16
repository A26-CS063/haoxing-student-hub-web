import rawStudents from "@/data/students.json";
import type {
  Student,
  StudentQuery,
  StudentSortField,
} from "@/types/student";

import type { StudentService } from "./studentService";

/** Data di memori. Perubahan (tambah/ubah/arsip) nanti juga disimpan di sini. */
const students: Student[] = rawStudents as Student[];

const delay = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Dibatalkan", "AbortError"));
    });
  });

// ---------- Pencarian (FR-12): nama, kontak, kode; toleran salah ketik ringan ----------

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

const digitsOnly = (s: string) => s.replace(/\D/g, "");

/** Samakan awalan nomor: +62 / 62 / 0 → 0 */
const normalizePhone = (s: string) => {
  const d = digitsOnly(s);
  if (d.startsWith("62")) return "0" + d.slice(2);
  if (d.startsWith("8")) return "0" + d;
  return d;
};

/**
 * Jarak edit (Damerau–Levenshtein versi OSA) dengan batas: huruf salah, kurang, lebih,
 * atau dua huruf tertukar ("hendar" → "hendra") masing-masing dihitung 1.
 */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1);
      }
      cur[j] = v;
      rowMin = Math.min(rowMin, v);
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length];
}

/** Skor relevansi: makin besar makin cocok, 0 = tidak cocok. */
function searchScore(s: Student, rawQuery: string): number {
  const q = normalize(rawQuery);
  if (!q) return 1;

  const code = s.studentCode.toLowerCase();
  if (code === q) return 100;
  if (code.includes(q)) return 80;

  const qDigits = digitsOnly(q);
  if (qDigits.length >= 4 && qDigits.length === q.replace(/[\s+\-()]/g, "").length) {
    if (normalizePhone(s.phone).includes(normalizePhone(q))) return 90;
  }

  const name = normalize(s.fullName);
  if (name.startsWith(q)) return 70;
  if (name.includes(q)) return 60;

  // Setiap kata yang diketik harus cocok dengan salah satu kata di nama
  const nameWords = name.split(/\s+/);
  const queryWords = q.split(/\s+/).filter(Boolean);
  let total = 0;
  for (const w of queryWords) {
    let best = 0;
    for (const nw of nameWords) {
      if (nw.startsWith(w)) best = Math.max(best, 50);
      else if (w.length >= 4 && editDistance(w, nw.slice(0, w.length + 1), 1) <= 1) best = Math.max(best, 30);
      else if (w.length >= 4 && editDistance(w, nw, 2) <= (w.length >= 7 ? 2 : 1)) best = Math.max(best, 25);
    }
    if (best === 0) return 0;
    total += best;
  }
  return total / queryWords.length;
}

// ---------- Sortir ----------

const collator = new Intl.Collator("id", { numeric: true, sensitivity: "base" });

function compare(a: Student, b: Student, field: StudentSortField): number {
  const va = a[field] ?? "";
  const vb = b[field] ?? "";
  return collator.compare(String(va), String(vb));
}

export const mockStudentService: StudentService = {
  async list(query: StudentQuery, signal?: AbortSignal) {
    await delay(150 + Math.random() * 150, signal); // tiru waktu jaringan

    const search = query.search?.trim() ?? "";
    const statusSet = query.status?.length ? new Set(query.status) : null;

    let rows: { s: Student; score: number }[] = [];
    for (const s of students) {
      if (!query.includeArchived && s.archivedAt) continue;
      if (statusSet && !statusSet.has(s.status)) continue;
      if (query.program && s.program !== query.program) continue;
      if (query.mode && s.mode !== query.mode) continue;
      if (query.level && s.level !== query.level) continue;
      if (query.registeredFrom && s.registeredAt < query.registeredFrom) continue;
      if (query.registeredTo && s.registeredAt > query.registeredTo) continue;
      const score = search ? searchScore(s, search) : 1;
      if (score > 0) rows.push({ s, score });
    }

    if (query.sortField) {
      const dir = query.sortDir === "desc" ? -1 : 1;
      const field = query.sortField;
      rows.sort((a, b) => dir * compare(a.s, b.s, field) || collator.compare(a.s.studentCode, b.s.studentCode));
    } else if (search) {
      rows.sort((a, b) => b.score - a.score || collator.compare(a.s.fullName, b.s.fullName));
    } else {
      // Bawaan: pendaftar terbaru di atas
      rows = rows.sort((a, b) => b.s.registeredAt.localeCompare(a.s.registeredAt) || collator.compare(a.s.studentCode, b.s.studentCode));
    }

    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
    const page = Math.min(Math.max(1, query.page), totalPages);
    const start = (page - 1) * query.pageSize;

    return {
      items: rows.slice(start, start + query.pageSize).map((r) => r.s),
      total,
      page,
      pageSize: query.pageSize,
      totalPages,
    };
  },

  async filterOptions() {
    const programs = [...new Set(students.map((s) => s.program))].sort(collator.compare);
    const levels = [...new Set(students.map((s) => s.level).filter((l): l is string => !!l))].sort(
      collator.compare,
    );
    return { programs, levels };
  },
};
