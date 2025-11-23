import {
  flexRender,
  type Cell,
  type Table as ITable,
  type Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Ninja } from "./types";
import { memo } from "react";
import { checkboxColumnId } from "./constants";

export function NinjasTable({ table }: { table: ITable<Ninja> }) {
  console.log("ninjas Table");
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  style={{
                    width: header.column.getSize(),
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            return (
              <DataRow
                row={row}
                key={row.id}
                isSelected={row.getIsSelected()}
              />
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getAllLeafColumns().length}
              className="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

// since row/cell has stable refrence in tanstack table, using isSelected to re-render on checbox state change
const DataRow = memo(
  ({ row, isSelected }: { row: Row<any>; isSelected: boolean }) => {
    return (
      <TableRow key={row.id} data-state={isSelected && "selected"}>
        {row.getVisibleCells().map((cell) => (
          <DataCell cell={cell} key={cell.id} isSelected={isSelected} />
        ))}
      </TableRow>
    );
  },
  (prev, next) => {
    return prev.isSelected === next.isSelected;
  }
);

const DataCell = memo(
  ({ cell }: { cell: Cell<any, unknown>; isSelected: boolean }) => {
    return (
      <TableCell
        style={{
          width: cell.column.getSize(),
        }}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    );
  },
  (prev, next) => {
    const isSelectColumn = prev.cell.column.id === checkboxColumnId;

    if (isSelectColumn) {
      return prev.isSelected === next.isSelected;
    }
    return prev.cell.getValue() === next.cell.getValue();
  }
);
