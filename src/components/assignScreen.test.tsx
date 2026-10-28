import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as api from "@/data/mockApi";
import App from "@/app";
import { SupportDataProvider } from "@/context/supportData";
import { agents, makeCases } from "@/test/fixtures";

vi.mock("@/data/mockApi", () => ({
  fetchCases: vi.fn(),
  fetchAgents: vi.fn(),
  assignAgent: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(api.fetchCases).mockResolvedValue(makeCases());
  vi.mocked(api.fetchAgents).mockResolvedValue(structuredClone(agents));
  vi.mocked(api.assignAgent).mockImplementation(async (caseId, agentId) => {
    const target = makeCases().find((c) => c.id === caseId)!;
    return { ...target, agentId, status: "in-progress" };
  });
});

/** Renders the whole app and opens TKT-00001 (an open billing ticket) from the tickets table. */
async function openRefundTicket() {
  const user = userEvent.setup();
  render(
    <SupportDataProvider>
      <App />
    </SupportDataProvider>,
  );

  await user.click(screen.getByRole("link", { name: "Tickets" }));
  await user.click(await screen.findByRole("button", { name: "Assign TKT-00001" }));
  expect(screen.getByRole("heading", { level: 1, name: "Assign agent" })).toBeInTheDocument();

  return user;
}

describe("AssignScreen", () => {
  it("lists only agents of the ticket's area, least busy first", async () => {
    await openRefundTicket();

    expect(screen.getByRole("group", { name: "Choose an agent" })).toHaveAccessibleDescription(
      /Only Billing agents/,
    );

    const options = screen.getAllByRole("radio");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveAccessibleName(/^Ana Billing.*0 active tickets$/);
    expect(options[1]).toHaveAccessibleName(/^Bruno Busy.*2 active tickets$/);
    expect(screen.queryByRole("radio", { name: /Tara Tech/ })).not.toBeInTheDocument();
  });

  it("assigns the chosen agent and confirms with their name", async () => {
    const user = await openRefundTicket();

    await user.click(screen.getByRole("radio", { name: /Ana Billing/ }));
    await user.click(screen.getByRole("button", { name: "Assign" }));

    const success = await screen.findByText("Assigned to Ana Billing.");
    expect(success).toHaveFocus();
    expect(api.assignAgent).toHaveBeenCalledWith("TKT-00001", "a-ana");
    // The ticket is no longer open, so the form is replaced by the result.
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("shows the API error and lets the user try again", async () => {
    vi.mocked(api.assignAgent).mockRejectedValueOnce(new Error("Server unavailable"));
    const user = await openRefundTicket();

    await user.click(screen.getByRole("radio", { name: /Ana Billing/ }));
    await user.click(screen.getByRole("button", { name: "Assign" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Server unavailable");
    expect(screen.getByRole("button", { name: "Assign" })).toBeEnabled();
    expect(screen.getByRole("radio", { name: /Ana Billing/ })).toBeChecked();
  });
});
