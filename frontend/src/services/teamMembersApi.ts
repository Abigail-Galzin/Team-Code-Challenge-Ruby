import type { TeamMember } from "../types";
import { apiClient } from "./apiClient";

export const teamMembersApi = {
    getAll: () => apiClient.get("/team_members"),
    getById: (id:string) => apiClient.get(`/team_members/${id}`),
    create: (teamMemberData : TeamMember) => apiClient.post("/team_members", teamMemberData),
    update: (id:string, teamMemberData: TeamMember) => apiClient.put(`/team_members/${id}`, teamMemberData),
    delete: (id:string) => apiClient.delete(`/team_members/${id}`),
}