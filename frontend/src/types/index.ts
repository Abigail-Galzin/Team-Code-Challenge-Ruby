import type { ReactNode } from "react";

export * from "./support";

export interface SelectOption {
  label: string;
  value: string;
}

export interface TableColumn<T> {
  header: string;
  field: keyof T | string;
  align?: "left" | "center" | "right";
  width?: string;
  formatter?: (row: T) => ReactNode;
}
