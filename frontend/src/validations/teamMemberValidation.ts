// src/validations/teamMemberValidation.ts
import { validators, validateField } from "../utils/validators";
import type { ValidatorFn } from "../utils/validators";

export const TEAM_MEMBER_ROLES = ["developer", "qa", "support"] as const;

const teamMemberRules: Record<string, { label: string; rules: ValidatorFn[] }> = {
  name: {
    label: "Name",
    rules: [
      validators.required,
      validators.maxLength(100)
    ]
  },
  email: {
    label: "Email",
    rules: [
      validators.required,
      validators.email
    ]
  },
  role: {
    label: "Role",
    rules: [
      validators.required,
      validators.inclusion([...TEAM_MEMBER_ROLES])
    ]
  }
};

/**
 * Validates a TeamMember object and return a FormErrors object.
 */
export function validateTeamMember(data: { name: string; email: string; role: string }) {
  const errors: Record<string, string> = {};

  for (const [field, config] of Object.entries(teamMemberRules)) {
    const value = data[field as keyof typeof data];
    const error = validateField(value, config.label, config.rules);
    if (error) {
      errors[field] = error;
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
}