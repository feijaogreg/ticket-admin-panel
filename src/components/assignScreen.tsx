import { useMemo, useState } from "react";
import type { SupportAgent, SupportCase } from "@/types/supportCase";
import { useSupportData } from "@/context/supportData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { CATEGORY_MAP, PRIORITY_MAP, STATUS_MAP } from "@/lib/badgeMaps";
import { countActiveTickets, rankAgentsForCategory } from "@/lib/agentWorkload";
import { formatDateTime } from "@/lib/formatDate";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { cn } from "@/lib/classNames";

interface AssignScreenProps {
  supportCase: SupportCase;
}

function fullName(agent: SupportAgent) {
  return `${agent.firstName} ${agent.lastName}`;
}

export function AssignScreen({ supportCase }: AssignScreenProps) {
  const { agents, cases, assignAgent } = useSupportData();
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const { id, subject, priority, category, status, agentId, description, customer, deadline } =
    supportCase;
  const priorityInfo = PRIORITY_MAP[priority];
  const categoryInfo = CATEGORY_MAP[category];
  const statusInfo = STATUS_MAP[status];
  const assignedAgent = agents.find((agent) => agent.id === agentId);
  const isOverdue = status !== "closed" && deadline.getTime() < Date.now();

  const candidates = useMemo(
    () => rankAgentsForCategory(agents, countActiveTickets(cases), category),
    [agents, cases, category],
  );

  async function handleAssign() {
    if (isAssigning) return;

    setError("");
    setSuccess("");
    setIsAssigning(true);

    try {
      await assignAgent(id, selectedAgentId);
      const agent = agents.find((a) => a.id === selectedAgentId);
      setSuccess(agent ? `Assigned to ${fullName(agent)}.` : "Agent assigned.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsAssigning(false);
    }
  }

  return (
    <div className="assign-screen">
      <Card padding="md" className="assign-screen__case">
        <div className="assign-screen__header">
          <span className="ticket-card__id">{id}</span>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
        <h2 className="assign-screen__subject">{subject}</h2>

        <dl className="assign-screen__details">
          <div>
            <dt>Priority</dt>
            <dd>
              <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
            </dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>
              <Badge variant={categoryInfo.variant}>{categoryInfo.label}</Badge>
            </dd>
          </div>
          <div>
            <dt>Customer</dt>
            <dd>{customer}</dd>
          </div>
          <div>
            <dt>Deadline</dt>
            <dd className={cn(isOverdue && "assign-screen__overdue")}>
              {formatDateTime(deadline)} ({isOverdue && "overdue, "}
              {formatRelativeTime(deadline)})
            </dd>
          </div>
        </dl>

        <h3 className="assign-screen__section-title">Description</h3>
        <p className="assign-screen__description">{description}</p>
      </Card>

      {status === "open" ? (
        <Card padding="md" className="assign-screen__form">
          <fieldset className="assign-screen__fieldset" aria-describedby="agent-hint">
            <legend className="assign-screen__legend">Choose an agent</legend>
            <p id="agent-hint" className="assign-screen__hint">
              Only {categoryInfo.label} agents can take {categoryInfo.label.toLowerCase()} tickets,
              so other areas aren't listed. Least busy first.
            </p>

            {candidates.length === 0 ? (
              <p className="assign-screen__hint">No {categoryInfo.label} agents available.</p>
            ) : (
              <div className="agent-options">
                {candidates.map(({ agent, activeTickets }) => (
                  <label key={agent.id} className="agent-option">
                    <input
                      type="radio"
                      name="agent"
                      value={agent.id}
                      checked={selectedAgentId === agent.id}
                      onChange={() => setSelectedAgentId(agent.id)}
                      disabled={isAssigning}
                    />
                    <span className="agent-option__name">{fullName(agent)}</span>
                    <span className="agent-option__load">
                      {activeTickets} active {activeTickets === 1 ? "ticket" : "tickets"}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <Button
            variant="primary"
            onClick={handleAssign}
            disabled={!selectedAgentId || isAssigning}
          >
            {isAssigning ? (
              <>
                <Spinner size="sm" />
                Assigning…
              </>
            ) : (
              "Assign"
            )}
          </Button>

          {error && (
            <p className="assign-screen__error" role="alert">
              {error}
            </p>
          )}
        </Card>
      ) : (
        <Card padding="md" className="assign-screen__form">
          {success ? (
            <p className="assign-screen__success">{success}</p>
          ) : (
            <p className="assign-screen__assigned">
              {status === "closed" && "This ticket is closed. "}
              {assignedAgent ? (
                <>
                  {status === "closed" ? "It was handled by " : "Assigned to "}
                  <strong>{fullName(assignedAgent)}</strong>.
                </>
              ) : (
                "No agent is assigned."
              )}
            </p>
          )}
        </Card>
      )}

      {/* Always mounted so screen readers announce the success message when it appears. */}
      <p className="sr-only" role="status">
        {success}
      </p>
    </div>
  );
}
