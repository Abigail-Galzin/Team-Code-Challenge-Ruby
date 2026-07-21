import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "../../components/layout/Card";
import { Button } from "../../components/common/Button";
import { PriorityBadge, StatusBadge } from "../../components/common/Badge";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ConfirmationDialog } from "../../components/feedback/ConfirmationDialog";
import { getSupportRequestById } from "../../services/mockData";
import { formatDate } from "../../utils/format";
import "./RequestDetails.css";

export function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const request = id ? getSupportRequestById(id) : undefined;

  if (!request) {
    return (
      <AppLayout
        title="Request Details"
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Requests", to: "/requests" }, { label: "Not found" }]}
      >
        <Card>
          <EmptyState title="Request not found" description={`No support request matches ID ${id}`} />
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={request.title}
      description={request.id}
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Requests", to: "/requests" }, { label: request.id }]}
      actions={
        <>
          <Button variant="secondary" onClick={() => navigate(`/requests/${request.id}/edit`)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
        </>
      }
    >
      <Card>
        <div className="request-details-badges">
          <StatusBadge status={request.status} />
          <PriorityBadge priority={request.priority} />
        </div>
        <dl className="request-details-list">
          <div>
            <dt>Description</dt>
            <dd>{request.description}</dd>
          </div>
          <div>
            <dt>Assigned To</dt>
            <dd>{request.assignedTo ?? "Unassigned"}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{formatDate(request.createdAt)}</dd>
          </div>
        </dl>
      </Card>
      <ConfirmationDialog
        open={confirmOpen}
        title="Delete this request?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          console.log("delete", request.id);
          setConfirmOpen(false);
          navigate("/requests");
        }}
      />
    </AppLayout>
  );
}
