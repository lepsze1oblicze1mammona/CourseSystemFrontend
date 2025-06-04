import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import CourseTile from "../CourseTile";
import { clearAuth } from "../../Auth/Auth";

const TeacherDashboard: React.FC = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: "Matematyka podstawowa" },
    { id: 2, name: "Fizyka kwantowa" },
  ]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();           // Czyści token, role, id nauczyciela z localStorage
    navigate("/login");    // Przekierowuje na stronę logowania
  }

 
  const isMain = location.pathname === "/teacher";

  return (
    <div style={{ display: "flex", minHeight: "80vh" }}>
      <TeacherSidebar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <h2>Panel nauczyciela</h2>
        <button onClick={handleLogout}>
          Wyloguj
        </button>

        {isMain && (
          <>
            <h3>Twoje kursy</h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "24px",
              marginBottom: "32px"
            }}>
              {courses.map(course => (
                <CourseTile
                  key={course.id}
                  courseName={course.name}
                  onClick={() => navigate(`/courses/${course.id}`)}
                />
              ))}
            </div>
          </>
        )}

        {/* Przycisk powrotu na podstronach */}
        {!isMain && (
          <>
            <button
              onClick={() => navigate("/teacher")}
              style={{
                marginBottom: "2rem",
                padding: "0.5rem 1.2rem",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Powrót do listy kursów
            </button>
            <Outlet context={{ courses, setCourses }} />
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
