import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import { classNames } from "../../utils/format";
import "./FormField.css";

export type TextBoxType = "text" | "email" | "password" | "number" | "date";

export interface TextBoxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label: string;
  type?: TextBoxType;
  helperText?: string;
  error?: string;
  onChange?: (value: string) => void;
}

export function TextBox({
  label,
  type = "text",
  helperText,
  error,
  required,
  disabled,
  value,
  onChange,
  id,
  ...rest
}: TextBoxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={inputId}>
        {label}
        {required && <span className="form-required">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        className={classNames("form-control", error && "form-control-error")}
        required={required}
        disabled={disabled}
        value={value}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange?.(event.target.value)}
        {...rest}
      />
      {error ? (
        <span className="form-error">{error}</span>
      ) : (
        helperText && <span className="form-helper">{helperText}</span>
      )}
    </div>
  );
}
