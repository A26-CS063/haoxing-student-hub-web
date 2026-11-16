import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { StudentStatusBadge } from "@/components/students/StudentStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatPhone } from "@/lib/format";
import { cn } from "@/lib/utils";
import { STUDY_MODE_LABEL, type Student, type StudentQuery, type StudentSortField } from "@/types/student";

interface Column {
  label: string;
  sortField?: StudentSortField;
  className?: string;
}

const COLUMNS: Column[] = [
  { label: "Kode", sortField: "studentCode" },
  { label: "Nama", sortField: "fullName" },
  { label: "Kontak" },
  { label: "Program", sortField: "program" },
  { label: "Level", sortField: "level" },
  { label: "Pre-test", className: "text-right" },
  { label: "Status", sortField: "status" },
  { label: "Tgl daftar", sortField: "registeredAt" },
];

interface StudentTableProps {
  rows: Student[];
  query: StudentQuery;
  loading: boolean;
  onSort: (field: StudentSortField, dir: "asc" | "desc") => void;
}

export function StudentTable({ rows, query, loading, onSort }: StudentTableProps) {
  function headerFor(col: Column) {
    if (!col.sortField) return <TableHead key={col.label} className={col.className}>{col.label}</TableHead>;

    const active = query.sortField === col.sortField;
    const dir = active ? query.sortDir : undefined;
    const Icon = !active ? ArrowUpDown : dir === "desc" ? ArrowDown : ArrowUp;
    const field = col.sortField;

    return (
      <TableHead
        key={col.label}
        className={col.className}
        aria-sort={active ? (dir === "desc" ? "descending" : "ascending") : "none"}
      >
        <button
          type="button"
          onClick={() => onSort(field, active && dir === "asc" ? "desc" : "asc")}
          className="-ml-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {col.label}
          <Icon className={cn("size-3.5", !active && "text-muted-foreground")} aria-hidden="true" />
        </button>
      </TableHead>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table aria-busy={loading} className={cn("transition-opacity", loading && rows.length > 0 && "opacity-60")}>
        <TableHeader>
          <TableRow className="hover:bg-transparent">{COLUMNS.map(headerFor)}</TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && loading
            ? Array.from({ length: 8 }, (_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {COLUMNS.map((c) => (
                    <TableCell key={c.label}>
                      <div className="h-4 w-full max-w-28 animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : rows.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{s.studentCode}</TableCell>
                  <TableCell className="font-medium">{s.fullName}</TableCell>
                  <TableCell className="tabular-nums">{formatPhone(s.phone)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{s.program}</span>
                      <span className="text-xs text-muted-foreground">{STUDY_MODE_LABEL[s.mode]}</span>
                    </div>
                  </TableCell>
                  <TableCell>{s.level ?? "–"}</TableCell>
                  <TableCell className="text-right tabular-nums">{s.pretestScore ?? "–"}</TableCell>
                  <TableCell>
                    <StudentStatusBadge status={s.status} />
                  </TableCell>
                  <TableCell className="tabular-nums">{formatDate(s.registeredAt)}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
