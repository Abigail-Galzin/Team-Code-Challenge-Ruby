import { describe, expect, it } from "vitest";
import { validateTeamMember } from "./teamMemberValidation";

describe("validateTeamMember", () => {
  it("is valid with correct data", () => {
    const result = validateTeamMember({ name: "Ana Torres", email: "ana@example.com", role: "developer" });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("requires a name", () => {
    const result = validateTeamMember({ name: "", email: "ana@example.com", role: "developer" });

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe("Name is required");
  });

  it("rejects a name longer than 100 characters", () => {
    const result = validateTeamMember({ name: "a".repeat(101), email: "ana@example.com", role: "developer" });

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe("Name must be 100 characters or less");
  });

  it("requires an email", () => {
    const result = validateTeamMember({ name: "Ana Torres", email: "", role: "developer" });

    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe("Email is required");
  });

  it("rejects a malformed email", () => {
    const result = validateTeamMember({ name: "Ana Torres", email: "not-an-email", role: "developer" });

    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe("Email must be a valid email address");
  });

  it("requires a role", () => {
    const result = validateTeamMember({ name: "Ana Torres", email: "ana@example.com", role: "" });

    expect(result.isValid).toBe(false);
    expect(result.errors.role).toBe("Role is required");
  });

  it("rejects a role outside the allowed list", () => {
    const result = validateTeamMember({ name: "Ana Torres", email: "ana@example.com", role: "manager" });

    expect(result.isValid).toBe(false);
    expect(result.errors.role).toBe("Invalid Role selected");
  });

  it("accepts every allowed role", () => {
    for (const role of ["developer", "qa", "support"]) {
      const result = validateTeamMember({ name: "Ana Torres", email: "ana@example.com", role });
      expect(result.isValid).toBe(true);
    }
  });

  it("reports all invalid fields at once", () => {
    const result = validateTeamMember({ name: "", email: "not-an-email", role: "manager" });

    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors)).toEqual(["name", "email", "role"]);
  });
});
