import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TeamMemberForm } from "./TeamMemberForm";
import { teamMembersApi } from "../../services/teamMembersApi";

vi.mock("../../services/teamMembersApi", () => ({
  teamMembersApi: {
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

const mockedGetById = vi.mocked(teamMembersApi.getById);
const mockedCreate = vi.mocked(teamMembersApi.create);
const mockedUpdate = vi.mocked(teamMembersApi.update);

function renderForm(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/team-members" element={<div>Team members list page</div>} />
        <Route path="/team-members/new" element={<TeamMemberForm />} />
        <Route path="/team-members/:id/edit" element={<TeamMemberForm />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("TeamMemberForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create mode", () => {
    it("shows validation errors instead of submitting when fields are empty", async () => {
      const user = userEvent.setup();
      renderForm("/team-members/new");

      await user.click(screen.getByRole("button", { name: /create member/i }));

      expect(await screen.findByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(mockedCreate).not.toHaveBeenCalled();
    });

    it("creates a member with valid data and navigates back to the list", async () => {
      mockedCreate.mockResolvedValue({} as never);
      const user = userEvent.setup();
      renderForm("/team-members/new");

      await user.type(screen.getByLabelText(/name/i), "Ana Torres");
      await user.type(screen.getByLabelText(/email/i), "ana@example.com");
      await user.click(screen.getByRole("button", { name: /create member/i }));

      await waitFor(() => {
        expect(mockedCreate).toHaveBeenCalledWith({
          name: "Ana Torres",
          email: "ana@example.com",
          role: "developer",
        });
      });
      expect(await screen.findByText("Team members list page")).toBeInTheDocument();
    });

    it("shows the server error message when the API call fails", async () => {
      mockedCreate.mockRejectedValue({
        isAxiosError: true,
        response: { data: { errors: ["Email has already been taken"] } },
      });
      const user = userEvent.setup();
      renderForm("/team-members/new");

      await user.type(screen.getByLabelText(/name/i), "Ana Torres");
      await user.type(screen.getByLabelText(/email/i), "ana@example.com");
      await user.click(screen.getByRole("button", { name: /create member/i }));

      expect(await screen.findByText("Email has already been taken")).toBeInTheDocument();
    });
  });

  describe("edit mode", () => {
    it("pre-fills the form with the existing member's data", async () => {
      mockedGetById.mockResolvedValue({
        data: { data: { name: "Ana Torres", email: "ana@example.com", role: "qa" } },
      } as never);

      renderForm("/team-members/5/edit");

      expect(await screen.findByDisplayValue("Ana Torres")).toBeInTheDocument();
      expect(screen.getByDisplayValue("ana@example.com")).toBeInTheDocument();
      expect(mockedGetById).toHaveBeenCalledWith("5");
    });

    it("updates the member with the edited data", async () => {
      mockedGetById.mockResolvedValue({
        data: { data: { name: "Ana Torres", email: "ana@example.com", role: "developer" } },
      } as never);
      mockedUpdate.mockResolvedValue({} as never);
      const user = userEvent.setup();

      renderForm("/team-members/5/edit");

      const nameInput = await screen.findByDisplayValue("Ana Torres");
      await user.clear(nameInput);
      await user.type(nameInput, "Ana T. Torres");
      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(mockedUpdate).toHaveBeenCalledWith("5", {
          name: "Ana T. Torres",
          email: "ana@example.com",
          role: "developer",
        });
      });
    });
  });
});
