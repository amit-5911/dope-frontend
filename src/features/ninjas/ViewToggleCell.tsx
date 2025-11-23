import type { Row } from "@tanstack/react-table";
import type { Ninja } from "./types";
import { Checkbox } from "@/components/ui/checkbox";

export const ViewToggleCell = ({ row }: { row: Row<Ninja> }) => {
  const isViewed = row.getIsSelected();

  return (
    <Checkbox
      checked={isViewed}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label={isViewed ? "mark as unviewed" : "mark as viewed"}
      className="w-5 h-5"
    />
  );
};
