import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { to: "/teacher/add-course", label: "Dodaj kurs" },
  { to: "/teacher/remove-course", label: "Usuń kurs" },
  { to: "/teacher/rename-course", label: "Zmień nazwę kursu" },
];

const TeacherSidebar: React.FC = () => (
  <nav className="teacher-sidebar-top">
    <ul>
      {menuItems.map(item => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            className={({ isActive }) => isActive ? "active" : ""}
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

export default TeacherSidebar;
