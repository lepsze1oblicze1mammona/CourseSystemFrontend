import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CourseTile from "../CourseTile";
import { clearAuth } from "../../Auth/Auth";
import axios from "axios";
import "../../Style/StudentDashboard.css";

interface Course {
  id: number;
  nazwa: string;
  wlasciciel: number;
}

const StudentDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const isMain = location.pathname === "/student";

  const fetchCourses = useCallback(async () => {
    const email = sessionStorage.getItem("email");
    const token = sessionStorage.getItem("token");

    if (!email || !token) {
      setError("Brak tokenu lub loginu");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/specialtreatment/studentcourses`, {
        params: { login: email },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Błąd ładowania kursów");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (loading) return <div className="student-dash-loading">Ładowanie kursów...</div>;
  if (error) return <div className="student-dash-error">{error}</div>;

  return (
    <div className="student-dash-container">
      <div className="student-dash-header">
        <h2 className="student-dash-title">Panel studenta</h2>
        <button className="student-dash-logout-btn" onClick={handleLogout}>
          Wyloguj
        </button>
      </div>

      {isMain ? (
        <>
          <h3 className="student-dash-section-title">Twoje kursy</h3>
          <div className="student-dash-courses-container">
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseTile
                  key={course.id}
                  courseName={course.nazwa}
                  onClick={() => navigate(`/sc/${course.id}`)}
                />
              ))
            ) : (
              <p className="student-dash-no-courses">Brak kursów</p>
            )}
          </div>
        </>
      ) : (
        <button
          className="student-dash-back-btn"
          onClick={() => navigate("/student")}
        >
          Powrót do listy kursów
        </button>
      )}
    </div>
  );
};

export default StudentDashboard;
