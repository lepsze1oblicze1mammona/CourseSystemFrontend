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
  const [submissions, setSubmissions] = useState<Record<number, any>>({});
  const [studentLogin, setStudentLogin] = useState<string>("");

  useEffect(() => {
    const login = sessionStorage.getItem('email');
    if (login) setStudentLogin(login);
  }, []);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token || !studentLogin) throw new Error("Brak tokenu lub loginu studenta");

        const response = await axios.get('/specialtreatment/tasks', {
          params: { kurs_id: Number(courseId) },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const assignmentsData = Array.isArray(response.data) ? response.data : [];
        setAssignments(assignmentsData);

        // Pobierz statusy oddania dla każdego zadania
        const submissionsObj: Record<number, any> = {};
        await Promise.all(assignmentsData.map(async (assignment: Assignment) => {
          try {
            const params = {
              student_login: studentLogin,
              kurs_id: assignment.kurs_id,
              zadanie_id: assignment.id,
            };
            const res = await axios.get('/zadanie/check', {
              params,
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            });
            let parsed = null;
            if (res.data && typeof res.data.output === "string") {
              try {
                parsed = JSON.parse(res.data.output);
              } catch {
                parsed = null;
              }
            }
            submissionsObj[assignment.id] = parsed;
          } catch (e) {
            submissionsObj[assignment.id] = null;
          }
        }));
        setSubmissions(submissionsObj);

      } catch (error) {
        console.error("Błąd ładowania zadań:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && studentLogin) {
      loadAssignments();
    } else {
      setLoading(false);
    }
  }, [courseId, studentLogin]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const moveToDashboard = () => {
    navigate('/student');
  };

  const getSubmissionStatus = (assignmentId: number) => {
    return submissions[assignmentId] || null;
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

              // Sprawdź czy jest oddane w terminie lub po terminie
              const isSubmittedOnTime = submission?.result === "OK" && submission?.time_of_upload;
              const isSubmittedLate = submission?.result === "Termin przekroczony" && submission?.time_of_check;

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
                      {isSubmittedOnTime ? (
                        <div className="submission-info">
                          <b>Zadanie oddane:</b>
                          <span className="submission-time"> {formatDateTime(submission.time_of_upload)}</span>
                          {getOnTimeStatus(submission.time_of_upload, assignment.termin_realizacji)}
                        </div>
                      ) : isSubmittedLate ? (
                        <div className="submission-info">
                          <b>Zadanie oddane po terminie:</b>
                          <span className="submission-time"> {formatDateTime(submission.time_of_check)}</span>
                          <span style={{ color: 'red', fontWeight: 500, marginLeft: 8 }}>
                            Oddane po terminie
                          </span>
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