import { apiClient } from "./apiClient";
import type { CreateSupportRequestPayload, SupportRequestListResponse, SupportRequestResponse } from "../types";

export function fetchSupportRequests(page: number) {
  return apiClient
    .get<SupportRequestListResponse>("/v1/support_requests", { params: { page } })
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
