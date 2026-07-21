import "./Divider.css";

export interface DividerProps {
  spacing?: "sm" | "md" | "lg";
}

export function Divider({ spacing = "md" }: DividerProps) {
  return <hr className={`divider divider-${spacing}`} />;
}
