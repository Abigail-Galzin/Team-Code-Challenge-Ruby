import type { ReactNode } from "react";
import "./Grid.css";

export interface GridProps {
  columns?: 1 | 2 | 3;
  children: ReactNode;
}

export function Grid({ columns = 2, children }: GridProps) {
  return <div className={`grid grid-cols-${columns}`}>{children}</div>;
}
