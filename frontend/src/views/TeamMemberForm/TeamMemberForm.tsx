import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "../../components/layout/Card";
import { TextBox } from "../../components/form/TextBox";
import { RadioButton } from "../../components/form/RadioButton";
import { Button } from "../../components/common/Button";
import "./TeamMemberForm.css";
import { teamMembersApi } from "../../services/teamMembersApi";
import type { FormErrors } from "../../types/teamMember"
import { Alert } from "../../components/feedback/Alert";
import axios from "axios";
import { validateTeamMember } from "../../validations/teamMemberValidation";

const rolOptions = [
  { label: "Developer", value: "developer" },
  { label: "QA", value: "qa" },
  { label: "Support", value: "support" },
];

export function TeamMemberForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("developer");

  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [errors, setErrors] = useState([]);

  async function handleSubmit() {
    setErrors([]);
    if (!validateForm()) {
      return;
    }

    try {
      if (!isEdit) {
        await teamMembersApi.create({ name, email, role })
      } else {
        await teamMembersApi.update(id, { name, email, role })
      }

      navigate("/team-members");
    } catch(err) {
      if (axios.isAxiosError(err) && err.response) {
        const serverData = err.response.data;
        if (serverData && Array.isArray(serverData.errors)) {
          setErrors(serverData.errors);
        } else {
          setErrors(["An unexpected error occurred on the server."]);
        }
      }
    }
  }

  const validateForm = () => {
    const { errors, isValid } = validateTeamMember({ name, email, role });

    setFormErrors(errors);
    return isValid;
  }

  useEffect(() => {
    if (!id) return;

    const fetchMember = async() => {
      try {
        setIsLoading(true);
        const response = await teamMembersApi.getById(id);
        const data = response.data;

        setName(data.name ?? "");
        setEmail(data.email ?? "");
        setRole(data.role ?? "developer");
      } catch(err) {
        setErrors([""]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [id])

  if (isLoading) {
    return (
      <AppLayout
        title={isEdit ? "Edit Member" : "Create Member"}
        description={isEdit ? `Editing member: ${id}` : "Register a new team member"}
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Team Members", to: "/team-members" },
          { label: isEdit ? "Edit" : "New" },
        ]}
      >
        <Card>
          <p>Loading member data...</p>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={isEdit ? "Edit Member" : "Create Member"}
      description={isEdit ? `Editing member: ${id}` : "Register a new team member"}
      breadcrumbs={[
        { label: "Dashboard", to: "/" },
        { label: "Team Members", to: "/team-members" },
        { label: isEdit ? "Edit" : "New" },
      ]}
    >
      {errors.length > 0 && (
        <Alert variant="error" title="Error">
          <div className="alert-message">
            <ul>
              {errors.map((error, index) => <li key={index}>{error}</li>)}
            </ul>
          </div>
        </Alert>
      )}
      <Card>
        <div className="team-member-form">
          <TextBox
            label="Name"
            required
            value={name}
            onChange={setName}
            error={formErrors.name}
            placeholder="e.g. Alicia Bob"
          />
          <TextBox
            label="Email"
            required
            value={email}
            onChange={setEmail}
            error={formErrors.email}
            placeholder="e.g. name@domain.com"
          />
          <RadioButton
            label="Rol"
            name="role"
            options={rolOptions}
            value={role}
            onChange={(value) => setRole(value)}
          />
          <div className="team-member-form-actions">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{isEdit ? "Save Changes" : "Create Member"}</Button>
          </div>
        </div>
      </Card>
    </AppLayout>
  );
}
