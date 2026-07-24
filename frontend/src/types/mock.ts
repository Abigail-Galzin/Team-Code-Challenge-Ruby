import type { RequestPriority, RequestStatus } from "./support";

export interface MockSupportRequest {
  id: string;
  title: string;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  assignedTo: string | null;
  createdAt: string;
}

export interface MockTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  activeRequests: number;
}
