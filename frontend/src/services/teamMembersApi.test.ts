import { describe, expect, it, vi, beforeEach } from "vitest";
import { apiClient } from "./apiClient";
import { teamMembersApi } from "./teamMembersApi";

vi.mock("./apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("teamMembersApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAll requests the team_members collection", () => {
    teamMembersApi.getAll();
    expect(apiClient.get).toHaveBeenCalledWith("/v1/team_members");
  });

  it("getById requests a single team member by id", () => {
    teamMembersApi.getById("5");
    expect(apiClient.get).toHaveBeenCalledWith("/v1/team_members/5");
  });

  it("create posts the payload wrapped in a team_member key", () => {
    const payload = { name: "Ana Torres", email: "ana@example.com", role: "developer" };
    teamMembersApi.create(payload);
    expect(apiClient.post).toHaveBeenCalledWith("/v1/team_members", { team_member: payload });
  });

  it("update puts the payload wrapped in a team_member key", () => {
    const payload = { name: "Ana Torres", email: "ana@example.com", role: "qa" };
    teamMembersApi.update("5", payload);
    expect(apiClient.put).toHaveBeenCalledWith("/v1/team_members/5", { team_member: payload });
  });

  it("update accepts a partial payload for deactivation", () => {
    teamMembersApi.update("5", { active: false });
    expect(apiClient.put).toHaveBeenCalledWith("/v1/team_members/5", { team_member: { active: false } });
  });

  it("delete removes the member by id", () => {
    teamMembersApi.delete("5");
    expect(apiClient.delete).toHaveBeenCalledWith("/v1/team_members/5");
  });
});
