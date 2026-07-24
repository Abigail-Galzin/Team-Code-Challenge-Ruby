import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "../../components/layout/Card";
import { Grid } from "../../components/data/Grid";
import { Avatar } from "../../components/common/Avatar";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Alert } from "../../components/feedback/Alert";
import { ConfirmationDialog } from "../../components/feedback/ConfirmationDialog";
import { teamMembersApi } from "../../services/teamMembersApi";
import type { TeamMember } from "../../types";
import "./TeamMembers.css";

export function TeamMembers() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [memberToDeactivate, setMemberToDeactivate] = useState<TeamMember | null>(null);
  const [deactivating, setDeactivating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await teamMembersApi.getAll();
        setMembers(response.data.data);
      } catch (err) {}
    };
    fetchMembers();
  }, []);

  async function handleConfirmDeactivate() {
    if (!memberToDeactivate) return;

    setDeactivating(true);
    setError("");

    try {
      await teamMembersApi.update(memberToDeactivate.id, { active: false });
      setMembers((current) =>
        current.map((member) =>
          member.id === memberToDeactivate.id ? { ...member, active: false } : member,
        ),
      );
      setMemberToDeactivate(null);
    } catch (err) {
      setError("Unable to deactivate this team member.");
    } finally {
      setDeactivating(false);
    }
  }

  return (
    <AppLayout
      title="Team Members"
      description="Support engineers and their current workload"
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Team Members" }]}
      actions={
        <Button onClick={() => navigate("/team-members/new")}>
          New team member
        </Button>
      }
    >
      {error && <Alert variant="error">{error}</Alert>}
      <Grid columns={3}>
        {members.map((member) => (
          <Card key={member.id}>
            <div className="team-member">
              <Avatar name={member.name} size="lg" />
              <div>
                <p className="team-member-name">
                  {member.name}
                  {!member.active && <Badge label="Inactive" tone="neutral" />}
                </p>
                <p
                  className="team-member-role"
                  style={{ textTransform: "capitalize" }}
                >
                  {member.role}
                </p>
                <p className="team-member-email">{member.email}</p>
              </div>
            </div>
            <div className="team-member-actions">
              <p className="team-member-load">
                {member.activeRequests} active requests
              </p>
              <div className="team-member-buttons">
                <Button
                  variant="primary"
                  onClick={() => navigate(`/team-members/${member.id}/edit`)}
                >
                  Edit
                </Button>
                {member.active && (
                  <Button
                    variant="danger"
                    onClick={() => setMemberToDeactivate(member)}
                  >
                    Deactivate
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </Grid>
      <ConfirmationDialog
        open={memberToDeactivate !== null}
        title="Deactivate this team member?"
        description={
          memberToDeactivate
            ? `${memberToDeactivate.name} will no longer be assignable to support requests. This cannot be undone.`
            : undefined
        }
        confirmLabel={deactivating ? "Deactivating..." : "Deactivate"}
        danger
        onCancel={() => setMemberToDeactivate(null)}
        onConfirm={handleConfirmDeactivate}
      />
    </AppLayout>
  );
}
