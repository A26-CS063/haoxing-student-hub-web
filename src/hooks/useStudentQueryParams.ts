import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import {
  STUDENT_STATUSES,
  STUDY_MODES,
  type StudentQuery,
  type StudentSortField,
  type StudentStatus,
  type StudyMode,
} from "@/types/student";

export const PAGE_SIZES = [10, 20, 50, 100] as const;
const DEFAULT_PAGE_SIZE = 20;
const SORT_FIELDS: StudentSortField[] = [
  "studentCode",
  "fullName",
  "program",
  "level",
  "status",
  "registeredAt",
];

/** Filter disimpan di URL (?status=aktif&page=2) supaya bisa dibagikan dan dipakai ekspor (FR-16). */
export function useStudentQueryParams() {
  const [params, setParams] = useSearchParams();

  const query = useMemo<StudentQuery>(() => {
    const num = (key: string, fallback: number) => {
      const n = Number(params.get(key));
      return Number.isInteger(n) && n > 0 ? n : fallback;
    };
    const size = num("size", DEFAULT_PAGE_SIZE);
    const sort = params.get("sort") as StudentSortField | null;
    const mode = params.get("mode") as StudyMode | null;
    const status = (params.get("status") ?? "")
      .split(",")
      .filter((s): s is StudentStatus => (STUDENT_STATUSES as readonly string[]).includes(s));

    return {
      page: num("page", 1),
      pageSize: (PAGE_SIZES as readonly number[]).includes(size) ? size : DEFAULT_PAGE_SIZE,
      search: params.get("q") ?? undefined,
      sortField: sort && SORT_FIELDS.includes(sort) ? sort : undefined,
      sortDir: params.get("dir") === "desc" ? "desc" : "asc",
      status: status.length ? status : undefined,
      program: params.get("program") ?? undefined,
      mode: mode && (STUDY_MODES as readonly string[]).includes(mode) ? mode : undefined,
      level: params.get("level") ?? undefined,
      registeredFrom: params.get("from") ?? undefined,
      registeredTo: params.get("to") ?? undefined,
    };
  }, [params]);

  /** Ubah sebagian query. Selain pindah halaman, halaman otomatis kembali ke 1. */
  const update = useCallback(
    (patch: Partial<StudentQuery>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const set = (key: string, value: string | undefined) => {
            if (value) next.set(key, value);
            else next.delete(key);
          };
          if ("search" in patch) set("q", patch.search?.trim() || undefined);
          if ("status" in patch) set("status", patch.status?.join(","));
          if ("program" in patch) set("program", patch.program);
          if ("mode" in patch) set("mode", patch.mode);
          if ("level" in patch) set("level", patch.level);
          if ("registeredFrom" in patch) set("from", patch.registeredFrom);
          if ("registeredTo" in patch) set("to", patch.registeredTo);
          if ("sortField" in patch) set("sort", patch.sortField);
          if ("sortDir" in patch) set("dir", patch.sortDir === "desc" ? "desc" : undefined);
          if ("pageSize" in patch)
            set("size", patch.pageSize === DEFAULT_PAGE_SIZE ? undefined : String(patch.pageSize));

          if ("page" in patch) set("page", patch.page && patch.page > 1 ? String(patch.page) : undefined);
          else next.delete("page");
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const reset = useCallback(() => setParams(new URLSearchParams(), { replace: true }), [setParams]);

  const activeFilterCount = [
    query.search,
    query.status,
    query.program,
    query.mode,
    query.level,
    query.registeredFrom,
    query.registeredTo,
  ].filter(Boolean).length;

  return { query, update, reset, activeFilterCount };
}
