import type { ReactNode } from "react";
import { Card } from "../../components/layout/Card";
import "./DemoSection.css";

export interface DemoSectionProps {
  title: string;
  description: string;
  children: ReactNode;
  currentValue?: ReactNode;
  eventOutput?: string;
}

export function DemoSection({ title, description, children, currentValue, eventOutput }: DemoSectionProps) {
  return (
    <Card>
      <div className="demo-section">
        <div>
          <h2 className="demo-section-title">{title}</h2>
          <p className="demo-section-description">{description}</p>
        </div>
        <div className="demo-section-live">{children}</div>
        {(currentValue !== undefined || eventOutput !== undefined) && (
          <div className="demo-section-output">
            {currentValue !== undefined && (
              <div className="demo-output-row">
                <span className="demo-output-label">Current value</span>
                <code className="demo-output-value">{currentValue}</code>
              </div>
            )}
            {eventOutput !== undefined && (
              <div className="demo-output-row">
                <span className="demo-output-label">Event output</span>
                <code className="demo-output-value">{eventOutput || "(no events yet)"}</code>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
