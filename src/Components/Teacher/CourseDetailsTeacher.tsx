import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet, useMatch } from 'react-router-dom';
import CourseSidebar from '../Course/CourseSidebar';
import { clearAuth } from '../../Auth/Auth';
import axios from 'axios';

interface Assignment {
  id: number;
  kurs_id: number;
  nazwa: string;
  opis: string;
  termin_realizacji: string;
}

const CourseDetailsTeacher: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const match = useMatch("/tc/:courseId");
  const isMain = !!match;

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Brak tokenu");

        const response = await axios.get('/specialtreatment/tasks', {
          params: { kurs_id: Number(courseId) },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        setAssignments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Błąd ładowania zadań:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadAssignments();
    } else {
      setLoading(false);
    }
  }, [courseId]);

  

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const moveToDashboard = () => {
    navigate('/teacher');
  };

  if (loading) return <div>Ładowanie zadań...</div>;

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

  return (
  <div className="course-details-layout" style={{ display: "flex", minHeight: "80vh" }}>
    <div style={{ display: "flex", width: '100%' }}>
      <CourseSidebar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <button onClick={handleLogout}>Wyloguj</button>
        <button onClick={moveToDashboard}>Powrót do listy kursów</button>
        {isMain && (
          <>
            <h2>Zadania kursu</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", margin: "1rem 0" }}>
              {assignments.length === 0 && (
                <div>Brak zadań w tym kursie.</div>
              )}
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  style={{
                    background: "#f5f5f5",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "1rem",
                    minWidth: "220px",
                    maxWidth: "260px",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                  }}
                  onClick={() => navigate(`/tc/${courseId}/assignments/${assignment.id}`)}
                >
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>{assignment.nazwa}</h3>
                  <div style={{ fontSize: "0.95em", marginBottom: "0.5rem", color: "#666" }}>
                    Termin: {formatDate(assignment.termin_realizacji)}
                  </div>
                  <div style={{ fontSize: "0.95em" }}>
                    {assignment.opis}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
          {!isMain && !loading &&  (
            <Outlet context={{ assignments }} />
          )}
      </div>
    </div>
  </div>
);
};

export default CourseDetailsTeacher;
