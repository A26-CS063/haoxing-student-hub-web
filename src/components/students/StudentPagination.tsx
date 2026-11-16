import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { PAGE_SIZES } from "@/hooks/useStudentQueryParams";
import { formatNumber } from "@/lib/format";

interface StudentPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function StudentPagination({
  page,
  pageSize,
  total,
  totalPages,
  disabled,
  onPageChange,
  onPageSizeChange,
}: StudentPaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground" aria-live="polite">
        Menampilkan {formatNumber(from)}–{formatNumber(to)} dari {formatNumber(total)} siswa
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-muted-foreground">
          Baris
          <NativeSelect
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 w-20"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </NativeSelect>
        </label>

        <span className="tabular-nums">
          Halaman {page} dari {totalPages}
        </span>

        <nav className="flex items-center gap-1" aria-label="Navigasi halaman">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Halaman pertama"
            disabled={disabled || page <= 1}
            onClick={() => onPageChange(1)}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Halaman sebelumnya"
            disabled={disabled || page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Halaman berikutnya"
            disabled={disabled || page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Halaman terakhir"
            disabled={disabled || page >= totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            <ChevronsRight />
          </Button>
        </nav>
      </div>
    </div>
  );
}
