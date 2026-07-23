export interface DashboardStats {
  total_requests: number;
  overdue_requests: number;
  unassigned_requests: number;
  requests_by_status: Record<string, number>;
  requests_by_priority: Record<string, number>;
}

export interface DashboardResponse {
  message: string;
  data: DashboardStats;
  status: string;
}
