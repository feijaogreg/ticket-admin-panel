import { useState } from "react";
import { TopBar } from "./components/layout/topBar";
import { PageHeader } from "./components/layout/pageHeader";
import { Sidebar, type Screen } from "./components/layout/sidebar";
import { TicketList } from "./components/ticketList";
import { AgentList } from "./components/agentList";
import { AssignScreen } from "./components/assignScreen";
import { Dashboard } from "./components/dashboard";
import { useSupportData } from "./context/supportData";
import "./components/layout/appShell.css";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("dashboard");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const { cases } = useSupportData();

  // Derived on every render, so the assign screen always shows the latest case data.
  const selectedCase = cases.find((supportCase) => supportCase.id === selectedCaseId);

  function handleNavigate(screen: Screen) {
    setSelectedCaseId(null);
    setActiveScreen(screen);
  }

  const backToDashboard = { label: "Back to dashboard", onClick: () => handleNavigate("dashboard") };

  function renderMain() {
    if (activeScreen === "dashboard") {
      return (
        <>
          <PageHeader title="Dashboard" />
          <Dashboard />
        </>
      );
    }

    if (activeScreen === "tickets") {
      if (selectedCase) {
        return (
          <>
            <PageHeader
              title="Assign agent"
              back={{ label: "Back to tickets", onClick: () => setSelectedCaseId(null) }}
            />
            <AssignScreen supportCase={selectedCase} />
          </>
        );
      }
      return (
        <>
          <PageHeader title="Tickets" back={backToDashboard} />
          <TicketList onSelectCase={setSelectedCaseId} />
        </>
      );
    }

    if (activeScreen === "agents") {
      return (
        <>
          <PageHeader title="Agents" back={backToDashboard} />
          <AgentList />
        </>
      );
    }

    return null;
  }

  return (
    <div className="app-shell">
      <TopBar />
      <div className="app-shell__body">
        <Sidebar activeScreen={activeScreen} onNavigate={handleNavigate} />
        <main className="app-shell__main">{renderMain()}</main>
      </div>
    </div>
  );
}
