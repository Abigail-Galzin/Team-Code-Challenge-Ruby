import type { TextareaHTMLAttributes } from "react";
import { useId } from "react";
import { classNames } from "../../utils/format";
import "./FormField.css";

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label: string;
  rows?: number;
  helperText?: string;
  error?: string;
  onChange?: (value: string) => void;
}

export function TextArea({
  label,
  rows = 4,
  helperText,
  error,
  required,
  id,
  onChange,
  ...rest
}: TextAreaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={inputId}>
        {label}
        {required && <span className="form-required">*</span>}
      </label>
      <textarea
        id={inputId}
        rows={rows}
        className={classNames("form-control", error && "form-control-error")}
        required={required}
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
