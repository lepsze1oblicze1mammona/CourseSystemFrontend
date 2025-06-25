import React from "react";
import { NavLink, useParams } from "react-router-dom";
import "../../Style/CourseSidebar.css";

const menuItems = [
  { to: "students", label: "Uczniowie" },
  { to: "add-student", label: "Dodaj ucznia" },
  { to: "remove-student", label: "Usuń ucznia" },
  { to: "add-assignment", label: "Dodaj zadanie" }
];

const CourseSidebar: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  return (
    <nav className="course-sidebar">
      <ul>
        {menuItems.map(item => (
          <li key={item.to}>
            <NavLink
              to={`/tc/${courseId}/${item.to}`}
              className={({ isActive }) => isActive ? "active" : ""}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CourseSidebar;
