import logoColor from "@/assets/logo-haoxing-color.png";
import logoSquare from "@/assets/logo-haoxing-square.png";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "color" | "square"; // color = sidebar, square = login
  className?: string;
};

export function Logo({ variant = "color", className }: LogoProps) {
  const isSquare = variant === "square";

  return (
    <img
      src={isSquare ? logoSquare : logoColor}
      alt="Logo Haoxing Mandarin Center"
      className={cn(isSquare ? "h-20 w-20 object-contain" : "h-10 w-auto", className)}
    />
  );
}