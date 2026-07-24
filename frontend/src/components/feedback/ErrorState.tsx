import { Button } from "../common/Button";
import "./ErrorState.css";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="error-state">
      <div className="error-state-icon" aria-hidden="true">
        !
      </div>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-description">{description}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
