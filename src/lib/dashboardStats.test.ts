import { describe, expect, it } from "vitest";
import { agents, makeCases } from "@/test/fixtures";
import { getDashboardStats } from "./dashboardStats";

describe("getDashboardStats", () => {
  it("counts tickets by status, and urgent ones among open tickets only", () => {
    const stats = getDashboardStats(makeCases(), agents);

    expect(stats.unassigned).toBe(2);
    // TKT-00004 is open and high; the critical/high in-progress tickets don't count.
    expect(stats.urgentOpen).toBe(1);
    expect(stats.inProgress).toBe(2);
    expect(stats.closed).toBe(1);
  });

  it("lists every category of open tickets, including empty ones", () => {
    expect(getDashboardStats(makeCases(), agents).openByCategory).toEqual([
      { category: "billing", count: 1 },
      { category: "technical", count: 1 },
      { category: "account", count: 0 },
    ]);
  });

  it("ranks agents by active tickets, most loaded first, then by name, up to the limit", () => {
    const { topAgents } = getDashboardStats(makeCases(), agents, 3);

    expect(topAgents.map(({ agent, activeTickets }) => [agent.firstName, activeTickets])).toEqual([
      ["Bruno", 2],
      ["Ana", 0],
      ["Omar", 0],
    ]);
  });

  it("returns zeros for no data", () => {
    const stats = getDashboardStats([], []);

    expect([stats.unassigned, stats.urgentOpen, stats.inProgress, stats.closed]).toEqual([0, 0, 0, 0]);
    expect(stats.openByCategory.every(({ count }) => count === 0)).toBe(true);
    expect(stats.topAgents).toEqual([]);
  });
});
