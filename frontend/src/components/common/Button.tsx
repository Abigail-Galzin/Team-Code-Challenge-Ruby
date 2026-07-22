import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "../../utils/format";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary" | "danger";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  variant?: ButtonVariant;
  loading?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  loading = false,
  disabled = false,
  onClick,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={classNames("btn", `btn-${variant}`, loading && "btn-loading", className)}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      <span className="btn-label">{children}</span>
    </button>
  );
}
