import { useMemo } from "react";
import { useSupportData } from "@/context/supportData";
import { TicketCard } from "./ticketCard";

interface TicketListProps {
  onSelectCase: (caseId: string) => void;
}

export function TicketList({ onSelectCase }: TicketListProps) {
  const { cases: tickets, agents, status, error } = useSupportData();

  const agentNames = useMemo(
    () => new Map(agents.map((agent) => [agent.id, `${agent.firstName} ${agent.lastName}`])),
    [agents],
  );

  if (status === "loading") {
    return null;
  }

  if (status === "error") {
    return (
      <div className="ticket-list-state">
        <p>Something went wrong.</p>
        {error && <p>{error}</p>}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="ticket-list-state">
        <p>No tickets found.</p>
      </div>
    );
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
