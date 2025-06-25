import React, { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import CourseTile from "../CourseTile";
import { clearAuth } from "../../Auth/Auth";
import axios from "axios";
import "../../Style/TeacherDashboard.css";

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
    const email = sessionStorage.getItem("email");
    const token = sessionStorage.getItem("token");

    if (!email || !token) {
      console.error("Brak tokenu lub emaila w sessionStorage");
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
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Błąd podczas pobierania kursów:", error);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="teacher-dashboard-main">
      <TeacherSidebar />
      <div className="teacher-dashboard-content">
        <div className="teacher-dashboard-header-row">
          <h2 className="teacher-dashboard-title">Panel nauczyciela</h2>
          <div className="teacher-dashboard-header-btns">
            {!isMain && (
              <button
                className="teacher-dashboard-btn-back"
                onClick={() => navigate("/teacher")}
              >
                Powrót do listy kursów
              </button>
            )}
            <button className="teacher-dashboard-btn-logout" onClick={handleLogout}>
              Wyloguj
            </button>
          </div>
        </div>

        {isMain && (
          <>
            <h3 className="teacher-dashboard-section-title">Twoje kursy</h3>
            <div className="teacher-dashboard-courses-container">
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
          <Outlet context={{ courses, setCourses, refetchCourses: fetchCourses }} />
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
