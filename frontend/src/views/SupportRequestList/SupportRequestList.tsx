import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { Button } from "../../components/common/Button";
import { TableGrid } from "../../components/data/TableGrid";
import { Pagination } from "../../components/data/Pagination";
import { OverdueBadge, PriorityBadge, StatusBadge } from "../../components/common/Badge";
import { TextBox } from "../../components/form/TextBox";
import { Dropdown } from "../../components/form/Dropdown";
import { Checkbox } from "../../components/form/Checkbox";
import { fetchSupportRequests } from "../../services/supportRequestsApi";
import { searchTeamMembers } from "../../services/teamMembersApi";
import type { SupportRequest, PaginationMeta, TableColumn, TeamMemberSearchResult } from "../../types";
import { formatDate } from "../../utils/format";
import "./SupportRequestList.css";

const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

const priorityFilterOptions = [
  { label: "All Priorities", value: "all" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

export function SupportRequestList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<SupportRequest[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [teamMemberFilter, setTeamMemberFilter] = useState("all");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [titleQuery, setTitleQuery] = useState("");
  const [debouncedTitleQuery, setDebouncedTitleQuery] = useState("");

  const [teamMembers, setTeamMembers] = useState<TeamMemberSearchResult[]>([]);

  useEffect(() => {
    searchTeamMembers("")
      .then(setTeamMembers)
      .catch(() => setTeamMembers([]));
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedTitleQuery(titleQuery);
      setPage(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [titleQuery]);

  const loadPage = useCallback((targetPage: number) => {
    setLoading(true);
    setError(undefined);
    fetchSupportRequests(targetPage, {
      status: statusFilter === "all" ? undefined : statusFilter,
      priority: priorityFilter === "all" ? undefined : priorityFilter,
      team_member_id: teamMemberFilter === "all" ? undefined : Number(teamMemberFilter),
      overdue: overdueOnly,
      unassigned: unassignedOnly,
      q: debouncedTitleQuery || undefined,
    })
      .then((response) => {
        setRows(response.data);
        setPagination(response.pagination);
      })
      .catch(() => {
        setError("Unable to load support requests.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [statusFilter, priorityFilter, teamMemberFilter, overdueOnly, unassignedOnly, debouncedTitleQuery]);

  useEffect(() => {
    loadPage(page);
  }, [page, loadPage]);

  function handleStatusChange(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  function handlePriorityChange(value: string) {
    setPriorityFilter(value);
    setPage(1);
  }

  function handleTeamMemberChange(value: string) {
    setTeamMemberFilter(value);
    if (value !== "all") setUnassignedOnly(false);
    setPage(1);
  }

  function handleOverdueChange(checked: boolean) {
    setOverdueOnly(checked);
    setPage(1);
  }

  function handleUnassignedChange(checked: boolean) {
    setUnassignedOnly(checked);
    if (checked) setTeamMemberFilter("all");
    setPage(1);
  }

  const teamMemberFilterOptions = [
    { label: "All Team Members", value: "all" },
    ...teamMembers.map((member) => ({ label: member.name, value: String(member.id) })),
  ];

  const columns: TableColumn<SupportRequest>[] = [
    { header: "ID", field: "id", width: "90px" },
    { header: "Title", field: "title" },
    {
      header: "Priority",
      field: "priority",
      formatter: (row) => <PriorityBadge priority={row.priority} />,
    },
    {
      header: "Status",
      field: "status",
      formatter: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Assigned To",
      field: "team_member",
      formatter: (row) => row.team_member?.name ?? "Unassigned",
    },
    {
      header: "Due Date",
      field: "due_date",
      formatter: (row) => (
        <span className="request-list-due-date">
          {row.due_date ? formatDate(row.due_date) : "—"}
          {row.overdue && <OverdueBadge />}
        </span>
      ),
    },
    {
      header: "Completed",
      field: "completed_at",
      formatter: (row) =>
        row.completed_at ? formatDate(row.completed_at) : "—",
    },
    {
      header: "Actions",
      field: "id",
      align: "right",
      formatter: (row) => (
        <div className="request-list-actions">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/requests/${row.id}`);
            }}
          >
            View
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/requests/${row.id}/edit`);
            }}
          >
            Edit
          </button>
          {/* <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              console.log("delete", row.id);
            }}
          >
            Delete
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <AppLayout
      title="Support Request List"
      description="All registered support requests"
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Requests" }]}
      actions={
        <Button onClick={() => navigate("/requests/new")}>New Request</Button>
      }
    >
      <div className="request-list-filters">
        <TextBox
          label="Search by Title"
          value={titleQuery}
          onChange={setTitleQuery}
          placeholder="Search requests..."
        />
        <Dropdown
          label="Status"
          options={statusFilterOptions}
          value={statusFilter}
          onChange={handleStatusChange}
        />
        <Dropdown
          label="Priority"
          options={priorityFilterOptions}
          value={priorityFilter}
          onChange={handlePriorityChange}
        />
        <Dropdown
          label="Assigned To"
          options={teamMemberFilterOptions}
          value={teamMemberFilter}
          onChange={handleTeamMemberChange}
          disabled={unassignedOnly}
        />
        <Checkbox
          label="Overdue only"
          checked={overdueOnly}
          onChange={handleOverdueChange}
        />
        <Checkbox
          label="Unassigned only"
          checked={unassignedOnly}
          onChange={handleUnassignedChange}
        />
      </div>
      <TableGrid
        columns={columns}
        rows={rows}
        loading={loading}
        error={error}
        onRetry={() => loadPage(page)}
        emptyMessage="No support requests found"
        onRowClick={(row) => navigate(`/requests/${row.id}`)}
        getRowKey={(row) => String(row.id)}
      />
      <Pagination
        currentPage={pagination?.page ?? page}
        totalPages={pagination?.pages ?? 1}
        onPageChange={setPage}
      />
    </AppLayout>
  );
}
