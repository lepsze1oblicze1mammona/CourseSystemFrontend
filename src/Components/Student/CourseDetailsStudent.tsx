import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet, useMatch } from 'react-router-dom';
import { clearAuth } from '../../Auth/Auth';
import axios from 'axios';

interface Assignment {
  id: number;
  kurs_id: number;
  nazwa: string;
  opis: string;
  termin_realizacji: string;
}

const CourseDetailsStudent: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const isMain = useMatch("/sc/:courseId");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

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
    navigate('/student');
  };

  if (loading) return <div>Ładowanie zadań...</div>;

  // Jeśli jesteś na głównej ścieżce kursu, pokazuj listę zadań
  if (isMain) {
    return (
      <div style={{ flex: 1, padding: "2rem" }}>
        <button onClick={handleLogout}>Wyloguj</button>
        <button onClick={moveToDashboard}>Powrót</button>
        <h2>Zadania kursu studenta</h2>
        <div className="assignments-container">
          {(!assignments || assignments.length === 0) ? (
            <div>Brak zadań dla tego kursu.</div>
          ) : (
            assignments.map(assignment => (
              <div key={assignment.id} className="assignment-card">
                <h3>{assignment.nazwa}</h3>
                <p>{assignment.opis}</p>
                <div className="assignment-meta">
                  {assignment.termin_realizacji && (
                    <span>
                      Termin realizacji:{" "}
                      {new Intl.DateTimeFormat("pl-PL").format(new Date(assignment.termin_realizacji))}
                    </span>
                  )}

                  <button
                    onClick={() => navigate(`submit/${assignment.id}`, {
                      state: {
                        assignmentName: assignment.nazwa,
                      },
                    })}
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
            ))
          )}
        </div>
      </div>
    );
  }

  // Jeśli jesteś na podstronie (np. submit), pokazuj tylko Outlet (czyli SubmitAssignment)
  return <Outlet />;
};

export default CourseDetailsStudent;
