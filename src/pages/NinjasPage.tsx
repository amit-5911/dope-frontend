import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
  getFacetedUniqueValues,
} from "@tanstack/react-table";

import {
  NinjasTable,
  SubmitNinjas,
  HealthBadge,
  HealthHeader,
  PowerHeader,
  ViewToggleCell,
  checkboxColumnId,
  type Ninja,
} from "@/features/ninjas";

import { DebouncedSearch } from "@/components/ui/debouncedSearch";
import { useState, useTransition } from "react";
import { useNinjasData } from "@/api/useNinjasData";

const columnhelper = createColumnHelper<Ninja>();

const columns: ColumnDef<Ninja>[] = [
  columnhelper.display({
    id: checkboxColumnId,
    cell: ({ row }) => <ViewToggleCell row={row} />,
    size: 50,
  }),
  {
    accessorKey: "name",
    header: "Name",
    size: 300,
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "health",
    header: ({ column }) => <HealthHeader column={column} />,
    cell: ({ row }) => <HealthBadge status={row.original.health} />,
    filterFn: (row, id, filterValues) => {
      if (!filterValues?.length) return true;
      return filterValues.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "power",
    header: ({ column }) => <PowerHeader column={column} />,
  },
];

export const NinjasPage = () => {
  const { data: ninjas, isLoading, error, refetch } = useNinjasData(1000);

  const [globalFilter, setGlobalFilter] = useState("");
  const [isPending, startTransition] = useTransition();

  const table = useReactTable({
    data: ninjas,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    globalFilterFn: (row, _columnId, filterValue) => {
      // Only search in name and location columns
      const name = row.getValue("name") as string;
      const location = row.getValue("location") as string;

      const searchValue = filterValue.toLowerCase();

      return (
        name?.toLowerCase().includes(searchValue) ||
        location?.toLowerCase().includes(searchValue)
      );
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setGlobalFilter(value);
    });
  };

  if (error) {
    return (
      <div className="max-w-[1200px] py-10 m-auto">
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <h3 className="text-red-800 font-semibold mb-2">
            Error loading ninjas
          </h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-[1200px] py-10 m-auto">
        <div className="h-[700px] rounded-md border flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mb-4" />
            <p className="text-gray-600">Loading ninjas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] py-10 flex flex-col m-auto h-dvh">
      <div className="flex items-center justify-between py-4">
        <DebouncedSearch
          onChange={handleSearchChange}
          placeholder="Search ninja by name or location..."
          aria-label="Search ninja by name or location"
          className="md:max-w-[30%]"
        />

        <SubmitNinjas table={table} />
      </div>
      {isPending && <p>Updating Table...</p>}
      <div className="flex-1 min-h-0 rounded-md border  overflow-clip">
        <NinjasTable table={table} />
      </div>
    </div>
  );
};
