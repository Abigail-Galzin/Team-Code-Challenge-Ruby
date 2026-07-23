import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "../../components/layout/Card";
import { TextBox } from "../../components/form/TextBox";
import { TextArea } from "../../components/form/TextArea";
import { Dropdown } from "../../components/form/Dropdown";
import { RadioButton } from "../../components/form/RadioButton";
import { Button } from "../../components/common/Button";
import { Alert } from "../../components/feedback/Alert";
import { LoadingSpinner } from "../../components/feedback/LoadingSpinner";
import { createSupportRequest, fetchSupportRequest, updateSupportRequest } from "../../services/supportRequestsApi";
import { searchTeamMembers } from "../../services/teamMembersApi";
import type { RequestPriority, RequestStatus, TeamMemberSearchResult } from "../../types";
import "./RequestForm.css";

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

export function RequestForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<RequestStatus>("open");
  const [initialStatus, setInitialStatus] = useState<RequestStatus | null>(null);
  const [priority, setPriority] = useState<RequestPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [assigneeId, setAssigneeId] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMemberSearchResult[]>([]);

  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    searchTeamMembers("")
      .then(setTeamMembers)
      .catch(() => setTeamMembers([]));
  }, []);

  useEffect(() => {
    if (!id) return;

    setInitialLoading(true);
    setLoadError("");
    fetchSupportRequest(id)
      .then((response) => {
        const record = response.data;
        setTitle(record.title);
        setDescription(record.description);
        setStatus(record.status);
        setInitialStatus(record.status);
        setPriority(record.priority);
        setDueDate(record.due_date ?? "");
        setAssigneeId(record.team_member_id ? String(record.team_member_id) : "");
      })
      .catch(() => {
        setLoadError("Unable to load this support request.");
      })
      .finally(() => {
        setInitialLoading(false);
      });
  }, [id]);

  const assigneeOptions = teamMembers.map((member) => ({
    label: `${member.name} (${member.email})`,
    value: String(member.id),
  }));

  const statusOptions = [
    { label: "Open", value: "open", disabled: initialStatus === "closed" },
    { label: "In Progress", value: "in_progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Closed", value: "closed", disabled: initialStatus === "resolved" },
  ];

  function handleSubmit() {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    setTitleError(trimmedTitle ? "" : "Title is required");
    setDescriptionError(trimmedDescription ? "" : "Description is required");

    if (!trimmedTitle || !trimmedDescription) {
      return;
    }

    setSubmitError("");
    setSubmitting(true);

    const payload = {
      title: trimmedTitle,
      description: trimmedDescription,
      status,
      priority,
      team_member_id: assigneeId ? Number(assigneeId) : null,
      due_date: dueDate || null,
    };

    const request = isEdit && id ? updateSupportRequest(id, payload) : createSupportRequest(payload);

    request
      .then(() => {
        navigate("/requests");
      })
      .catch((error) => {
        const data = error?.response?.data;
        const message = Array.isArray(data?.error) ? data.error.join(", ") : data?.error;
        setSubmitError(message ?? "Unable to save the support request.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <AppLayout
      title={isEdit ? "Edit Request" : "Create Request"}
      description={isEdit ? `Editing ${id}` : "Register a new support request"}
      breadcrumbs={[
        { label: "Dashboard", to: "/" },
        { label: "Requests", to: "/requests" },
        { label: isEdit ? "Edit" : "New" },
      ]}
    >
      <Card>
        {initialLoading ? (
          <LoadingSpinner label="Loading support request..." />
        ) : loadError ? (
          <Alert variant="error">{loadError}</Alert>
        ) : isEdit && initialStatus === "closed" ? (
          <div className="request-form">
            <Alert variant="info">This request is closed and cannot be edited.</Alert>
            <div className="request-form-actions">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Back
              </Button>
            </div>
          </div>
        ) : (
          <div className="request-form">
            {submitError && <Alert variant="error">{submitError}</Alert>}
            <TextBox
              label="Title"
              required
              value={title}
              onChange={setTitle}
              error={titleError}
              placeholder="e.g. Unable to access billing dashboard"
            />
            <TextArea
              label="Description"
              required
              rows={5}
              value={description}
              onChange={setDescription}
              error={descriptionError}
              helperText="Provide as much detail as possible"
            />
            <RadioButton
              label="Status"
              name="status"
              options={statusOptions}
              value={status}
              onChange={(value) => setStatus(value as RequestStatus)}
            />
            <RadioButton
              label="Priority"
              name="priority"
              options={priorityOptions}
              value={priority}
              onChange={(value) => setPriority(value as RequestPriority)}
            />
            <TextBox
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={setDueDate}
            />
            <Dropdown
              label="Assign To"
              options={assigneeOptions}
              value={assigneeId}
              onChange={setAssigneeId}
              placeholder="Unassigned"
            />
            <div className="request-form-actions">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} loading={submitting}>
                {isEdit ? "Save Changes" : "Create Request"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </AppLayout>
  );
}
