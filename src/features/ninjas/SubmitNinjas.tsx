import { useDeferredValue, useMemo } from "react";
import { type Table as ITable } from "@tanstack/react-table";
import type { Ninja } from "./types";
import { Button } from "@/components/ui/button";

export function SubmitNinjas({ table }: { table: ITable<Ninja> }) {
  const rowSelection = table.getState().rowSelection;
  const filtering = table.getState().columnFilters;

  // getting visible selected rows is lower priority task
  // visible: rows which are present in DOM after filtering/searching
  const rows = useDeferredValue(table.getFilteredRowModel().rows);

  const selectedRows = useMemo(() => {
    // optimize if the rows selection is empty
    if (Object.keys(rowSelection).length === 0) return [];

    return rows.filter((row) => row.getIsSelected()).map((row) => row.original);
  }, [rows, rowSelection, filtering]);

  const handleSubmit = () => {
    console.log("selected rows", selectedRows);
  };

  const selectedCount = selectedRows.length;
  const hasSelection = selectedCount > 0;

  return (
    <Button
      variant="default"
      className="ml-auto"
      onClick={handleSubmit}
      disabled={!hasSelection}
    >
      Submit {hasSelection && `${selectedCount} rows`}
    </Button>
  );
}
