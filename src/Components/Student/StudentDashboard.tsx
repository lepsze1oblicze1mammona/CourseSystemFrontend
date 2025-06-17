import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CourseTile from "../CourseTile";
import { clearAuth } from "../../Auth/Auth";
import axios from "axios";

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
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

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

  if (loading) return <div>Ładowanie kursów...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ display: "flex", minHeight: "80vh" }}>
      <div style={{ flex: 1, padding: "2rem" }}>
        <h2>Panel studenta</h2>
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
              {courses.length > 0 ? (
                courses.map((course) => (
                  <CourseTile
                    key={course.id}
                    courseName={course.nazwa}
                    onClick={() => navigate(`/sc/${course.id}`)}
                  />
                ))
              ) : (
                <p>Brak kursów</p>
              )}
            </div>
          </>
        )}

        {!isMain && (
          <button
            onClick={() => navigate("/student")}
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
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
