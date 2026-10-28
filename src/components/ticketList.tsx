import { useMemo } from "react";
import { useSupportData } from "@/context/supportData";
import { EmptyState, ErrorState, LoadingState } from "./dataState";
import { TicketCard } from "./ticketCard";

interface TicketListProps {
  onSelectCase: (caseId: string) => void;
}

export function TicketList({ onSelectCase }: TicketListProps) {
  const { cases: tickets, agents, status, error, reload } = useSupportData();

  const agentNames = useMemo(
    () => new Map(agents.map((agent) => [agent.id, `${agent.firstName} ${agent.lastName}`])),
    [agents],
  );

  if (status === "loading") {
    return <LoadingState />;
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={reload} />;
  }

  if (tickets.length === 0) {
    return <EmptyState message="No tickets found." />;
  }

  return (
    <div className="ticket-list">
      {tickets.map((supportCase) => (
        <TicketCard
          key={supportCase.id}
          supportCase={supportCase}
          agentName={supportCase.agentId ? agentNames.get(supportCase.agentId) : undefined}
          onSelect={onSelectCase}
        />
      ))}
    </div>
  );
}
