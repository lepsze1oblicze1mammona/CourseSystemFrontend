import React from "react";
import { NavLink, useParams } from "react-router-dom";

const menuItems = [
  { to: "students", label: "Uczniowie" },
  { to: "add-student", label: "Dodaj ucznia" },
  { to: "remove-student", label: "Usuń ucznia" },
  { to: "add-assignment", label: "Dodaj zadanie" },
  { to: "remove-assignment", label: "Usuń zadanie" },
  { to: "reschedule-assignment", label: "Zmień datę zadania" }
];

const CourseSidebar: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  return (
    <nav className="course-sidebar">
      <ul>
        {menuItems.map(item => (
          <li key={item.to}>
            <NavLink
              to={`/courses/${courseId}/${item.to}`}
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
