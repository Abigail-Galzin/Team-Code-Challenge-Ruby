import { useMemo, useState } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { Button } from "../../components/common/Button";
import { Badge, PriorityBadge, StatusBadge } from "../../components/common/Badge";
import { Chip } from "../../components/common/Chip";
import { Avatar } from "../../components/common/Avatar";
import { Divider } from "../../components/common/Divider";
import { Card } from "../../components/layout/Card";
import { Grid } from "../../components/data/Grid";
import { TableGrid } from "../../components/data/TableGrid";
import { Pagination } from "../../components/data/Pagination";
import { TextBox } from "../../components/form/TextBox";
import { TextArea } from "../../components/form/TextArea";
import { Dropdown } from "../../components/form/Dropdown";
import { Checkbox } from "../../components/form/Checkbox";
import { RadioButton } from "../../components/form/RadioButton";
import { Switch } from "../../components/form/Switch";
import { Alert } from "../../components/feedback/Alert";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ErrorState } from "../../components/feedback/ErrorState";
import { LoadingSpinner } from "../../components/feedback/LoadingSpinner";
import { ConfirmationDialog } from "../../components/feedback/ConfirmationDialog";
import { mockSupportRequests } from "../../services/mockData";
import type { RequestPriority, RequestStatus, TableColumn } from "../../types";
import { DemoSection } from "./DemoSection";
import "./ComponentsDemo.css";

const statusValues: RequestStatus[] = ["open", "assigned", "in_progress", "resolved", "closed"];
const priorityValues: RequestPriority[] = ["low", "medium", "high"];

const dropdownOptions = [
  { label: "Ana Torres", value: "ana" },
  { label: "Bruno Silva", value: "bruno" },
  { label: "Carla Mendes", value: "carla" },
];

const priorityOptions = priorityValues.map((value) => ({ label: value, value }));

type TableDemoState = "data" | "loading" | "error" | "empty";

interface DemoRow {
  id: string;
  title: string;
  priority: RequestPriority;
  status: RequestStatus;
}

export function ComponentsDemo() {
  const [buttonEvent, setButtonEvent] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);

  const [textValue, setTextValue] = useState("");
  const [emailValue, setEmailValue] = useState("not-an-email");
  const [numberValue, setNumberValue] = useState("");

  const [textAreaValue, setTextAreaValue] = useState("");

  const [dropdownValue, setDropdownValue] = useState("");
  const [dropdownEvent, setDropdownEvent] = useState("");

  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState<string>("medium");
  const [switchValue, setSwitchValue] = useState(false);

  const [tableState, setTableState] = useState<TableDemoState>("data");
  const [page, setPage] = useState(3);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEvent, setDialogEvent] = useState("");

  const demoRows: DemoRow[] = useMemo(
    () =>
      mockSupportRequests.slice(0, 5).map((request) => ({
        id: request.id,
        title: request.title,
        priority: request.priority,
        status: request.status,
      })),
    [],
  );

  const demoColumns: TableColumn<DemoRow>[] = [
    { header: "ID", field: "id", width: "100px" },
    { header: "Title", field: "title" },
    { header: "Priority", field: "priority", formatter: (row) => <PriorityBadge priority={row.priority} /> },
    { header: "Status", field: "status", formatter: (row) => <StatusBadge status={row.status} /> },
  ];

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  const isNumber = numberValue === "" || /^-?\d+(\.\d+)?$/.test(numberValue);

  return (
    <AppLayout
      title="Components Demo"
      description="Internal catalog of reusable SupportFlow components"
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Components Demo" }]}
    >
      <div className="demo-sections">
        <DemoSection
          title="1. Buttons"
          description="Primary, secondary, danger, disabled and loading variants."
          eventOutput={buttonEvent}
        >
          <Button variant="primary" onClick={() => setButtonEvent("primary clicked")}>
            Primary
          </Button>
          <Button variant="secondary" onClick={() => setButtonEvent("secondary clicked")}>
            Secondary
          </Button>
          <Button variant="danger" onClick={() => setButtonEvent("danger clicked")}>
            Danger
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button
            variant="primary"
            loading={loadingButton}
            onClick={() => {
              setLoadingButton(true);
              setButtonEvent("loading started");
              setTimeout(() => setLoadingButton(false), 1500);
            }}
          >
            Loading
          </Button>
        </DemoSection>

        <DemoSection
          title="2. Text Inputs"
          description="TextBox supports text, email, password and number types with validation."
          currentValue={`text="${textValue}" email="${emailValue}" number="${numberValue}"`}
        >
          <TextBox label="Text" value={textValue} onChange={setTextValue} placeholder="Enter text" />
          <TextBox
            label="Email"
            type="email"
            value={emailValue}
            onChange={setEmailValue}
            error={isEmail ? "" : "Enter a valid email address"}
          />
          <TextBox label="Password" type="password" value="secret123" disabled />
          <TextBox
            label="Number"
            type="number"
            value={numberValue}
            onChange={setNumberValue}
            error={isNumber ? "" : "Enter a valid number"}
          />
          <TextBox label="Required Field" required value="" onChange={() => {}} error="This field is required" />
        </DemoSection>

        <DemoSection
          title="3. Text Area"
          description="Multi-line text input with configurable rows."
          currentValue={textAreaValue || "(empty)"}
        >
          <TextArea
            label="Comments"
            rows={4}
            value={textAreaValue}
            onChange={setTextAreaValue}
            helperText="Describe the issue in detail"
          />
        </DemoSection>

        <DemoSection
          title="4. Dropdown"
          description="Select component using fake data, exposes onChange."
          currentValue={dropdownValue || "(none)"}
          eventOutput={dropdownEvent}
        >
          <Dropdown
            label="Assign To"
            options={dropdownOptions}
            value={dropdownValue}
            onChange={(value) => {
              setDropdownValue(value);
              setDropdownEvent(`onChange("${value}")`);
            }}
          />
        </DemoSection>

        <DemoSection
          title="5. Checkbox"
          description="Simple boolean toggle."
          currentValue={String(checkboxValue)}
        >
          <Checkbox label="Notify me by email" checked={checkboxValue} onChange={setCheckboxValue} />
        </DemoSection>

        <DemoSection
          title="6. Radio Buttons"
          description="Single choice from a group of options."
          currentValue={radioValue}
        >
          <RadioButton label="Priority" name="demo-priority" options={priorityOptions} value={radioValue} onChange={setRadioValue} />
        </DemoSection>

        <DemoSection
          title="7. Switch"
          description="On/off toggle control."
          currentValue={String(switchValue)}
        >
          <Switch label="Enable notifications" checked={switchValue} onChange={setSwitchValue} />
        </DemoSection>

        <DemoSection title="8. Alerts" description="Success, warning, error and info variants.">
          <div className="demo-stack">
            <Alert variant="success" title="Success">Request resolved successfully.</Alert>
            <Alert variant="warning" title="Warning">This request is approaching its SLA deadline.</Alert>
            <Alert variant="error" title="Error">Failed to save changes.</Alert>
            <Alert variant="info" title="Info">A new team member was added.</Alert>
          </div>
        </DemoSection>

        <DemoSection title="9. Badges" description="Status and priority badges with distinct colors.">
          <div className="demo-stack-row">
            {statusValues.map((status) => (
              <StatusBadge key={status} status={status} />
            ))}
          </div>
          <div className="demo-stack-row">
            {priorityValues.map((priority) => (
              <PriorityBadge key={priority} priority={priority} />
            ))}
          </div>
          <div className="demo-stack-row">
            <Badge label="Neutral" tone="neutral" />
            <Chip label="Removable chip" onRemove={() => setButtonEvent("chip removed")} />
            <Avatar name="Ana Torres" />
            <Divider spacing="sm" />
          </div>
        </DemoSection>

        <DemoSection title="10. Cards" description="Surface container with optional title.">
          <Card title="Card title">
            <p className="demo-card-text">Card content goes here.</p>
          </Card>
        </DemoSection>

        <DemoSection title="11. Grid Layout" description="Responsive grid with 1, 2 and 3 column variants.">
          <div className="demo-grid-stack">
            <Grid columns={1}>
              <Card title="1 column">Full width</Card>
            </Grid>
            <Grid columns={2}>
              <Card title="2 columns">A</Card>
              <Card title="2 columns">B</Card>
            </Grid>
            <Grid columns={3}>
              <Card title="3 columns">A</Card>
              <Card title="3 columns">B</Card>
              <Card title="3 columns">C</Card>
            </Grid>
          </div>
        </DemoSection>

        <DemoSection
          title="12. Table Grid"
          description="Responsive table with loading, error and empty states."
          eventOutput={`state="${tableState}"`}
        >
          <div className="demo-stack">
            <div className="demo-stack-row">
              <Button variant="secondary" onClick={() => setTableState("data")}>Data</Button>
              <Button variant="secondary" onClick={() => setTableState("loading")}>Loading</Button>
              <Button variant="secondary" onClick={() => setTableState("error")}>Error</Button>
              <Button variant="secondary" onClick={() => setTableState("empty")}>Empty</Button>
            </div>
            <TableGrid
              columns={demoColumns}
              rows={tableState === "empty" ? [] : demoRows}
              loading={tableState === "loading"}
              error={tableState === "error" ? "Unable to load requests" : undefined}
              onRetry={() => setTableState("data")}
              onRowClick={(row) => console.log("row clicked", row.id)}
              getRowKey={(row) => row.id}
            />
          </div>
        </DemoSection>

        <DemoSection
          title="13. Pagination"
          description="Previous / Next navigation with page indicator."
          currentValue={`page ${page} of 10`}
        >
          <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
        </DemoSection>

        <DemoSection title="14. Loading" description="Spinner shown while data is being fetched.">
          <LoadingSpinner label="Fetching support requests..." />
        </DemoSection>

        <DemoSection title="15. Empty State" description="Shown when a list has no records.">
          <EmptyState title="No requests yet" description="Create your first support request to get started." />
        </DemoSection>

        <DemoSection title="16. Error State" description="Shown when data fails to load, includes retry action.">
          <ErrorState onRetry={() => setButtonEvent("retry clicked")} />
        </DemoSection>

        <DemoSection
          title="17. Confirmation Dialog"
          description="Reusable modal for destructive or important actions."
          eventOutput={dialogEvent}
        >
          <Button variant="danger" onClick={() => setDialogOpen(true)}>
            Delete Request
          </Button>
          <ConfirmationDialog
            open={dialogOpen}
            title="Delete this request?"
            description="This action cannot be undone."
            confirmLabel="Delete"
            danger
            onCancel={() => {
              setDialogEvent("cancelled");
              setDialogOpen(false);
            }}
            onConfirm={() => {
              setDialogEvent("confirmed");
              setDialogOpen(false);
            }}
          />
        </DemoSection>
      </div>
    </AppLayout>
  );
}
