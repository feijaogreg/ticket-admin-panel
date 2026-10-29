import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import * as api from "@/data/mockApi";
import { SupportDataProvider } from "@/context/supportData";
import { agents, makeCases } from "@/test/fixtures";
import { Dashboard } from "./dashboard";

vi.mock("@/data/mockApi", () => ({
  fetchCases: vi.fn(),
  fetchAgents: vi.fn(),
  assignAgent: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(api.fetchCases).mockResolvedValue(makeCases());
  vi.mocked(api.fetchAgents).mockResolvedValue(structuredClone(agents));
});

describe("Dashboard", () => {
  it("shows loading, then the summary, categories and agent workload", async () => {
    render(
      <SupportDataProvider>
        <Dashboard />
      </SupportDataProvider>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Loading…");

    const workload = await screen.findByRole("table", { name: "Agents workload" });
    // Each summary card is a term (label) followed by its definition (value).
    const values = screen.getAllByRole("definition").map((dd) => dd.textContent);
    const labels = screen.getAllByRole("term").map((dt) => dt.textContent);
    expect(Object.fromEntries(labels.map((label, i) => [label, values[i]]))).toEqual({
      "Unassigned tickets": "2",
      "High/Critical open": "1",
      "In progress": "2",
      Closed: "1",
    });

    const categories = screen.getByRole("table", { name: "Open tickets by category" });
    expect(within(categories).getByRole("row", { name: "Account 0" })).toBeInTheDocument();

    const [, firstAgent] = within(workload).getAllByRole("row");
    expect(firstAgent).toHaveTextContent("Bruno Busy");
    expect(firstAgent).toHaveTextContent("2");
  });
});
