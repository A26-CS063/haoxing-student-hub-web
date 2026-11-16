import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STUDENT_STATUS_LABEL, type StudentStatus } from "@/types/student";

const STYLE: Record<StudentStatus, string> = {
  aktif: "border-transparent bg-primary text-primary-foreground",
  terdaftar: "border-transparent bg-accent text-accent-foreground",
  batal: "border-destructive/40 bg-transparent text-destructive",
};

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  return (
    <Badge variant="outline" className={cn(STYLE[status])}>
      {STUDENT_STATUS_LABEL[status]}
    </Badge>
  );
}
