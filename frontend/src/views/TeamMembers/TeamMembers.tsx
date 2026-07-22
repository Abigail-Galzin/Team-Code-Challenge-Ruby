import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "../../components/layout/Card";
import { Grid } from "../../components/data/Grid";
import { Avatar } from "../../components/common/Avatar";
import { mockTeamMembers } from "../../services/mockData";
import "./TeamMembers.css";

export function TeamMembers() {
  return (
    <AppLayout
      title="Team Members"
      description="Support engineers and their current workload"
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Team Members" }]}
    >
      <Grid columns={3}>
        {mockTeamMembers.map((member) => (
          <Card key={member.id}>
            <div className="team-member">
              <Avatar name={member.name} size="lg" />
              <div>
                <p className="team-member-name">{member.name}</p>
                <p className="team-member-role">{member.role}</p>
                <p className="team-member-email">{member.email}</p>
              </div>
            </div>
            <p className="team-member-load">{member.activeRequests} active requests</p>
          </Card>
        ))}
      </Grid>
    </AppLayout>
  );
}
