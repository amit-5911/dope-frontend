import { cn } from "@/lib/utils";
import type { Ninja } from "./types";
import type { ClassNameValue } from "tailwind-merge";

type status = Ninja["health"];

const config: Record<Lowercase<status>, ClassNameValue> = {
  healthy: "bg-emerald-100 text-emerald-800 border-emerald-200",
  injured: "bg-amber-100 text-amber-800 border-amber-200",
  critical: "bg-red-100 text-red-800 border-red-200",
};

export const HealthBadge = ({ status }: { status: status }) => {
  const color = config[status.toLowerCase() as keyof typeof config];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium border",
        color
      )}
    >
      {status}
    </span>
  );
};
