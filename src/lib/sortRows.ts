export type SortDirection = "asc" | "desc";

export type SortValue = string | number | Date | null | undefined;

export interface SortState {
  key: string;
  direction: SortDirection;
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

function normalize(value: SortValue): string | number | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isNaN(time) ? null : time;
  }
  if (typeof value === "number" && Number.isNaN(value)) return null;
  return value;
}

/**
 * Returns a new array sorted by `getValue`. Empty values (null, undefined, invalid
 * dates) always go last, regardless of direction. The sort is stable.
 */
export function sortRows<T>(
  rows: readonly T[],
  getValue: (row: T) => SortValue,
  direction: SortDirection,
): T[] {
  return rows
    .map((row) => ({ row, value: normalize(getValue(row)) }))
    .sort((a, b) => {
      if (a.value === null || b.value === null) {
        return a.value === b.value ? 0 : a.value === null ? 1 : -1;
      }
      const result =
        typeof a.value === "number" && typeof b.value === "number"
          ? a.value - b.value
          : collator.compare(String(a.value), String(b.value));
      return direction === "asc" ? result : -result;
    })
    .map(({ row }) => row);
}

/** Clicking the sorted column flips its direction; clicking another column sorts it ascending. */
export function toggleSort(current: SortState | null, key: string): SortState {
  if (current?.key === key) {
    return { key, direction: current.direction === "asc" ? "desc" : "asc" };
  }
  return { key, direction: "asc" };
}
