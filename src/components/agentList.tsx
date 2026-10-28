import { useSupportData } from "@/context/supportData";
import { AgentCard } from "./agentCard";

export function AgentList() {
  const { agents, status, error } = useSupportData();

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

  if (agents.length === 0) {
    return (
      <div className="ticket-list-state">
        <p>No agents found.</p>
      </div>
    );
  }

  return (
    <div className="agent-list">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
