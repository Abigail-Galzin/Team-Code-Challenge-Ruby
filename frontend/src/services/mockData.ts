import type { MockSupportRequest, MockTeamMember, RequestPriority, RequestStatus } from "../types";

export const mockTeamMembers: MockTeamMember[] = [
  { id: "u1", name: "Ana Torres", email: "ana.torres@supportflow.com", role: "Support Engineer", activeRequests: 4 },
  { id: "u2", name: "Bruno Silva", email: "bruno.silva@supportflow.com", role: "Support Engineer", activeRequests: 2 },
  { id: "u3", name: "Carla Mendes", email: "carla.mendes@supportflow.com", role: "Team Lead", activeRequests: 5 },
  { id: "u4", name: "Diego Ramirez", email: "diego.ramirez@supportflow.com", role: "Support Engineer", activeRequests: 0 },
  { id: "u5", name: "Elena Petrov", email: "elena.petrov@supportflow.com", role: "QA Analyst", activeRequests: 3 },
];

const statuses: RequestStatus[] = ["open", "assigned", "in_progress", "resolved", "closed"];
const priorities: RequestPriority[] = ["low", "medium", "high"];

export const mockSupportRequests: MockSupportRequest[] = Array.from({ length: 24 }).map((_, index) => {
  const status = statuses[index % statuses.length];
  const priority = priorities[index % priorities.length];
  const assignee = mockTeamMembers[index % mockTeamMembers.length];
  return {
    id: `REQ-${1000 + index}`,
    title: `Support request #${1000 + index}`,
    description:
      "Customer reported an issue accessing the billing dashboard after the latest release.",
    priority,
    status,
    assignedTo: status === "open" ? null : assignee.name,
    createdAt: new Date(Date.now() - index * 86_400_000).toISOString(),
  };
});

export function getSupportRequestById(id: string): MockSupportRequest | undefined {
  return mockSupportRequests.find((request) => request.id === id);
}
