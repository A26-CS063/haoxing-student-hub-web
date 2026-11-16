/** Status pendaftaran sesuai data dummy. Samakan dengan kategori di PRD bagian 5.7. */
export const STUDENT_STATUSES = ["terdaftar", "aktif", "batal"] as const;
export type StudentStatus = (typeof STUDENT_STATUSES)[number];

export const STUDENT_STATUS_LABEL: Record<StudentStatus, string> = {
  terdaftar: "Terdaftar",
  aktif: "Aktif",
  batal: "Batal",
};

/** Jenis kelas di data dummy. "paket" perlu dikonfirmasi: mode belajar atau jenis program? */
export const STUDY_MODES = ["online", "offline", "paket"] as const;
export type StudyMode = (typeof STUDY_MODES)[number];

export const STUDY_MODE_LABEL: Record<StudyMode, string> = {
  online: "Online",
  offline: "Offline",
  paket: "Paket",
};

export interface Student {
  id: string;
  studentCode: string; // STD-0001
  fullName: string;
  phone: string; // selalu string, supaya angka 0 di depan tidak hilang
  program: string; // program dari transaksi terakhir
  mode: StudyMode;
  level: string | null; // recommended_level hasil pre-test
  status: StudentStatus;
  pretestScore: number | null;
  listeningScore: number | null;
  grammarScore: number | null;
  registeredAt: string; // YYYY-MM-DD
  archivedAt: string | null; // FR-14: terisi = diarsipkan
  updatedAt: string; // ISO datetime
}

export type StudentSortField =
  | "studentCode"
  | "fullName"
  | "program"
  | "level"
  | "status"
  | "registeredAt";

export interface StudentQuery {
  page: number; // mulai dari 1
  pageSize: number;
  search?: string;
  sortField?: StudentSortField;
  sortDir?: "asc" | "desc";
  status?: StudentStatus[];
  program?: string;
  mode?: StudyMode;
  level?: string;
  registeredFrom?: string; // YYYY-MM-DD
  registeredTo?: string; // YYYY-MM-DD
  includeArchived?: boolean;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Pilihan untuk dropdown filter, diambil dari data. */
export interface StudentFilterOptions {
  programs: string[];
  levels: string[];
}
