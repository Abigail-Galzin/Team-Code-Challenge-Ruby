import { classNames } from "../../utils/format";
import type { RequestPriority, RequestStatus } from "../../types";
import "./Badge.css";

export type BadgeTone = "neutral" | "info" | "primary" | "warning" | "success" | "error";

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  return <span className={classNames("badge", `badge-${tone}`)}>{label}</span>;
}

const statusTone: Record<RequestStatus, BadgeTone> = {
  open: "info",
  assigned: "primary",
  in_progress: "warning",
  resolved: "success",
  closed: "neutral",
};

const statusLabel: Record<RequestStatus, string> = {
  open: "Open",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return <Badge label={statusLabel[status]} tone={statusTone[status]} />;
}

const priorityTone: Record<RequestPriority, BadgeTone> = {
  low: "success",
  medium: "warning",
  high: "error",
  critical: "error",
};

const priorityLabel: Record<RequestPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function PriorityBadge({ priority }: { priority: RequestPriority }) {
  return <Badge label={priorityLabel[priority]} tone={priorityTone[priority]} />;
}

export function OverdueBadge() {
  return <Badge label="Overdue" tone="error" />;
}
