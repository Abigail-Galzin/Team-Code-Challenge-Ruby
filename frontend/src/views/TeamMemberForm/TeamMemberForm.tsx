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

const rolOptions = [
  { label: "Developer", value: "developer" },
  { label: "QA", value: "qa" },
  { label: "Support", value: "support" },
];

export function TeamMemberForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [member, setMember] = useState(null)
  const [name, setName] = useState(member?.name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [role, setRol] = useState<string>(member?.role ?? "developer");
  const [errors, setErrors] = useState<FormErrors>({});

  async function handleSubmit() {
    if (validateForm()) {
      return;
    }
    await teamMembersApi.create({ name, email, role })

    navigate("/team-members");

  }

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!role.trim()) newErrors.role = "Rol is required";

    setErrors(newErrors);
    return Object.keys(errors).length > 0;
  }
  useEffect(() => {
    const existing = async() => {
      try {
        const response = id ? await teamMembersApi.getById(id) : null;
        setMember(response.data);
      } catch(err) {

      }
    };

    existing();
  }, null)

  return (
    <AppLayout
      title={isEdit ? "Edit Request" : "Create Member"}
      description={isEdit ? `Editing ${id}` : "Register a new team member"}
      breadcrumbs={[
        { label: "Dashboard", to: "/" },
        { label: "Team Members", to: "/team-members" },
        { label: isEdit ? "Edit" : "New" },
      ]}
    >
      <Card>
        <div className="team-member-form">
          <TextBox
            label="Name"
            required
            value={name}
            onChange={setName}
            error={errors.name}
            placeholder="e.g. Alicia Bob"
          />
          <TextBox
            label="Email"
            required
            value={email}
            onChange={setEmail}
            error={errors.email}
            placeholder="e.g. name@domain.com"
          />
          <RadioButton
            label="Rol"
            name="role"
            options={rolOptions}
            value={role}
            onChange={(value) => setRol(value)}
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
