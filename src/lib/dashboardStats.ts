import type { CaseCategory, SupportAgent, SupportCase } from "@/types/supportCase";
import { CATEGORY_MAP } from "@/lib/badgeMaps";
import { countActiveTickets } from "@/lib/agentWorkload";
import type { AgentCandidate } from "@/lib/agentWorkload";

export interface DashboardStats {
  /** Open tickets waiting for an agent. */
  unassigned: number;
  /** Open tickets with high or critical priority. */
  urgentOpen: number;
  inProgress: number;
  closed: number;
  /** Open tickets per category, in the same order as CATEGORY_MAP. Categories with none show 0. */
  openByCategory: { category: CaseCategory; count: number }[];
  /** Agents with the most in-progress tickets, most loaded first, then by name. */
  topAgents: AgentCandidate[];
}

export function getDashboardStats(
  cases: readonly SupportCase[],
  agents: readonly SupportAgent[],
  topAgentLimit = 5,
): DashboardStats {
  const openByCategory = new Map<CaseCategory, number>();
  let unassigned = 0;
  let urgentOpen = 0;
  let inProgress = 0;
  let closed = 0;

  for (const supportCase of cases) {
    if (supportCase.status === "open") {
      if (!supportCase.agentId) unassigned++;
      if (supportCase.priority === "high" || supportCase.priority === "critical") urgentOpen++;
      openByCategory.set(supportCase.category, (openByCategory.get(supportCase.category) ?? 0) + 1);
    } else if (supportCase.status === "in-progress") {
      inProgress++;
    } else {
      closed++;
    }
  }

  const activeCounts = countActiveTickets(cases);
  const topAgents = agents
    .map((agent) => ({ agent, activeTickets: activeCounts.get(agent.id) ?? 0 }))
    .sort(
      (a, b) =>
        b.activeTickets - a.activeTickets ||
        `${a.agent.firstName} ${a.agent.lastName}`.localeCompare(
          `${b.agent.firstName} ${b.agent.lastName}`,
        ),
    )
    .slice(0, topAgentLimit);

  return {
    unassigned,
    urgentOpen,
    inProgress,
    closed,
    openByCategory: (Object.keys(CATEGORY_MAP) as CaseCategory[]).map((category) => ({
      category,
      count: openByCategory.get(category) ?? 0,
    })),
    topAgents,
  };
}
