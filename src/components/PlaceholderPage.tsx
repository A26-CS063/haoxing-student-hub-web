import type { ReactNode } from "react";
import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

interface PlaceholderPageProps {
  title: string;
  description: string;
  /** Kebutuhan fungsional di PRD yang akan mengisi halaman ini, mis. "FR-10 sampai FR-16". */
  requirements: string;
  /** Tampilkan lencana "Hanya baca" untuk pemilik. */
  readOnlyForOwner?: boolean;
  children?: ReactNode;
}

export function PlaceholderPage({
  title,
  description,
  requirements,
  readOnlyForOwner = false,
  children,
}: PlaceholderPageProps) {
  const { role } = useAuth();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {readOnlyForOwner && role === "owner" && (
          <Badge variant="secondary">
            <Eye /> Hanya baca
          </Badge>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Halaman ini belum dibuat</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Akan diisi oleh kebutuhan {requirements} di PRD.
        </CardContent>
      </Card>
      {children}
    </div>
  );
}
