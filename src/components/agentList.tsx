import { useMemo, useState } from "react";
import type { SupportAgent } from "@/types/supportCase";
import { useSupportData } from "@/context/supportData";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/searchInput";
import { SortableTable } from "@/components/ui/sortableTable";
import type { Column } from "@/components/ui/sortableTable";
import { CATEGORY_MAP } from "@/lib/badgeMaps";
import { matchesAgent } from "@/lib/search";
import { EmptyState, ErrorState, LoadingState } from "./dataState";

export function AgentList() {
  const { agents, cases, status, error, reload } = useSupportData();
  const [query, setQuery] = useState("");

  const filteredAgents = useMemo(
    () => agents.filter((agent) => matchesAgent(agent, query)),
    [agents, query],
  );

  const activeTicketCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const ticket of cases) {
      if (ticket.status === "in-progress" && ticket.agentId) {
        counts.set(ticket.agentId, (counts.get(ticket.agentId) ?? 0) + 1);
      }
    }
    return counts;
  }, [cases]);

  const columns = useMemo<Column<SupportAgent>[]>(() => {
    const getActiveCount = (agent: SupportAgent) => activeTicketCounts.get(agent.id) ?? 0;

    return [
      {
        key: "name",
        header: "Name",
        cell: (agent) => `${agent.firstName} ${agent.lastName}`,
        sortValue: (agent) => `${agent.firstName} ${agent.lastName}`,
      },
      {
        key: "email",
        header: "Email",
        cell: (agent) => agent.email,
        sortValue: (agent) => agent.email,
      },
      {
        key: "area",
        header: "Area",
        cell: (agent) => (
          <Badge variant={CATEGORY_MAP[agent.specialty].variant}>
            {CATEGORY_MAP[agent.specialty].label}
          </Badge>
        ),
        sortValue: (agent) => CATEGORY_MAP[agent.specialty].label,
      },
      {
        key: "activeTickets",
        header: "Active tickets",
        align: "end",
        cell: getActiveCount,
        sortValue: getActiveCount,
      },
    ];
  }, [activeTicketCounts]);

  if (status === "loading") {
    return <LoadingState />;
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={reload} />;
  }

  if (agents.length === 0) {
    return <EmptyState message="No agents found." />;
  }

  return (
    <>
      <SearchInput
        label="Search agents"
        placeholder="Name or email"
        value={query}
        onChange={setQuery}
        resultSummary={`${filteredAgents.length} of ${agents.length} agents`}
      />
      <SortableTable
        label="Agents"
        rows={filteredAgents}
        columns={columns}
        getRowKey={(agent) => agent.id}
        emptyMessage="No results. Try a different search."
      />
    </>
  );
}
