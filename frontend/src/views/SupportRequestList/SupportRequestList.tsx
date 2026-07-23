import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { Button } from "../../components/common/Button";
import { TableGrid } from "../../components/data/TableGrid";
import { Pagination } from "../../components/data/Pagination";
import { PriorityBadge, StatusBadge } from "../../components/common/Badge";
import { fetchSupportRequests } from "../../services/supportRequestsApi";
import type { SupportRequest, PaginationMeta, TableColumn } from "../../types";
import { formatDate } from "../../utils/format";
import "./SupportRequestList.css";

export function SupportRequestList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<SupportRequest[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const loadPage = useCallback((targetPage: number) => {
    setLoading(true);
    setError(undefined);
    fetchSupportRequests(targetPage)
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
  }, []);

  useEffect(() => {
    loadPage(page);
  }, [page, loadPage]);

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
      formatter: (row) => (row.due_date ? formatDate(row.due_date) : "—"),
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
