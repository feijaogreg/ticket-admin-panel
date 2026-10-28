import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as api from "@/data/mockApi";
import { SupportDataProvider } from "@/context/supportData";
import { agents, makeCases } from "@/test/fixtures";
import { TicketList } from "./ticketList";

// Replaces the real module (and its 1.2s latency) with controllable stubs.
vi.mock("@/data/mockApi", () => ({
  fetchCases: vi.fn(),
  fetchAgents: vi.fn(),
  assignAgent: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(api.fetchCases).mockResolvedValue(makeCases());
  vi.mocked(api.fetchAgents).mockResolvedValue(structuredClone(agents));
});

function renderTicketList() {
  render(
    <SupportDataProvider>
      <TicketList onSelectCase={vi.fn()} />
    </SupportDataProvider>,
  );
}

/** Body rows only: the first row of the table is the header. */
function getBodyRows() {
  return within(screen.getByRole("table", { name: "Tickets" })).getAllByRole("row").slice(1);
}

describe("TicketList", () => {
  it("shows a loading state, then one row per ticket", async () => {
    renderTicketList();

    expect(screen.getByRole("status")).toHaveTextContent("Loading…");

    expect(await screen.findByRole("table", { name: "Tickets" })).toBeInTheDocument();
    expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
    expect(getBodyRows()).toHaveLength(5);
    expect(screen.getByRole("cell", { name: "Refund not received" })).toBeInTheDocument();
  });

  it("sorts priority by severity when the header is clicked", async () => {
    const user = userEvent.setup();
    renderTicketList();
    await screen.findByRole("table", { name: "Tickets" });

    const priorityHeader = screen.getByRole("columnheader", { name: "Priority" });
    const sortButton = within(priorityHeader).getByRole("button", { name: "Priority" });

    await user.click(sortButton);
    expect(priorityHeader).toHaveAttribute("aria-sort", "ascending");
    expect(within(getBodyRows()[0]).getByText("Low")).toBeInTheDocument();

    await user.click(sortButton);
    expect(priorityHeader).toHaveAttribute("aria-sort", "descending");
    expect(within(getBodyRows()[0]).getByText("Critical")).toBeInTheDocument();
  });

  it("filters rows by subject and description, with a no-results message", async () => {
    const user = userEvent.setup();
    renderTicketList();
    await screen.findByRole("table", { name: "Tickets" });

    const search = screen.getByRole("searchbox", { name: "Search tickets" });

    // "webhook" only appears in TKT-00004's description.
    await user.type(search, "WEBHOOK");
    expect(getBodyRows()).toHaveLength(1);
    expect(screen.getByRole("cell", { name: "API returns 500" })).toBeInTheDocument();
    expect(screen.getByText("1 of 5 tickets")).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "nothing matches this");
    expect(screen.getByText("No results. Try a different search.")).toBeInTheDocument();
    expect(screen.getByText("0 of 5 tickets")).toBeInTheDocument();
  });
});
