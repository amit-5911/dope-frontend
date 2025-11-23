import type { Column } from "@tanstack/react-table";
import type { Ninja } from "./types";
import { useDebouncedCallback } from "use-debounce";
import { memo, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Funnel } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export const HealthHeader = memo(
  ({ column }: { column: Column<Ninja, unknown> }) => {
    const facetedValues = column.getFacetedUniqueValues();
    const uniqueValues = [...facetedValues.keys()];
    const debounced = useDebouncedCallback(column.setFilterValue, 0);

    const [selected, setSelected] = useState(
      () => (column.getFilterValue() as string[]) ?? []
    );

    const toggleValue = (value: string) => {
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];

      setSelected(next);

      // deffer setting to column so that checkbox's checked state feedback is instant
      debounced(next);
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="w-full group text-left -ml-3 justify-start"
              aria-label={
                selected.length > 0
                  ? `Health filter, ${selected.length} selected`
                  : "Health filter, no selection applied"
              }
            >
              Health
              <Funnel
                aria-hidden="true"
                fill={
                  selected.length > 0 ? "var(--primary)" : "var(--background)"
                }
              />
              <span
                className={cn(
                  "bg-primary text-xs inline-block shrink-0 text-primary-foreground p-0.5 px-1.5 rounded-sm",
                  selected.length == 0 ? "invisible" : "visible"
                )}
                aria-hidden="true"
              >
                {selected.length}
              </span>
              <ChevronDown
                className={cn(
                  "invisible group-hover:visible group transition-transform duration-200",
                  "group-data-popup-open:rotate-180 group-data-popup-open:visible"
                )}
              />
            </Button>
          }
        />
        <DropdownMenuContent className="p-2 w-48">
          {uniqueValues.map((value) => (
            <DropdownMenuItem
              key={value}
              className="flex items-center gap-2 py-1 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                toggleValue(value);
              }}
              aria-label={
                selected.includes(value)
                  ? `${value} filter is active, space to remove`
                  : `Apply filter for ${value}`
              }
            >
              <Checkbox checked={selected.includes(value)} />
              <span className="flex-1">{value}</span>
              <span className=" text-sm">{facetedValues.get(value)}</span>
            </DropdownMenuItem>
          ))}

          {uniqueValues.length === 0 && (
            <div className="text-sm text-muted-foreground px-2">No values</div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

HealthHeader.displayName = "HealthHeader";
