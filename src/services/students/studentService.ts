import type {
  Paginated,
  Student,
  StudentFilterOptions,
  StudentQuery,
} from "@/types/student";

import { apiStudentService } from "./apiStudentService";
import { mockStudentService } from "./mockStudentService";

/** Kontrak yang sama untuk versi mock dan versi API. Halaman hanya memakai ini. */
export interface StudentService {
  list(query: StudentQuery, signal?: AbortSignal): Promise<Paginated<Student>>;
  filterOptions(): Promise<StudentFilterOptions>;
}

export const DATA_MODE: "mock" | "api" =
  import.meta.env.VITE_DATA_MODE === "api" ? "api" : "mock";

export const studentService: StudentService =
  DATA_MODE === "api" ? apiStudentService : mockStudentService;
