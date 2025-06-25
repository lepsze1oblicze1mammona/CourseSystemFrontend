import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet, useMatch } from 'react-router-dom';
import CourseSidebar from '../Course/CourseSidebar';
import { clearAuth } from '../../Auth/Auth';
import axios from 'axios';
import "../../Style/CourseDetailsTeacher.css";

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
  const isMain = !!useMatch("/tc/:courseId");

  // Funkcja do pobierania zadań
  const loadAssignments = async () => {
    try {
      const token = sessionStorage.getItem('token');
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

  // Pobierz zadania przy montowaniu komponentu
  useEffect(() => {
    if (courseId) {
      loadAssignments();
    }
  }, [courseId]);

  // Pobierz zadania przy powrocie do głównej ścieżki
  useEffect(() => {
    if (isMain) {
      loadAssignments();
    }
  }, [isMain]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const moveToDashboard = () => {
    navigate('/teacher');
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
  }

  if (loading) return <div>Ładowanie zadań...</div>;

  return (
    <div className="course-details-layout">
      <CourseSidebar />
      <div className="course-details-content">
        <div className="course-details-header">
          <button className="course-details-btn course-details-btn-back" onClick={moveToDashboard}>
            Powrót do listy kursów
          </button>
          <button className="course-details-btn course-details-btn-logout" onClick={handleLogout}>
            Wyloguj
          </button>
        </div>
        
        {isMain && (
          <>
            <h2 className="course-details-title">Zadania kursu</h2>
            <div className="assignments-container">
              {assignments.length === 0 ? (
                <div className="no-assignments">Brak zadań w tym kursie.</div>
              ) : (
                assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="assignment-card"
                    onClick={() => navigate(`/tc/${courseId}/assignments/${assignment.id}`)}
                  >
                    <h3 className="assignment-title">{assignment.nazwa}</h3>
                    <div className="assignment-meta">
                      <div className="assignment-deadline">
                        Termin: {formatDate(assignment.termin_realizacji)}
                      </div>
                      <p className="assignment-description">{assignment.opis}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        
        {!isMain && !loading && (
          <Outlet context={{ assignments }} />
        )}
      </div>
    </div>
  );
};

export default CourseDetailsTeacher;
