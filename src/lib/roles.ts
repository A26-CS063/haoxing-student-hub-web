import type { Role } from "@/types/auth";

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  owner: "Pemilik",
};

export const ROLE_DESCRIPTION: Record<Role, string> = {
  admin:
    "Dapat menambah, mengubah, dan mengarsipkan data siswa, serta mengelola dokumen dan aturan tindak lanjut.",
  owner:
    "Dapat melihat data siswa, rekap, dan tindak lanjut. Tidak dapat mengubah data.",
};
