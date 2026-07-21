import type { ReactNode } from "react";
import "./Alert.css";

export type AlertVariant = "success" | "warning" | "error" | "info";

export interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: ReactNode;
}

const variantIcon: Record<AlertVariant, string> = {
  success: "✓",
  warning: "⚠",
  error: "✕",
  info: "ℹ",
};

export function Alert({ variant, title, children }: AlertProps) {
  return (
    <div className={`alert alert-${variant}`} role="alert">
      <span className="alert-icon" aria-hidden="true">
        {variantIcon[variant]}
      </span>
      <div className="alert-content">
        {title && <p className="alert-title">{title}</p>}
        <p className="alert-message">{children}</p>
      </div>
    </div>
  );
}
