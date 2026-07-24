import { useId } from "react";
import "./Checkbox.css";

export interface CheckboxProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Checkbox({ label, checked, disabled, onChange }: CheckboxProps) {
  const id = useId();

  return (
    <label className="checkbox" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
