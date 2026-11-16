import { RotateCw, SearchX, TriangleAlert } from "lucide-react";

import { StudentPagination } from "@/components/students/StudentPagination";
import { StudentTable } from "@/components/students/StudentTable";
import { StudentToolbar } from "@/components/students/StudentToolbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useStudentQueryParams } from "@/hooks/useStudentQueryParams";
import { useStudentFilterOptions, useStudents } from "@/hooks/useStudents";
import { DATA_MODE } from "@/services/students/studentService";

/** FR-11 (daftar, pagination, sortir, filter) + FR-12 (pencarian) */
export default function StudentsPage() {
  const { query, update, reset, activeFilterCount } = useStudentQueryParams();
  const { data, loading, error, durationMs, reload } = useStudents(query);
  const options = useStudentFilterOptions();

  const rows = data?.items ?? [];
  const isEmpty = !loading && !error && data?.total === 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Data siswa</h1>
        <p className="text-sm text-muted-foreground">
          Cari, saring, dan urutkan data siswa Haoxing Mandarin Center.
        </p>
      </div>

      <StudentToolbar
        query={query}
        options={options}
        activeFilterCount={activeFilterCount}
        onChange={update}
        onReset={reset}
      />

      {error && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>Data siswa gagal dimuat</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            {error}
            <Button size="sm" variant="outline" onClick={reload}>
              <RotateCw /> Muat ulang
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isEmpty ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-card px-6 py-14 text-center">
          <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="font-medium">Tidak ada siswa yang cocok</p>
            <p className="text-sm text-muted-foreground">Ubah kata kunci atau hapus filter untuk melihat semua siswa.</p>
          </div>
          {activeFilterCount > 0 && (
            <Button variant="outline" size="sm" onClick={reset}>
              Hapus filter
            </Button>
          )}
        </div>
      ) : (
        <>
          <StudentTable
            rows={rows}
            query={query}
            loading={loading}
            onSort={(sortField, sortDir) => update({ sortField, sortDir })}
          />

          {data && (
            <StudentPagination
              page={data.page}
              pageSize={data.pageSize}
              total={data.total}
              totalPages={data.totalPages}
              disabled={loading}
              onPageChange={(page) => update({ page })}
              onPageSizeChange={(pageSize) => update({ pageSize })}
            />
          )}
        </>
      )}

      {import.meta.env.DEV && durationMs !== null && (
        <p className="text-xs text-muted-foreground">
          Mode data {DATA_MODE}, respons terakhir {durationMs} ms
        </p>
      )}
    </div>
  );
}
