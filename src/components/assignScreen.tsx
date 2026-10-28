import { useState } from "react";
import type { SupportCase } from "@/types/supportCase";
import { useSupportData } from "@/context/supportData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { CATEGORY_MAP, PRIORITY_MAP } from "@/lib/badgeMaps";

interface AssignScreenProps {
  supportCase: SupportCase;
}

export function AssignScreen({ supportCase }: AssignScreenProps) {
  const { agents, assignAgent } = useSupportData();
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const { id, subject, priority, category, status, agentId, description } = supportCase;
  const priorityInfo = PRIORITY_MAP[priority];
  const categoryInfo = CATEGORY_MAP[category];
  const assignedAgent = agents.find((agent) => agent.id === agentId);

  async function handleAssign() {
    if (isAssigning) return;

    setError("");
    setSuccess("");
    setIsAssigning(true);

    try {
      await assignAgent(id, selectedAgentId);
      setSuccess("Agent Assigned");
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
          <Badge variant={priorityInfo.variant}>{priorityInfo.label}</Badge>
        </div>
        <h2 className="assign-screen__subject">{subject}</h2>

        <div className="assign-screen__meta">
          <span>Category: <Badge variant={categoryInfo.variant}>{categoryInfo.label}</Badge></span>
          <span>Status: {status}</span>
          <span>
            Agent: {assignedAgent ? `${assignedAgent.firstName} ${assignedAgent.lastName}` : "Unassigned"}
          </span>
        </div>

        <p className="assign-screen__description">{description}</p>
      </Card>

      <Card padding="md" className="assign-screen__form">
        <label className="assign-screen__label" htmlFor="agent-select">
          Choose Agent
        </label>
        <select
          id="agent-select"
          className="assign-screen__select"
          value={selectedAgentId}
          onChange={(e) => setSelectedAgentId(e.target.value)}
        >
          <option value="">-- Select an agent --</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.firstName} {agent.lastName}
            </option>
          ))}
        </select>

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

        {error && <p className="assign-screen__error">{error}</p>}
        {success && <p className="assign-screen__success">{success}</p>}
      </Card>
    </div>
  );
}
