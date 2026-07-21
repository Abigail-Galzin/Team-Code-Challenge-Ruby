import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "../../components/layout/Card";
import { Grid } from "../../components/data/Grid";
import { mockSupportRequests } from "../../services/mockData";
import "./Dashboard.css";

const statuses = ["open", "assigned", "in_progress", "resolved", "closed"] as const;

const statusLabel: Record<(typeof statuses)[number], string> = {
  open: "Open",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export function Dashboard() {
  const counts = statuses.map((status) => ({
    status,
    count: mockSupportRequests.filter((request) => request.status === status).length,
  }));

  return (
    <AppLayout title="Dashboard" description="Overview of support activity" breadcrumbs={[{ label: "Dashboard" }]}>
      <Grid columns={3}>
        {counts.map(({ status, count }) => (
          <Card key={status} title={statusLabel[status]}>
            <p className="dashboard-stat">{count}</p>
          </Card>
        ))}
      </Grid>
    </AppLayout>
  );
}
