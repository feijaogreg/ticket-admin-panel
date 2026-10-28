import { describe, expect, it } from "vitest";
import { agents, makeCases } from "@/test/fixtures";
import { matchesAgent, matchesQuery, matchesTicket } from "./search";

describe("matchesQuery", () => {
  const fields = ["Refund not received", "José waited two weeks"];

  it("matches everything for an empty or blank query", () => {
    expect(matchesQuery(fields, "")).toBe(true);
    expect(matchesQuery(fields, "   ")).toBe(true);
  });

  it("ignores case and accents", () => {
    expect(matchesQuery(fields, "REFUND")).toBe(true);
    expect(matchesQuery(fields, "jose")).toBe(true);
  });

  it("requires every term, but each term may come from any field", () => {
    expect(matchesQuery(fields, "refund jose")).toBe(true);
    expect(matchesQuery(fields, "refund missing")).toBe(false);
  });
});

describe("matchesTicket / matchesAgent", () => {
  it("searches ticket subject and description, not other fields", () => {
    const [refund, , , apiTicket] = makeCases();

    expect(matchesTicket(refund, "refund")).toBe(true);
    expect(matchesTicket(apiTicket, "webhook")).toBe(true);
    expect(matchesTicket(refund, "TKT-00001")).toBe(false);
  });

  it("searches agent full name and email", () => {
    const ana = agents[0];

    expect(matchesAgent(ana, "ana billing")).toBe(true);
    expect(matchesAgent(ana, "ana@supporthub")).toBe(true);
    expect(matchesAgent(ana, "tara")).toBe(false);
  });
});
