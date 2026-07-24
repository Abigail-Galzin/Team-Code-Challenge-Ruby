import type { TeamMember, TeamMemberListResponse } from "../types";
import { apiClient } from "./apiClient";

export type TeamMemberPayload = Partial<Pick<TeamMember, "name" | "email" | "role" | "active">>;

export const teamMembersApi = {
  getAll: () => apiClient.get("/v1/team_members"),
  getById: (id: string) => apiClient.get(`/v1/team_members/${id}`),
  create: (teamMemberData: TeamMemberPayload) =>
    apiClient.post("/v1/team_members", { team_member: teamMemberData }),
  update: (id: string, teamMemberData: TeamMemberPayload) =>
    apiClient.put(`/v1/team_members/${id}`, { team_member: teamMemberData }),
  delete: (id: string) => apiClient.delete(`/v1/team_members/${id}`),
};

export function searchTeamMembers(query: string) {
  return apiClient
    .get<TeamMemberListResponse>("/v1/team_members", { params: { active: true, name: query || undefined } })
    .then((response) => response.data.data);
}
