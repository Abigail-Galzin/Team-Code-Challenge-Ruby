import type { TeamMember } from "../types";
import { apiClient } from "./apiClient";

export const teamMembersApi = {
  getAll: () => apiClient.get("/v1/team_members"),
  getById: (id: string) => apiClient.get(`/v1/team_members/${id}`),
  create: (teamMemberData: TeamMember) =>
    apiClient.post("/v1/team_members", teamMemberData),
  update: (id: string, teamMemberData: TeamMember) =>
    apiClient.put(`/v1/team_members/${id}`, teamMemberData),
  delete: (id: string) => apiClient.delete(`/team_members/${id}`),
};
