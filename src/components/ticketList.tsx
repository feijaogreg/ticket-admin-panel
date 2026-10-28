import { useMemo } from "react";
import type { SupportCase } from "@/types/supportCase";
import { useSupportData } from "@/context/supportData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SortableTable } from "@/components/ui/sortableTable";
import type { Column } from "@/components/ui/sortableTable";
import { CATEGORY_MAP, PRIORITY_MAP, PRIORITY_RANK, STATUS_MAP, STATUS_RANK } from "@/lib/badgeMaps";
import { formatDate } from "@/lib/formatDate";
import { EmptyState, ErrorState, LoadingState } from "./dataState";

interface TicketListProps {
  onSelectCase: (caseId: string) => void;
}

export function TicketList({ onSelectCase }: TicketListProps) {
  const { cases: tickets, agents, status, error, reload } = useSupportData();

  const agentNames = useMemo(
    () => new Map(agents.map((agent) => [agent.id, `${agent.firstName} ${agent.lastName}`])),
    [agents],
  );

  const columns = useMemo<Column<SupportCase>[]>(() => {
    const getAgentName = (ticket: SupportCase) =>
      ticket.agentId ? agentNames.get(ticket.agentId) : undefined;

    return [
      {
        key: "id",
        header: "ID",
        cell: (ticket) => <span className="table__mono">{ticket.id}</span>,
        sortValue: (ticket) => ticket.id,
      },
      {
        key: "subject",
        header: "Subject",
        cell: (ticket) => ticket.subject,
        sortValue: (ticket) => ticket.subject,
      },
      {
        key: "customer",
        header: "Customer",
        cell: (ticket) => ticket.customer,
        sortValue: (ticket) => ticket.customer,
      },
      {
        key: "category",
        header: "Category",
        cell: (ticket) => (
          <Badge variant={CATEGORY_MAP[ticket.category].variant}>
            {CATEGORY_MAP[ticket.category].label}
          </Badge>
        ),
        sortValue: (ticket) => CATEGORY_MAP[ticket.category].label,
      },
      {
        key: "priority",
        header: "Priority",
        cell: (ticket) => (
          <Badge variant={PRIORITY_MAP[ticket.priority].variant}>
            {PRIORITY_MAP[ticket.priority].label}
          </Badge>
        ),
        // Severity, not alphabetical: ascending is low → critical.
        sortValue: (ticket) => PRIORITY_RANK[ticket.priority],
      },
      {
        key: "status",
        header: "Status",
        cell: (ticket) => (
          <Badge variant={STATUS_MAP[ticket.status].variant}>
            {STATUS_MAP[ticket.status].label}
          </Badge>
        ),
        sortValue: (ticket) => STATUS_RANK[ticket.status],
      },
      {
        key: "agent",
        header: "Agent",
        cell: (ticket) => getAgentName(ticket) ?? <span className="table__muted">Unassigned</span>,
        sortValue: getAgentName,
      },
      {
        key: "deadline",
        header: "Deadline",
        cell: (ticket) => <span className="table__nowrap">{formatDate(ticket.deadline)}</span>,
        sortValue: (ticket) => ticket.deadline,
      },
      {
        key: "actions",
        header: "Actions",
        hideHeader: true,
        align: "end",
        cell: (ticket) => (
          <Button
            variant="secondary"
            aria-label={`Assign ${ticket.id}`}
            onClick={(e) => {
              e.stopPropagation(); // the row's own click handler would fire too
              onSelectCase(ticket.id);
            }}
          >
            Assign
          </Button>
        ),
      },
    ];
  }, [agentNames, onSelectCase]);

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
    <SortableTable
      label="Tickets"
      rows={tickets}
      columns={columns}
      getRowKey={(ticket) => ticket.id}
      onRowClick={(ticket) => onSelectCase(ticket.id)}
    />
  );
}
