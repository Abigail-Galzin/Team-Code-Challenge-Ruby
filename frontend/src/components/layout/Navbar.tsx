import { NavLink } from "react-router-dom";
import { classNames } from "../../utils/format";
import "./Navbar.css";

const navLinks = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/requests", label: "Requests", end: false },
  { to: "/team-members", label: "Team Members", end: false },
  { to: "/components", label: "Components Demo", end: false },
];

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <span className="navbar-brand">SupportFlow</span>
        <nav className="navbar-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => classNames("navbar-link", isActive && "navbar-link-active")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
