import { Link } from "react-router-dom";
import "./Breadcrumb.css";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="breadcrumb-item">
              {item.to && !isLast ? (
                <Link to={item.to} className="breadcrumb-link">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb-current">{item.label}</span>
              )}
              {!isLast && <span className="breadcrumb-separator">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
