import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { Button } from "../../components/common/Button";
import { TableGrid } from "../../components/data/TableGrid";
import { Pagination } from "../../components/data/Pagination";
import { PriorityBadge, StatusBadge } from "../../components/common/Badge";
import { mockSupportRequests } from "../../services/mockData";
import type { SupportRequest, TableColumn } from "../../types";
import { formatDate } from "../../utils/format";
import "./SupportRequestList.css";

const PAGE_SIZE = 8;

export function SupportRequestList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(mockSupportRequests.length / PAGE_SIZE));
  const pageRows = useMemo(
    () => mockSupportRequests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [page],
  );

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
    { header: "Assigned To", field: "assignedTo", formatter: (row) => row.assignedTo ?? "Unassigned" },
    { header: "Created", field: "createdAt", formatter: (row) => formatDate(row.createdAt) },
    {
      header: "Actions",
      field: "id",
      align: "right",
      formatter: (row) => (
        <div className="request-list-actions">
          <button type="button" onClick={(event) => { event.stopPropagation(); console.log("view", row.id); navigate(`/requests/${row.id}`); }}>
            View
          </button>
          <button type="button" onClick={(event) => { event.stopPropagation(); console.log("edit", row.id); navigate(`/requests/${row.id}/edit`); }}>
            Edit
          </button>
          <button type="button" onClick={(event) => { event.stopPropagation(); console.log("delete", row.id); }}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout
      title="Support Request List"
      description="All registered support requests"
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Requests" }]}
      actions={<Button onClick={() => navigate("/requests/new")}>New Request</Button>}
    >
      <TableGrid
        columns={columns}
        rows={pageRows}
        emptyMessage="No support requests found"
        onRowClick={(row) => navigate(`/requests/${row.id}`)}
        getRowKey={(row) => row.id}
      />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </AppLayout>
  );
}
