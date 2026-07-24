import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TeamMembers } from "./TeamMembers";
import { teamMembersApi } from "../../services/teamMembersApi";

vi.mock("../../services/teamMembersApi", () => ({
  teamMembersApi: {
    getAll: vi.fn(),
    update: vi.fn(),
  },
}));

const mockedGetAll = vi.mocked(teamMembersApi.getAll);
const mockedUpdate = vi.mocked(teamMembersApi.update);

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
          { id: "1", name: "Ana Torres", email: "ana@example.com", role: "developer", active: true, activeRequests: 3 },
          { id: "2", name: "Bruno Silva", email: "bruno@example.com", role: "qa", active: true, activeRequests: 0 },
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

    const newButton = await screen.findByRole("button", { name: /new team member/i });
    await user.click(newButton);

    expect(screen.getByText("New member page")).toBeInTheDocument();
  });

  it("navigates to the edit page for a specific member", async () => {
    mockedGetAll.mockResolvedValue({
      data: {
        data: [
          { id: "1", name: "Ana Torres", email: "ana@example.com", role: "developer", active: true, activeRequests: 3 },
        ],
      },
    } as never);
    const user = userEvent.setup();

    renderTeamMembers();

    const editButton = await screen.findByRole("button", { name: /edit/i });
    await user.click(editButton);

    expect(screen.getByText("Edit member page")).toBeInTheDocument();
  });

  describe("deactivating a member", () => {
    it("shows a Deactivate button for active members but not inactive ones", async () => {
      mockedGetAll.mockResolvedValue({
        data: {
          data: [
            { id: "1", name: "Ana Torres", email: "ana@example.com", role: "developer", active: true, activeRequests: 3 },
            { id: "2", name: "Bruno Silva", email: "bruno@example.com", role: "qa", active: false, activeRequests: 0 },
          ],
        },
      } as never);

      renderTeamMembers();

      await screen.findByText("Ana Torres");
      expect(screen.getAllByRole("button", { name: /deactivate/i })).toHaveLength(1);
      expect(screen.getByText("Inactive")).toBeInTheDocument();
    });

    it("opens a confirmation dialog instead of calling the API immediately", async () => {
      mockedGetAll.mockResolvedValue({
        data: {
          data: [
            { id: "1", name: "Ana Torres", email: "ana@example.com", role: "developer", active: true, activeRequests: 3 },
          ],
        },
      } as never);
      const user = userEvent.setup();

      renderTeamMembers();

      await user.click(await screen.findByRole("button", { name: /deactivate/i }));

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText(/deactivate this team member/i)).toBeInTheDocument();
      expect(mockedUpdate).not.toHaveBeenCalled();
    });

    it("does nothing when the dialog is canceled", async () => {
      mockedGetAll.mockResolvedValue({
        data: {
          data: [
            { id: "1", name: "Ana Torres", email: "ana@example.com", role: "developer", active: true, activeRequests: 3 },
          ],
        },
      } as never);
      const user = userEvent.setup();

      renderTeamMembers();

      await user.click(await screen.findByRole("button", { name: /deactivate/i }));
      await user.click(screen.getByRole("button", { name: /cancel/i }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(mockedUpdate).not.toHaveBeenCalled();
      expect(screen.getAllByRole("button", { name: /deactivate/i })).toHaveLength(1);
    });

    it("deactivates the member and updates the UI on confirm", async () => {
      mockedGetAll.mockResolvedValue({
        data: {
          data: [
            { id: "1", name: "Ana Torres", email: "ana@example.com", role: "developer", active: true, activeRequests: 3 },
          ],
        },
      } as never);
      mockedUpdate.mockResolvedValue({} as never);
      const user = userEvent.setup();

      renderTeamMembers();

      await user.click(await screen.findByRole("button", { name: /deactivate/i }));
      const dialog = screen.getByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: "Deactivate" }));

      await waitFor(() => {
        expect(mockedUpdate).toHaveBeenCalledWith("1", { active: false });
      });
      expect(await screen.findByText("Inactive")).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /deactivate/i })).not.toBeInTheDocument();
    });

    it("shows an error message when deactivation fails", async () => {
      mockedGetAll.mockResolvedValue({
        data: {
          data: [
            { id: "1", name: "Ana Torres", email: "ana@example.com", role: "developer", active: true, activeRequests: 3 },
          ],
        },
      } as never);
      mockedUpdate.mockRejectedValue(new Error("network error"));
      const user = userEvent.setup();

      renderTeamMembers();

      await user.click(await screen.findByRole("button", { name: /deactivate/i }));
      const dialog = screen.getByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: "Deactivate" }));

      expect(await screen.findByText("Unable to deactivate this team member.")).toBeInTheDocument();
      // the dialog stays open on failure so the user can retry or cancel
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});
