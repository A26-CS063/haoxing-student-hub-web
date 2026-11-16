import { useEffect, useState } from "react";

import { studentService } from "@/services/students/studentService";
import type { Paginated, Student, StudentFilterOptions, StudentQuery } from "@/types/student";

interface State {
  data: Paginated<Student> | null;
  loading: boolean;
  error: string | null;
  /** Lama respons terakhir (ms), untuk cek kriteria FR-11 (< 2 detik). */
  durationMs: number | null;
}

export function useStudents(query: StudentQuery) {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null, durationMs: null });
  const [reloadKey, setReloadKey] = useState(0);
  const key = JSON.stringify(query);

  useEffect(() => {
    const controller = new AbortController();
    const started = performance.now();
    setState((s) => ({ ...s, loading: true, error: null }));

    studentService
      .list(JSON.parse(key) as StudentQuery, controller.signal)
      .then((data) =>
        setState({ data, loading: false, error: null, durationMs: Math.round(performance.now() - started) }),
      )
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : "Gagal memuat data siswa.",
        }));
      });

    return () => controller.abort();
  }, [key, reloadKey]);

  return { ...state, reload: () => setReloadKey((k) => k + 1) };
}

export function useStudentFilterOptions() {
  const [options, setOptions] = useState<StudentFilterOptions>({ programs: [], levels: [] });
  useEffect(() => {
    let active = true;
    studentService
      .filterOptions()
      .then((o) => active && setOptions(o))
      .catch(() => {
        /* filter tetap bisa dipakai tanpa pilihan program/level */
      });
    return () => {
      active = false;
    };
  }, []);
  return options;
}
