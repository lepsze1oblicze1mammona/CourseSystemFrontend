import React, { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import CourseTile from "../CourseTile";
import { clearAuth } from "../../Auth/Auth";
import axios from "axios";

interface Course {
  id: number;
  nazwa: string;
}

const TeacherDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const isMain = location.pathname === "/teacher";

  const fetchCourses = useCallback(async () => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!email || !token) {
      console.error("Brak tokenu lub emaila w localStorage");
      return;
    }

    try {
      const response = await axios.get(`/specialtreatment/creator`, {
        params: { login: email },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setCourses(Array.isArray(response.data) ? response.data : []);      //tutaj zmieniłam bo nie było w bazie kursu to zwracało null a nie tablicę
      
    } catch (error) {
      console.error("Błąd podczas pobierania kursów:", error);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div style={{ display: "flex", minHeight: "80vh" }}>
      <TeacherSidebar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <h2>Panel nauczyciela</h2>
        <button onClick={handleLogout}>Wyloguj</button>

        {isMain && (
          <>
            <h3>Twoje kursy</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "24px",
                marginBottom: "32px",
              }}
            >
              {courses.map((course) => (
                <CourseTile
                  key={course.id}
                  courseName={course.nazwa}
                  onClick={() => navigate(`/tc/${course.id}`)}
                />
              ))}
            </div>
          </>
        )}

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
                cursor: "pointer",
              }}
            >
              Powrót do listy kursów
            </button>
            <Outlet context={{ courses, setCourses, refetchCourses: fetchCourses }} />
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
