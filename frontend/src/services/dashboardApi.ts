import { apiClient } from "./apiClient";
import type { DashboardResponse } from "../types";

export function fetchDashboardStats() {
  return apiClient.get<DashboardResponse>("/v1/dashboard").then((response) => response.data);
}
