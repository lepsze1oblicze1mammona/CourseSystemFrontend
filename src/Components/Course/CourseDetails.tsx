import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet, useMatch } from 'react-router-dom';
import CourseSidebar from './CourseSidebar';
import { clearAuth } from '../../Auth/Auth';
import axios from 'axios';

interface Assignment {
  id: number;
  kurs_id: number;
  nazwa: string;
  opis: string;
  termin_realizacji: string;
}

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const match = useMatch("/courses/:courseId");
  const isMain = !!match;
  const role = localStorage.getItem('role');

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
    navigate(role === 'teacher' ? '/teacher' : '/student');
  };

  if (loading) return <div>Ładowanie zadań...</div>;
  if (!assignments || assignments.length === 0) return <div>Brak zadań dla tego kursu.</div>;

  return (
    <div className="course-details-layout" style={{ display: "flex", minHeight: "80vh" }}>
      {role === "teacher" ? (
        <div style={{ display: "flex", width: '100%' }}>
          <CourseSidebar />
          <div style={{ flex: 1, padding: "2rem" }}>
            <button onClick={handleLogout}>Wyloguj</button>
            <button onClick={moveToDashboard}>Powrót</button>
            <h2>Zadania kursu</h2>
            {!isMain && (
              <button onClick={() => navigate(`/courses/${courseId}`)}>
                Powrót do listy zadań
              </button>
            )}
            <Outlet context={{ assignments }} />
          </div>
        </div>
      ) : role === "student" ? (
        <div style={{ flex: 1, padding: "2rem" }}>
          <button onClick={handleLogout}>Wyloguj</button>
          <button onClick={moveToDashboard}>Powrót</button>
          <h2>Zadania kursu</h2>

          <div className="assignments-container">
            {assignments.map(assignment => (
              <div key={assignment.id} className="assignment-card">
                <h3>{assignment.nazwa}</h3>
                <p>{assignment.opis}</p>
                <div className="assignment-meta">
                  {assignment.termin_realizacji && (
                    <span>Termin: {assignment.termin_realizacji}</span>
                  )}
                  <button
                    onClick={() => navigate(`submit/${assignment.id}`)}
                    style={{
                      alignSelf: 'center',
                      padding: '0.5rem 1rem',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer'
                    }}
                  >
                    Wyślij rozwiązanie
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CourseDetails;
