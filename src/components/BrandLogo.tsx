import { cn } from "@/lib/utils";

/**
 * Memakai berkas pertama bernama "logo.*" di src/assets (logo.png, logo.svg, logo.webp, dst).
 * Jika tidak ada, tampil lambang huruf 好 sebagai pengganti sementara.
 *
 * onDark: dipakai di atas latar gelap (maroon). Logo diubah menjadi putih polos agar terlihat.
 * Hapus prop ini jika logomu memang sudah berwarna terang.
 */
const logos = import.meta.glob("/src/assets/logo.*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const logoSrc = Object.values(logos)[0];

export function BrandLogo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  if (logoSrc) {
    return (
      <img
        src={logoSrc}
        alt="Haoxing Mandarin Center"
        className={cn("w-auto", onDark && "brightness-0 invert", className)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex aspect-square items-center justify-center rounded-md font-heading text-2xl",
        onDark ? "bg-background text-primary" : "bg-primary text-primary-foreground",
        className,
      )}
    >
      好
    </span>
  );
}