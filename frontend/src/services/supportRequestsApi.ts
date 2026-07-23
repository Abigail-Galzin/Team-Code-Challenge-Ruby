import { apiClient } from "./apiClient";
import type { CreateSupportRequestPayload, SupportRequestListResponse, SupportRequestResponse } from "../types";

export interface SupportRequestFilters {
  status?: string;
  priority?: string;
  team_member_id?: number;
  overdue?: boolean;
  unassigned?: boolean;
  q?: string;
}

export function fetchSupportRequests(page: number, filters: SupportRequestFilters = {}) {
  const params: Record<string, string | number> = { page };
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.team_member_id) params.team_member_id = filters.team_member_id;
  if (filters.overdue) params.overdue = "true";
  if (filters.unassigned) params.unassigned = "true";
  if (filters.q) params.q = filters.q;

  return apiClient
    .get<SupportRequestListResponse>("/v1/support_requests", { params })
    .then((response) => response.data);
}

export function createSupportRequest(payload: CreateSupportRequestPayload) {
  return apiClient
    .post<SupportRequestResponse>("/v1/support_requests", { support_request: payload })
    .then((response) => response.data);
}

export function fetchSupportRequest(id: string) {
  return apiClient
    .get<SupportRequestResponse>(`/v1/support_requests/${id}`)
    .then((response) => response.data);
}

export function updateSupportRequest(id: string, payload: CreateSupportRequestPayload) {
  return apiClient
    .patch<SupportRequestResponse>(`/v1/support_requests/${id}`, { support_request: payload })
    .then((response) => response.data);
}
