import type { TableColumn } from "../../types";
import { classNames } from "../../utils/format";
import { EmptyState } from "../feedback/EmptyState";
import { ErrorState } from "../feedback/ErrorState";
import { LoadingSpinner } from "../feedback/LoadingSpinner";
import "./TableGrid.css";

export interface TableGridProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  zebra?: boolean;
  onRowClick?: (row: T) => void;
  onRetry?: () => void;
  getRowKey?: (row: T, index: number) => string;
}

export function TableGrid<T extends object>({
  columns,
  rows,
  loading = false,
  error,
  emptyMessage = "No records found",
  zebra = false,
  onRowClick,
  onRetry,
  getRowKey,
}: TableGridProps<T>) {
  if (loading) {
    return (
      <div className="table-grid-state">
        <LoadingSpinner label="Loading records..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-grid-state">
        <ErrorState description={error} onRetry={onRetry} />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="table-grid-state">
        <EmptyState title={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="table-grid-wrapper">
      <table className={classNames("table-grid", zebra && "table-grid-zebra")}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.field)}
                style={{ width: column.width, textAlign: column.align ?? "left" }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={getRowKey ? getRowKey(row, rowIndex) : rowIndex}
              className={classNames(onRowClick && "table-grid-row-clickable")}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td key={String(column.field)} style={{ textAlign: column.align ?? "left" }}>
                  {column.formatter ? column.formatter(row) : String(row[column.field as keyof T] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
