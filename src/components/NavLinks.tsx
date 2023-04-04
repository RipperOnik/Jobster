import React from "react";
import links from "../utils/links";
import { NavLink } from "react-router-dom";
interface NavLinksProps {
  toggleSidebar?: () => void;
}

export default function NavLinks({ toggleSidebar }: NavLinksProps) {
  return (
    <div className="nav-links">
      {links.map((link) => {
        const { text, path, id, icon } = link;
        return (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={toggleSidebar && toggleSidebar}
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
}
