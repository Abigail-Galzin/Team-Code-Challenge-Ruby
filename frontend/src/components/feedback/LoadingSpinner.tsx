import "./LoadingSpinner.css";

export interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner" role="status">
      <span className="loading-spinner-icon" aria-hidden="true" />
      <span className="loading-spinner-label">{label}</span>
    </div>
  );
}
