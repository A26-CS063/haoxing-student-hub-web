import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
      <ShieldAlert className="size-10 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-xl font-semibold">Anda tidak punya akses ke halaman ini</h1>
      <p className="text-sm text-muted-foreground">
        Halaman ini hanya tersedia untuk peran lain. Jika Anda merasa ini keliru, hubungi pemilik lembaga.
      </p>
      <Button asChild>
        <Link to="/">Kembali ke beranda</Link>
      </Button>
    </div>
  );
}
