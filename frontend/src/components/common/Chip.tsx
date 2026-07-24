import "./Chip.css";

export interface ChipProps {
  label: string;
  onRemove?: () => void;
}

export function Chip({ label, onRemove }: ChipProps) {
  return (
    <span className="chip">
      {label}
      {onRemove && (
        <button type="button" className="chip-remove" aria-label={`Remove ${label}`} onClick={onRemove}>
          ×
        </button>
      )}
    </span>
  );
}
