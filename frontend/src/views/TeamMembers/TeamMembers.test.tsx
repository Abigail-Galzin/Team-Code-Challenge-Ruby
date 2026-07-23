import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TeamMembers } from "./TeamMembers";
import { teamMembersApi } from "../../services/teamMembersApi";

vi.mock("../../services/teamMembersApi", () => ({
  teamMembersApi: {
    getAll: vi.fn(),
  },
}));

const mockedGetAll = vi.mocked(teamMembersApi.getAll);

function renderTeamMembers() {
  return render(
    <MemoryRouter initialEntries={["/team-members"]}>
      <Routes>
        <Route path="/team-members" element={<TeamMembers />} />
        <Route path="/team-members/new" element={<div>New member page</div>} />
        <Route path="/team-members/:id/edit" element={<div>Edit member page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("TeamMembers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders each team member returned by the API", async () => {
    mockedGetAll.mockResolvedValue({
      data: {
        data: [
          { id: "1", name: "Ana Torres", email: "ana@example.com", role: "developer", activeRequests: 3 },
          { id: "2", name: "Bruno Silva", email: "bruno@example.com", role: "qa", activeRequests: 0 },
        ],
      },
    } as never);

    renderTeamMembers();

    expect(await screen.findByText("Ana Torres")).toBeInTheDocument();
    expect(screen.getByText("Bruno Silva")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    expect(screen.getByText("3 active requests")).toBeInTheDocument();
    expect(screen.getByText("0 active requests")).toBeInTheDocument();
  });

  it("renders no member cards when the API call fails", async () => {
    mockedGetAll.mockRejectedValue(new Error("network error"));

    renderTeamMembers();

    await waitFor(() => expect(mockedGetAll).toHaveBeenCalled());
    expect(screen.queryByText(/active requests/)).not.toBeInTheDocument();
  });

  it("navigates to the new-member page from the header action", async () => {
    mockedGetAll.mockResolvedValue({ data: { data: [] } } as never);
    const user = userEvent.setup();

    renderTeamMembers();

    const newButton = await screen.findByRole("button", { name: /new request/i });
    await user.click(newButton);

    expect(screen.getByText("New member page")).toBeInTheDocument();
  });

  it("navigates to the edit page for a specific member", async () => {
    mockedGetAll.mockResolvedValue({
      data: {
        data: [
          { id: "1", name: "Ana Torres", email: "ana@example.com", role: "developer", activeRequests: 3 },
        ],
      },
    } as never);
    const user = userEvent.setup();

    renderTeamMembers();

    const editButton = await screen.findByRole("button", { name: /edit/i });
    await user.click(editButton);

    expect(screen.getByText("Edit member page")).toBeInTheDocument();
  });
});
