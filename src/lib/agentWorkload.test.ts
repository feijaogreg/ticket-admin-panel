import { describe, expect, it } from "vitest";
import { agents, makeCases } from "@/test/fixtures";
import { countActiveTickets, rankAgentsForCategory } from "./agentWorkload";

describe("countActiveTickets", () => {
  it("counts only in-progress tickets per agent", () => {
    const counts = countActiveTickets(makeCases());

    expect(counts.get("a-bruno")).toBe(2);
    // Omar's only ticket is closed, and open tickets have no agent.
    expect(counts.has("a-omar")).toBe(false);
    expect(counts.size).toBe(1);
  });
});

describe("rankAgentsForCategory", () => {
  it("keeps only agents of the category, least busy first", () => {
    const ranked = rankAgentsForCategory(agents, countActiveTickets(makeCases()), "billing");

    expect(ranked.map(({ agent, activeTickets }) => [agent.firstName, activeTickets])).toEqual([
      ["Ana", 0],
      ["Bruno", 2],
    ]);
  });

  it("breaks ties by name", () => {
    const twins = [
      { ...agents[0], id: "z", firstName: "Zoe" },
      { ...agents[0], id: "b", firstName: "Bea" },
    ];

    expect(rankAgentsForCategory(twins, new Map(), "billing").map((c) => c.agent.firstName)).toEqual([
      "Bea",
      "Zoe",
    ]);
  });

  it("returns an empty list when no agent covers the category", () => {
    expect(rankAgentsForCategory(agents.slice(0, 2), new Map(), "technical")).toEqual([]);
  });
});
