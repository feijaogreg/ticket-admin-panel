import { useSupportData } from "@/context/supportData";
import { EmptyState, ErrorState, LoadingState } from "./dataState";
import { AgentCard } from "./agentCard";

export function AgentList() {
  const { agents, status, error, reload } = useSupportData();

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
    <div className="agent-list">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
