import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/** Select bawaan browser bergaya shadcn. Ringan & ramah HP; cukup untuk filter. */
function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative min-w-0">
      <select
        data-slot="native-select"
        className={cn(
          "peer h-9 w-full min-w-0 appearance-none rounded-md border border-input bg-card pl-3 pr-9 text-sm shadow-xs outline-none transition-[color,box-shadow]",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground peer-disabled:opacity-50"
      />
    </div>
  );
}

export { NativeSelect };