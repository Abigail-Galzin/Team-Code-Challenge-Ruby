import "./Avatar.css";

export interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return initials.join("");
}

export function Avatar({ name, size = "md" }: AvatarProps) {
  return (
    <span className={`avatar avatar-${size}`} title={name}>
      {getInitials(name)}
    </span>
  );
}
