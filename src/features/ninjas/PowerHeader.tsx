import type { Column, SortDirection } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, type LucideIcon } from "lucide-react";
import type { Ninja } from "./types";
import { Button } from "@/components/ui/button";

export const PowerHeader = ({ column }: { column: Column<Ninja, unknown> }) => {
  const sorted = column.getIsSorted();

  const icons: Record<SortDirection | "default", LucideIcon> = {
    asc: ArrowUp,
    desc: ArrowDown,
    default: ArrowUpDown,
  };

  const airaLabels: Record<SortDirection | "default", string> = {
    asc: "Sorted by power in ascending order. Activate to clear sorting.",
    desc: "Sorted by power in descending order. Activate to sort descending.",
    default: "Not sorted by power. Activate to sort ascending.",
  };

  const Icon = icons[sorted || "default"];
  const ariaLabel = airaLabels[sorted || "default"];
  return (
    <Button
      variant="ghost"
      onClick={column.getToggleSortingHandler()}
      className="text-left w-full justify-start -ml-3"
      aria-label={ariaLabel}
    >
      Power
      <Icon aria-hidden="true" />
    </Button>
  );
};
