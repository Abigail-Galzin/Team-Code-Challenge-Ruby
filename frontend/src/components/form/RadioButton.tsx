import type { SelectOption } from "../../types";
import "./RadioButton.css";

export interface RadioButtonProps {
  label: string;
  name: string;
  options: SelectOption[];
  value: string;
  onChange?: (value: string) => void;
}

export function RadioButton({ label, name, options, value, onChange }: RadioButtonProps) {
  return (
    <fieldset className="radio-group">
      <legend className="form-label">{label}</legend>
      <div className="radio-options">
        {options.map((option) => (
          <label key={option.value} className="radio-option">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange?.(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
