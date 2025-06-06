import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CourseTile from "../CourseTile";
import { clearAuth } from "../../Auth/Auth";
import { Course } from "../../types/courseTypes";
import { mockCourses } from "../../services/mockData";

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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Po prostu ustawiamy wszystkie kursy
        setCourses(mockCourses);
        setLoading(false);
      } catch (err) {
        setError("Błąd ładowania kursów");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
              {courses.map((course) => (
                <CourseTile
                  key={course.id}
                  courseName={course.name}
                  onClick={() => navigate(`/courses/${course.id}`)}
                />
              ))}
              {courses.length === 0 && <p>Brak kursów</p>}
            </div>
          </>
        )}

        {!isMain && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
