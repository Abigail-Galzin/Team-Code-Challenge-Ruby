import { useId } from "react";
import type { SelectOption } from "../../types";
import { classNames } from "../../utils/format";
import "./FormField.css";

export interface DropdownProps {
  label: string;
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  onChange?: (value: string) => void;
}

export function Dropdown({
  label,
  options,
  value,
  placeholder = "Select an option",
  required,
  disabled,
  error,
  helperText,
  onChange,
}: DropdownProps) {
  const id = useId();

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label}
        {required && <span className="form-required">*</span>}
      </label>
      <select
        id={id}
        className={classNames("form-control", error && "form-control-error")}
        required={required}
        disabled={disabled}
        value={value ?? ""}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange?.(event.target.value)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <span className="form-error">{error}</span>
      ) : (
        helperText && <span className="form-helper">{helperText}</span>
      )}
    </div>
  );
}
