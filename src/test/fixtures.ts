import type { SupportAgent, SupportCase } from "@/types/supportCase";

export const agents: SupportAgent[] = [
  { id: "a-ana", firstName: "Ana", lastName: "Billing", email: "ana@supporthub.com", specialty: "billing" },
  { id: "a-bruno", firstName: "Bruno", lastName: "Busy", email: "bruno@supporthub.com", specialty: "billing" },
  { id: "a-tara", firstName: "Tara", lastName: "Tech", email: "tara@supporthub.com", specialty: "technical" },
  { id: "a-omar", firstName: "Omar", lastName: "Account", email: "omar@supporthub.com", specialty: "account" },
];

function makeCase(overrides: Partial<SupportCase> & Pick<SupportCase, "id" | "subject">): SupportCase {
  return {
    customer: "Jane Doe",
    customerEmail: "jane@example.com",
    customerTier: "standard",
    status: "open",
    priority: "medium",
    agentId: null,
    category: "billing",
    description: "No description.",
    tags: [],
    createdAt: new Date("2026-01-01T10:00:00Z"),
    updatedAt: new Date("2026-01-02T10:00:00Z"),
    deadline: new Date("2026-01-10T10:00:00Z"),
    ...overrides,
  };
}

/** Fresh objects every call, so a test can't leak changes into the next one. */
export function makeCases(): SupportCase[] {
  return [
    makeCase({
      id: "TKT-00001",
      subject: "Refund not received",
      description: "Customer waited two weeks for the refund.",
      priority: "low",
    }),
    makeCase({
      id: "TKT-00002",
      subject: "Duplicate charge",
      priority: "critical",
      status: "in-progress",
      agentId: "a-bruno",
    }),
    makeCase({
      id: "TKT-00003",
      subject: "Invoice shows wrong amount",
      priority: "high",
      status: "in-progress",
      agentId: "a-bruno",
    }),
    makeCase({
      id: "TKT-00004",
      subject: "API returns 500",
      description: "The webhook endpoint times out under load.",
      category: "technical",
      priority: "high",
    }),
    makeCase({
      id: "TKT-00005",
      subject: "Password reset email",
      category: "account",
      status: "closed",
      agentId: "a-omar",
    }),
  ];
}
