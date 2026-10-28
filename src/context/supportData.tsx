import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { SupportAgent, SupportCase } from "@/types/supportCase";
import * as api from "@/data/mockApi";

interface SupportDataValue {
  cases: SupportCase[];
  agents: SupportAgent[];
  status: "loading" | "error" | "ready";
  error: string;
  reload: () => void;
  assignAgent: (caseId: string, agentId: string) => Promise<SupportCase>;
}

const SupportDataContext = createContext<SupportDataValue | null>(null);

export function SupportDataProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [agents, setAgents] = useState<SupportAgent[]>([]);
  const [status, setStatus] = useState<SupportDataValue["status"]>("loading");
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setStatus("loading");
    setError("");

    Promise.all([api.fetchCases(), api.fetchAgents()])
      .then(([casesData, agentsData]) => {
        if (!cancelled) {
          setCases(casesData);
          setAgents(agentsData);
          setStatus("ready");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus("error");
          setError(err instanceof Error ? err.message : "An unexpected error occurred");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const assignAgent = useCallback(async (caseId: string, agentId: string) => {
    const updatedCase = await api.assignAgent(caseId, agentId);
    setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
    return updatedCase;
  }, []);

  const value = useMemo(
    () => ({ cases, agents, status, error, reload, assignAgent }),
    [cases, agents, status, error, reload, assignAgent],
  );

  return <SupportDataContext.Provider value={value}>{children}</SupportDataContext.Provider>;
}

export function useSupportData(): SupportDataValue {
  const context = useContext(SupportDataContext);
  if (!context) {
    throw new Error("useSupportData must be used within a SupportDataProvider");
  }
  return context;
}
