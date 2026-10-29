import { useMemo } from "react";
import { useSupportData } from "@/context/supportData";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CATEGORY_MAP } from "@/lib/badgeMaps";
import { getDashboardStats } from "@/lib/dashboardStats";
import { ErrorState, LoadingState } from "./dataState";

export function Dashboard() {
  const { cases, agents, status, error, reload } = useSupportData();
  const stats = useMemo(() => getDashboardStats(cases, agents), [cases, agents]);

  if (status === "loading") {
    return <LoadingState />;
  }

  if (status === "error") {
    return <ErrorState message={error} onRetry={reload} />;
  }

  const summary = [
    { label: "Unassigned tickets", value: stats.unassigned },
    { label: "High/Critical open", value: stats.urgentOpen },
    { label: "In progress", value: stats.inProgress },
    { label: "Closed", value: stats.closed },
  ];

  return (
    <div className="dashboard">
      <section aria-labelledby="dashboard-summary">
        <h2 id="dashboard-summary" className="sr-only">
          Summary
        </h2>
        <dl className="dashboard__stats">
          {summary.map(({ label, value }) => (
            <Card key={label} className="dashboard__stat">
              <dt className="dashboard__stat-label">{label}</dt>
              <dd className="dashboard__stat-value">{value}</dd>
            </Card>
          ))}
        </dl>
      </section>

      <div className="dashboard__panels">
        <section aria-labelledby="dashboard-categories" className="dashboard__panel">
          <h2 id="dashboard-categories" className="dashboard__heading">
            Open tickets by category
          </h2>
          <div className="table-container">
            <table className="table" aria-labelledby="dashboard-categories">
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col" className="table__cell--end">
                    Open tickets
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.openByCategory.map(({ category, count }) => (
                  <tr key={category}>
                    <td>
                      <Badge variant={CATEGORY_MAP[category].variant}>
                        {CATEGORY_MAP[category].label}
                      </Badge>
                    </td>
                    <td className="table__cell--end">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="dashboard-workload" className="dashboard__panel">
          <h2 id="dashboard-workload" className="dashboard__heading">
            Agents workload
          </h2>
          <div className="table-container">
            <table className="table" aria-labelledby="dashboard-workload">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Area</th>
                  <th scope="col" className="table__cell--end">
                    Active tickets
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.topAgents.length === 0 && (
                  <tr>
                    <td colSpan={3} className="table__empty">
                      No agents found.
                    </td>
                  </tr>
                )}
                {stats.topAgents.map(({ agent, activeTickets }) => (
                  <tr key={agent.id}>
                    <td>
                      {agent.firstName} {agent.lastName}
                    </td>
                    <td>
                      <Badge variant={CATEGORY_MAP[agent.specialty].variant}>
                        {CATEGORY_MAP[agent.specialty].label}
                      </Badge>
                    </td>
                    <td className="table__cell--end">{activeTickets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
