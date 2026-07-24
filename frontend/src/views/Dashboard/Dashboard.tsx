import { useEffect, useState } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "../../components/layout/Card";
import { Grid } from "../../components/data/Grid";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import { Alert } from "../../components/feedback/Alert";
import { LoadingSpinner } from "../../components/feedback/LoadingSpinner";
import { fetchDashboardStats } from "../../services/dashboardApi";
import type { DashboardStats, RequestPriority, RequestStatus } from "../../types";
import "./Dashboard.css";

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats()
      .then((response) => setStats(response.data))
      .catch(() => setError("Unable to load dashboard stats."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout title="Dashboard" description="Overview of support activity" breadcrumbs={[{ label: "Dashboard" }]}>
      {loading ? (
        <LoadingSpinner label="Loading dashboard..." />
      ) : error || !stats ? (
        <Alert variant="error">{error || "Unable to load dashboard stats."}</Alert>
      ) : (
        <>
          <Grid columns={3}>
            <Card title="Total Requests">
              <p className="dashboard-stat">{stats.total_requests}</p>
            </Card>
            <Card title="Overdue">
              <p className="dashboard-stat dashboard-stat-warning">{stats.overdue_requests}</p>
            </Card>
            <Card title="Unassigned">
              <p className="dashboard-stat">{stats.unassigned_requests}</p>
            </Card>
          </Grid>

          <h3 className="dashboard-section-title">By Status</h3>
          <Grid columns={3}>
            {Object.entries(stats.requests_by_status).map(([status, count]) => (
              <Card key={status}>
                <div className="dashboard-breakdown-row">
                  <StatusBadge status={status as RequestStatus} />
                  <span className="dashboard-stat">{count}</span>
                </div>
              </Card>
            ))}
          </Grid>

          <h3 className="dashboard-section-title">By Priority</h3>
          <Grid columns={3}>
            {Object.entries(stats.requests_by_priority).map(([priority, count]) => (
              <Card key={priority}>
                <div className="dashboard-breakdown-row">
                  <PriorityBadge priority={priority as RequestPriority} />
                  <span className="dashboard-stat">{count}</span>
                </div>
              </Card>
            ))}
          </Grid>
        </>
      )}
    </AppLayout>
  );
}
