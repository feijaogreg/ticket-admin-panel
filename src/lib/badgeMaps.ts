import type { BadgeProps } from "@/components/ui/badge";
import type { CaseCategory, CasePriority, CaseStatus } from "@/types/supportCase";

interface BadgeInfo {
  label: string;
  variant: BadgeProps["variant"];
}

export const STATUS_MAP: Record<CaseStatus, BadgeInfo> = {
  open: { label: "Open", variant: "default" },
  "in-progress": { label: "In Progress", variant: "warning" },
  closed: { label: "Closed", variant: "neutral" },
};

export const PRIORITY_MAP: Record<CasePriority, BadgeInfo> = {
  low: { label: "Low", variant: "neutral" },
  medium: { label: "Medium", variant: "default" },
  high: { label: "High", variant: "warning" },
  critical: { label: "Critical", variant: "danger" },
};

// Agent specialties use the same values as case categories.
export const CATEGORY_MAP: Record<CaseCategory, BadgeInfo> = {
  billing: { label: "Billing", variant: "default" },
  technical: { label: "Technical", variant: "warning" },
  account: { label: "Account", variant: "success" },
};

// Sort ranks: higher means more severe / further along the workflow.
export const PRIORITY_RANK: Record<CasePriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

export const STATUS_RANK: Record<CaseStatus, number> = {
  open: 0,
  "in-progress": 1,
  closed: 2,
};
