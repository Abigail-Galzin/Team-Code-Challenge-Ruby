import type { ReactNode } from "react";
import "./PageContainer.css";

export interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="page-container">
      <div className="page-container-inner">{children}</div>
    </main>
  );
}
