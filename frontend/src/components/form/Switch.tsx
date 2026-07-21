import { useId } from "react";
import "./Switch.css";

export interface SwitchProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Switch({ label, checked, disabled, onChange }: SwitchProps) {
  const id = useId();

  return (
    <label className="switch-field" htmlFor={id}>
      <span
        className={`switch-track ${checked ? "switch-track-on" : ""}`}
        data-disabled={disabled}
      >
        <input
          id={id}
          type="checkbox"
          className="switch-input"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.checked)}
        />
        <span className="switch-thumb" />
      </span>
      <span>{label}</span>
    </label>
  );
}
