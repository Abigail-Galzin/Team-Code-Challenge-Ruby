import { apiClient } from "./apiClient";
import type { TeamMemberListResponse } from "../types";

export function searchTeamMembers(query: string) {
  return apiClient
    .get<TeamMemberListResponse>("/v1/team_members", { params: query ? { q: query } : {} })
    .then((response) => response.data.data);
}
