import type { PaginationMeta } from "./pagination";

export type RequestStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "closed";

export type RequestPriority = "low" | "medium" | "high" | "critical";

export interface MockSupportRequest {
  id: string;
  title: string;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  assignedTo: string | null;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  activeRequests: number;
}

export interface TeamMemberInfo {
  active: boolean;
  email: string;
  name: string;
  role: string;
}

export interface SupportRequest {
  id: number;
  title: string;
  description: string;
  status: RequestStatus;
  priority: RequestPriority;
  due_date: string | null;
  completed_at: string | null;
  team_member_id: number | null;
  team_member: TeamMemberInfo | null;
}

export interface SupportRequestListResponse {
  message: string;
  data: SupportRequest[];
  status: string;
  pagination: PaginationMeta;
}

export interface SupportRequestResponse {
  message: string;
  data: SupportRequest;
  status: string;
}

export interface CreateSupportRequestPayload {
  title: string;
  description: string;
  status: RequestStatus;
  priority: RequestPriority;
  team_member_id?: number | null;
}

export interface TeamMemberSearchResult {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export interface TeamMemberListResponse {
  message: string;
  data: TeamMemberSearchResult[];
  status: string;
}
