import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/classNames";
import { sortRows, toggleSort } from "@/lib/sortRows";
import type { SortState, SortValue } from "@/lib/sortRows";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Columns without a sort value are not sortable. */
  sortValue?: (row: T) => SortValue;
  align?: "start" | "end";
  /** Keeps the header for screen readers but hides it visually. */
  hideHeader?: boolean;
}

interface SortableTableProps<T> {
  label: string;
  rows: readonly T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export function SortableTable<T>({
  label,
  rows,
  columns,
  getRowKey,
  onRowClick,
}: SortableTableProps<T>) {
  const [sort, setSort] = useState<SortState | null>(null);

  const sortedRows = useMemo(() => {
    const getValue = columns.find((column) => column.key === sort?.key)?.sortValue;
    return sort && getValue ? sortRows(rows, getValue, sort.direction) : rows;
  }, [rows, columns, sort]);

  return (
    <div className="table-container">
      <table className="table" aria-label={label}>
        <thead>
          <tr>
            {columns.map((column) => {
              const direction = sort?.key === column.key ? sort.direction : undefined;
              const SortIcon =
                direction === "asc" ? ArrowUp : direction === "desc" ? ArrowDown : ArrowUpDown;

              return (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(column.align === "end" && "table__cell--end")}
                  aria-sort={
                    direction ? (direction === "asc" ? "ascending" : "descending") : undefined
                  }
                >
                  {column.hideHeader ? (
                    <span className="sr-only">{column.header}</span>
                  ) : column.sortValue ? (
                    <button
                      type="button"
                      className="table__sort"
                      onClick={() => setSort((current) => toggleSort(current, column.key))}
                    >
                      {column.header}
                      <SortIcon
                        size={14}
                        aria-hidden="true"
                        className={cn(!direction && "table__sort-icon--idle")}
                      />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr
              key={getRowKey(row)}
              className={cn(onRowClick && "table__row--clickable")}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <td key={column.key} className={cn(column.align === "end" && "table__cell--end")}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
