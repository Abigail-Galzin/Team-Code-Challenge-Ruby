import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "../../components/layout/Card";
import { TextBox } from "../../components/form/TextBox";
import { TextArea } from "../../components/form/TextArea";
import { Dropdown } from "../../components/form/Dropdown";
import { RadioButton } from "../../components/form/RadioButton";
import { Button } from "../../components/common/Button";
import { getSupportRequestById, mockTeamMembers } from "../../services/mockData";
import type { RequestPriority } from "../../types";
import "./RequestForm.css";

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const assigneeOptions = mockTeamMembers.map((member) => ({ label: member.name, value: member.id }));

export function RequestForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const existing = id ? getSupportRequestById(id) : undefined;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [priority, setPriority] = useState<RequestPriority>(existing?.priority ?? "medium");
  const [assignee, setAssignee] = useState("");
  const [titleError, setTitleError] = useState("");

  function handleSubmit() {
    if (!title.trim()) {
      setTitleError("Title is required");
      return;
    }
    setTitleError("");
    console.log("submit request", { title, description, priority, assignee });
    navigate("/requests");
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
        <div className="request-form">
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
            rows={5}
            value={description}
            onChange={setDescription}
            helperText="Provide as much detail as possible"
          />
          <RadioButton
            label="Priority"
            name="priority"
            options={priorityOptions}
            value={priority}
            onChange={(value) => setPriority(value as RequestPriority)}
          />
          <Dropdown
            label="Assign To"
            options={assigneeOptions}
            value={assignee}
            onChange={setAssignee}
            placeholder="Unassigned"
          />
          <div className="request-form-actions">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{isEdit ? "Save Changes" : "Create Request"}</Button>
          </div>
        </div>
      </Card>
    </AppLayout>
  );
}
