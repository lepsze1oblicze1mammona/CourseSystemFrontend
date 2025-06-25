import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet, useMatch } from 'react-router-dom';
import { clearAuth } from '../../Auth/Auth';
import axios from 'axios';
import "../../Style/CourseDetailsStudent.css";

interface Assignment {
  id: number;
  kurs_id: number;
  nazwa: string;
  opis: string;
  termin_realizacji: string;
}

// Stała z odpowiedziami backendu dla statusu oddania zadań
const studentSubmissions: Record<number, { output: string }> = {
  1: { output: '{"result": "Brak pliku", "time_of_upload": null}' },
  2: { output: '{"result": "OK", "time_of_upload": "2025-06-27T12:40:25.917678Z"}' },
  3: { output: '{"result": "OK", "time_of_upload": "2025-06-25T12:40:25.917678Z"}' },
  4: { output: '{"result": "OK", "time_of_upload": "2025-06-27T12:40:25.917678Z"}' },
};

// Funkcja formatująca datę (UTC)
function formatDateTime(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

function getOnTimeStatus(time_of_upload: string, deadline: string) {
  if (!time_of_upload || !deadline) return null;
  const uploadDate = new Date(time_of_upload);
  const deadlineDate = new Date(deadline);
  if (uploadDate <= deadlineDate) {
    return (
      <span style={{ color: 'green', fontWeight: 500, marginLeft: 8 }}>
        Oddane w terminie
      </span>
    );
  } else {
    return (
      <span style={{ color: 'red', fontWeight: 500, marginLeft: 8 }}>
        Oddane po terminie
      </span>
    );
  }
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

  const getSubmissionStatus = (assignmentId: number) => {
    const submission = studentSubmissions[assignmentId];
    if (!submission) return null;
    try {
      return JSON.parse(submission.output);
    } catch (e) {
      console.error("Błąd parsowania odpowiedzi", e);
      return null;
    }
  };

  if (loading) return <div className="loading-message">Ładowanie zadań...</div>;

  if (isMain) {
    return (
      <div className="course-details-container">
        <div className="course-details-header">
        <button className="course-details-btn course-details-btn-back" onClick={moveToDashboard}>
          Powrót
        </button>
        <button className="course-details-btn course-details-btn-logout" onClick={handleLogout}>
          Wyloguj
        </button>
      </div>
        
        <h2 className="course-details-title">Zadania kursu studenta</h2>
        
        <div className="assignments-container">
          {(!assignments || assignments.length === 0) ? (
            <div className="no-assignments">Brak zadań dla tego kursu.</div>
          ) : (
            assignments.map(assignment => {
              const submission = getSubmissionStatus(assignment.id);
              const isSubmitted = submission?.result === "OK" && submission?.time_of_upload;

              return (
                <div key={assignment.id} className="assignment-card">
                  <h3 className="assignment-title">{assignment.nazwa}</h3>
                  <p className="assignment-description">{assignment.opis}</p>
                  
                  <div className="assignment-meta">
                    {assignment.termin_realizacji && (
                      <div className="assignment-deadline">
                        <b>Termin realizacji:</b> {formatDateTime(assignment.termin_realizacji)}
                      </div>
                    )}

                    <div style={{ marginTop: '0.5rem' }}>
                      {isSubmitted ? (
                        <div className="submission-info">
                          <b>Zadanie oddane:</b> 
                          <span className="submission-time"> {formatDateTime(submission.time_of_upload)}</span>
                          {getOnTimeStatus(submission.time_of_upload, assignment.termin_realizacji)}
                        </div>
                      ) : (
                        <button
                          className="assignment-submit-btn"
                          onClick={() => navigate(`submit/${assignment.id}`, {
                            state: {
                              assignmentName: assignment.nazwa,
                            },
                          })}
                        >
                          Wyślij rozwiązanie
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default CourseDetailsStudent;
