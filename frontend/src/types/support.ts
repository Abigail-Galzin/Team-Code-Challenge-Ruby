import type { PaginationMeta } from "./pagination";

export type RequestStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "closed";

export type RequestPriority = "low" | "medium" | "high" | "critical";

export interface TeamMemberInfo {
  active: boolean;
  email: string;
  name: string;
  role: string;
}

export interface Comment {
  id: number;
  body: string;
  support_request_id: number;
  created_at: string;
  team_member: { name: string };
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
  overdue: boolean;
  comments?: Comment[];
}

export interface CreateCommentPayload {
  body: string;
  author_email: string;
}

export interface CommentResponse {
  message: string;
  data: Comment;
  status: string;
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
  due_date?: string | null;
}

export interface TeamMember {
  id?: string;
  name: string;
  email: string;
  role: string;
  //activeRequests: number;
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
