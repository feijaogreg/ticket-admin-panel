import { describe, expect, it } from "vitest";
import { sortRows, toggleSort } from "./sortRows";

describe("sortRows", () => {
  it("sorts numbers in both directions without mutating the input", () => {
    const rows = [{ n: 2 }, { n: 3 }, { n: 1 }];

    expect(sortRows(rows, (r) => r.n, "asc").map((r) => r.n)).toEqual([1, 2, 3]);
    expect(sortRows(rows, (r) => r.n, "desc").map((r) => r.n)).toEqual([3, 2, 1]);
    expect(rows.map((r) => r.n)).toEqual([2, 3, 1]);
  });

  it("compares strings case-insensitively and numerically", () => {
    const ids = ["TKT-10", "tkt-2", "TKT-1"].map((id) => ({ id }));

    expect(sortRows(ids, (r) => r.id, "asc").map((r) => r.id)).toEqual(["TKT-1", "tkt-2", "TKT-10"]);
  });

  it("sorts dates chronologically", () => {
    const rows = [{ d: new Date("2026-03-01") }, { d: new Date("2025-12-31") }];

    expect(sortRows(rows, (r) => r.d, "asc").map((r) => r.d.getFullYear())).toEqual([2025, 2026]);
  });

  it("keeps empty values last in either direction", () => {
    const rows = [{ v: null }, { v: "b" }, { v: undefined }, { v: "a" }];

    expect(sortRows(rows, (r) => r.v, "asc").map((r) => r.v ?? "-")).toEqual(["a", "b", "-", "-"]);
    expect(sortRows(rows, (r) => r.v, "desc").map((r) => r.v ?? "-")).toEqual(["b", "a", "-", "-"]);
  });
});

describe("toggleSort", () => {
  it("starts ascending, flips on the same column, and resets on a new one", () => {
    const first = toggleSort(null, "priority");
    expect(first).toEqual({ key: "priority", direction: "asc" });
    expect(toggleSort(first, "priority")).toEqual({ key: "priority", direction: "desc" });
    expect(toggleSort({ key: "priority", direction: "desc" }, "id")).toEqual({ key: "id", direction: "asc" });
  });
});
