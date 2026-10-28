import type { SupportAgent, SupportCase } from "@/types/supportCase";

/** Lowercases and strips accents, so "jose" matches "José". */
function normalize(text: string): string {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

/**
 * True when every whitespace-separated term in `query` appears in at least one of
 * `fields`. An empty query matches everything.
 */
export function matchesQuery(fields: readonly string[], query: string): boolean {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = fields.map(normalize);
  return terms.every((term) => haystack.some((field) => field.includes(term)));
}

export function matchesTicket(ticket: SupportCase, query: string): boolean {
  return matchesQuery([ticket.subject, ticket.description], query);
}

export function matchesAgent(agent: SupportAgent, query: string): boolean {
  return matchesQuery([`${agent.firstName} ${agent.lastName}`, agent.email], query);
}
