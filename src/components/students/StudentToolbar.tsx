import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { cn } from "@/lib/utils";
import {
  STUDENT_STATUSES,
  STUDENT_STATUS_LABEL,
  STUDY_MODES,
  STUDY_MODE_LABEL,
  type StudentFilterOptions,
  type StudentQuery,
  type StudyMode,
} from "@/types/student";

interface StudentToolbarProps {
  query: StudentQuery;
  options: StudentFilterOptions;
  activeFilterCount: number;
  onChange: (patch: Partial<StudentQuery>) => void;
  onReset: () => void;
}

export function StudentToolbar({ query, options, activeFilterCount, onChange, onReset }: StudentToolbarProps) {
  // FR-12: kotak cari dengan jeda ketik 300 ms
  const [text, setText] = useState(query.search ?? "");
  const debounced = useDebouncedValue(text, 300);

  useEffect(() => {
    if ((debounced.trim() || undefined) !== (query.search || undefined)) onChange({ search: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Ikuti URL kalau berubah dari luar (mis. tombol "Hapus filter")
  useEffect(() => {
    if ((query.search ?? "") !== text.trim()) setText(query.search ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.search]);

  const toggleStatus = (status: (typeof STUDENT_STATUSES)[number]) => {
    const current = new Set(query.status ?? []);
    if (current.has(status)) current.delete(status);
    else current.add(status);
    onChange({ status: current.size ? [...current] : undefined });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cari nama, nomor kontak, atau kode siswa"
          aria-label="Cari siswa"
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter status">
        <span className="mr-1 text-sm text-muted-foreground">Status</span>
        {STUDENT_STATUSES.map((s) => {
          const active = query.status?.includes(s) ?? false;
          return (
            <Button
              key={s}
              type="button"
              size="sm"
              variant={active ? "default" : "outline"}
              aria-pressed={active}
              onClick={() => toggleStatus(s)}
              className="rounded-full"
            >
              {STUDENT_STATUS_LABEL[s]}
            </Button>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <Label htmlFor="f-program">Program</Label>
          <NativeSelect
            id="f-program"
            value={query.program ?? ""}
            onChange={(e) => onChange({ program: e.target.value || undefined })}
          >
            <option value="">Semua program</option>
            {options.programs.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="f-mode">Mode</Label>
          <NativeSelect
            id="f-mode"
            value={query.mode ?? ""}
            onChange={(e) => onChange({ mode: (e.target.value || undefined) as StudyMode | undefined })}
          >
            <option value="">Semua mode</option>
            {STUDY_MODES.map((m) => (
              <option key={m} value={m}>
                {STUDY_MODE_LABEL[m]}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <Label htmlFor="f-level">Level</Label>
          <NativeSelect
            id="f-level"
            value={query.level ?? ""}
            onChange={(e) => onChange({ level: e.target.value || undefined })}
          >
            <option value="">Semua level</option>
            {options.levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="f-from">Daftar dari</Label>
          <Input
            id="f-from"
            type="date"
            value={query.registeredFrom ?? ""}
            max={query.registeredTo}
            onChange={(e) => onChange({ registeredFrom: e.target.value || undefined })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="f-to">Sampai</Label>
          <Input
            id="f-to"
            type="date"
            value={query.registeredTo ?? ""}
            min={query.registeredFrom}
            onChange={(e) => onChange({ registeredTo: e.target.value || undefined })}
          />
        </div>

        <div className={cn("flex items-end", activeFilterCount === 0 && "invisible")}>
          <Button type="button" variant="ghost" onClick={onReset} className="text-muted-foreground">
            <X /> Hapus filter ({activeFilterCount})
          </Button>
        </div>
      </div>
    </div>
  );
}
