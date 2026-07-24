import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Header } from "./Header";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";
import { PageContainer } from "./PageContainer";
import "./AppLayout.css";

export interface AppLayoutProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: ReactNode;
  children: ReactNode;
}

export function AppLayout({ title, description, breadcrumbs, actions, children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <Navbar />
      <PageContainer>
        <Breadcrumb items={breadcrumbs} />
        <Header title={title} description={description} actions={actions} />
        <section className="app-layout-content">{children}</section>
      </PageContainer>
      <footer className="app-footer">
        <div className="app-footer-inner">SupportFlow &mdash; internal support tracking</div>
      </footer>
    </div>
  );
}
