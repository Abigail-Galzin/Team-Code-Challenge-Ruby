import type { ReactNode } from "react";

export * from "./support";
export * from "./pagination";
export * from "./mock";
export * from "./dashboard";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface TableColumn<T> {
  header: string;
  field: keyof T | string;
  align?: "left" | "center" | "right";
  width?: string;
  formatter?: (row: T) => ReactNode;
}
