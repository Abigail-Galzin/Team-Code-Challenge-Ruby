import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "../../components/layout/Card";
import { Grid } from "../../components/data/Grid";
import { Avatar } from "../../components/common/Avatar";
import { teamMembersApi } from "../../services/teamMembersApi";
import "./TeamMembers.css";
import { useEffect, useState } from "react";
import { Button } from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

export function TeamMembers() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async() => {
      try {
        const response = await teamMembersApi.getAll();
        setMembers(response.data);
      } catch(err) {

      }
    }
    fetchMembers();
  }, []);

  return (
    <AppLayout
      title="Team Members"
      description="Support engineers and their current workload"
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Team Members" }]}
      actions={<Button onClick={() => navigate("/team-members/new")}>New Request</Button>}
    >
      <Grid columns={3}>
        {members.map((member) => (
          <Card key={member.id}>
            <div className="team-member">
              <Avatar name={member.name} size="lg" />
              <div>
                <p className="team-member-name">{member.name}</p>
                <p className="team-member-role">{member.role}</p>
                <p className="team-member-email">{member.email}</p>
              </div>
            </div>
            <div>
              <p className="team-member-load">{member.activeRequests} active requests</p>
              <button type="button" onClick={(event) => { event.stopPropagation(); console.log("edit", member.id); navigate(`/team_members/${member.id}/edit`); }}>
                Edit
              </button>
            </div>

          </Card>
        ))}
      </Grid>
    </AppLayout>
  );
}
