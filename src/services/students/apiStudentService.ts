import type { StudentService } from "./studentService";

/**
 * Kerangka untuk backend. Bentuk endpoint & parameter harus disepakati dengan FS-1
 * (kontrak API, PRD 13.6). Saat ini belum dipakai karena VITE_DATA_MODE=mock.
 */
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const apiStudentService: StudentService = {
  async list(query, signal) {
    const params = new URLSearchParams();
    params.set("page", String(query.page));
    params.set("pageSize", String(query.pageSize));
    if (query.search) params.set("search", query.search);
    if (query.sortField) params.set("sort", `${query.sortField}:${query.sortDir ?? "asc"}`);
    if (query.status?.length) params.set("status", query.status.join(","));
    if (query.program) params.set("program", query.program);
    if (query.mode) params.set("mode", query.mode);
    if (query.level) params.set("level", query.level);
    if (query.registeredFrom) params.set("registeredFrom", query.registeredFrom);
    if (query.registeredTo) params.set("registeredTo", query.registeredTo);
    if (query.includeArchived) params.set("includeArchived", "true");

    const res = await fetch(`${BASE_URL}/students?${params}`, {
      credentials: "include",
      signal,
    });
    if (!res.ok) throw new Error(`Gagal memuat data siswa (${res.status})`);
    return res.json();
  },

  async filterOptions() {
    const res = await fetch(`${BASE_URL}/students/filter-options`, { credentials: "include" });
    if (!res.ok) throw new Error(`Gagal memuat pilihan filter (${res.status})`);
    return res.json();
  },
};
