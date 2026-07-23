import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "../../components/layout/Card";
import { Button } from "../../components/common/Button";
import { OverdueBadge, PriorityBadge, StatusBadge } from "../../components/common/Badge";
import { Alert } from "../../components/feedback/Alert";
import { EmptyState } from "../../components/feedback/EmptyState";
import { LoadingSpinner } from "../../components/feedback/LoadingSpinner";
import { fetchSupportRequest } from "../../services/supportRequestsApi";
import type { SupportRequest } from "../../types";
import { formatDate } from "../../utils/format";
import "./RequestDetails.css";

export function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<SupportRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setNotFound(false);
    fetchSupportRequest(id)
      .then((response) => {
        setRequest(response.data);
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <AppLayout
        title="Request Details"
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Requests", to: "/requests" },
        ]}
      >
        <Card>
          <LoadingSpinner label="Loading support request..." />
        </Card>
      </AppLayout>
    );
  }

  if (notFound || !request) {
    return (
      <AppLayout
        title="Request Details"
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Requests", to: "/requests" },
          { label: "Not found" },
        ]}
      >
        <Card>
          <EmptyState
            title="Request not found"
            description={`No support request matches ID ${id}`}
          />
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={request.title}
      description={`#${request.id}`}
      breadcrumbs={[
        { label: "Dashboard", to: "/" },
        { label: "Requests", to: "/requests" },
        { label: `#${request.id}` },
      ]}
      actions={
        <>
          <Button
            variant="secondary"
            disabled={request.status === "closed"}
            title={request.status === "closed" ? "Closed requests cannot be edited" : undefined}
            onClick={() => navigate(`/requests/${request.id}/edit`)}
          >
            Edit
          </Button>
        </>
      }
    >
      <Card>
        {request.status === "closed" && (
          <Alert variant="info">This request is closed and cannot be edited.</Alert>
        )}
        <dl className="request-details-list">
          <div>
            <dt>Description</dt>
            <dd>{request.description}</dd>
          </div>
          <div>
            <dt>Assigned To</dt>
            <dd>{request.team_member?.name ?? "Unassigned"}</dd>
          </div>
          <div>
            <dt>Due Date</dt>
            <dd className="request-details-due-date">
              {request.due_date ? formatDate(request.due_date) : "—"}
              {request.overdue && <OverdueBadge />}
            </dd>
          </div>
          <div>
            <dt>Completed At</dt>
            <dd>
              {request.completed_at ? formatDate(request.completed_at) : "—"}
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <StatusBadge status={request.status} />
            </dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>
              <PriorityBadge priority={request.priority} />
            </dd>
          </div>
        </dl>
      </Card>
    </AppLayout>
  );
}
