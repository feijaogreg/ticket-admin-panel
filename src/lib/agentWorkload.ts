import type { CaseCategory, SupportAgent, SupportCase } from "@/types/supportCase";

/** Number of in-progress cases per agent id. Agents with none are absent from the map. */
export function countActiveTickets(cases: readonly SupportCase[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const supportCase of cases) {
    if (supportCase.status === "in-progress" && supportCase.agentId) {
      counts.set(supportCase.agentId, (counts.get(supportCase.agentId) ?? 0) + 1);
    }
  }
  return counts;
}

export interface AgentCandidate {
  agent: SupportAgent;
  activeTickets: number;
}

/**
 * Agents who can take a case in `category` (the API only accepts a matching
 * specialty), least busy first, then by name.
 */
export function rankAgentsForCategory(
  agents: readonly SupportAgent[],
  activeCounts: ReadonlyMap<string, number>,
  category: CaseCategory,
): AgentCandidate[] {
  return agents
    .filter((agent) => agent.specialty === category)
    .map((agent) => ({ agent, activeTickets: activeCounts.get(agent.id) ?? 0 }))
    .sort(
      (a, b) =>
        a.activeTickets - b.activeTickets ||
        `${a.agent.firstName} ${a.agent.lastName}`.localeCompare(
          `${b.agent.firstName} ${b.agent.lastName}`,
        ),
    );
}
