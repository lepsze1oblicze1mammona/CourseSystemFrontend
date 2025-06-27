import React, { useEffect, useState } from "react";
import { useParams, useOutletContext, useNavigate, Outlet, useMatch } from "react-router-dom";
import axios from "axios";
import "../../Style/AssignmentDetails.css";

interface Assignment {
  id: number;
  kurs_id: number;
  nazwa: string;
  opis: string;
  termin_realizacji: string;
}

interface Student {
  id: number;
  email: string;
  imie: string;
  nazwisko: string;
  klasa: string;
}

interface OutletContextType {
  assignments: Assignment[];
}

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

function isOnTime(time_of_upload: string | null, deadline: string): string {
  if (!time_of_upload) return "—";
  const uploadDate = new Date(time_of_upload);
  const deadlineDate = new Date(deadline);
  return uploadDate <= deadlineDate ? "Tak" : "Nie";
}

const AssignmentDetails: React.FC = () => {
  const { assignmentId, courseId } = useParams<{ assignmentId: string, courseId: string }>();
  const navigate = useNavigate();
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const assignments = outletContext?.assignments ?? [];
  const [assignment, setAssignment] = useState<Assignment | null>(
    assignments.find(a => a.id === Number(assignmentId)) ?? null
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Record<number, any>>({});

  // Sprawdź, czy jesteś na podstronie remove lub reschedule
  const isRemove = useMatch("/tc/:courseId/assignments/:assignmentId/remove");
  const isReschedule = useMatch("/tc/:courseId/assignments/:assignmentId/reschedule");

  // Pobierz zadanie jeśli nie ma go w context
  useEffect(() => {
    if (!assignment && assignmentId) {
      const fetchAssignment = async () => {
        try {
          const token = sessionStorage.getItem("token");
          const response = await axios.get(`/specialtreatment/task/${assignmentId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAssignment(response.data);
        } catch (error) {
          setError("Nie znaleziono zadania.");
        }
      };
      fetchAssignment();
    }
  }, [assignment, assignmentId]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("/specialtreatment/kursstudents", {
          params: { kurs_id: Number(courseId) },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudents(response.data || []);
        setError(null);
      } catch (err: any) {
        const msg = err.response?.data?.error || "Nie udało się pobrać listy uczniów.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchStudents();
    }
  }, [courseId]);

  // Pobierz statusy oddania dla każdego studenta
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!assignment || students.length === 0) return;
      const token = sessionStorage.getItem("token");
      const submissionsObj: Record<number, any> = {};
      await Promise.all(students.map(async (student) => {
        try {
          const res = await axios.get('/zadanie/check', {
            params: {
              student_login: student.email,
              kurs_id: assignment.kurs_id,
              zadanie_id: assignment.id,
            },
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
          submissionsObj[student.id] = parsed;
        } catch (e) {
          submissionsObj[student.id] = null;
        }
      }));
      setSubmissions(submissionsObj);
    };

    fetchSubmissions();
  }, [assignment, students]);

  if (error) return <div className="error-message">{error}</div>;
  if (!assignment) return <div className="loading-message">Ładowanie zadania...</div>;

  return (
    <div className="assignment-details-container">
      <div className="assignment-details-content">
        {(isRemove || isReschedule) ? (
          <Outlet context={{ assignment }} />
        ) : (
          <>
            <button
              className="assignment-details-back-btn"
              onClick={() => navigate(`/tc/${courseId}`)}
            >
              Powrót do listy zadań
            </button>

            <h2 className="assignment-details-title">{assignment.nazwa}</h2>
            <div className="assignment-description">
              <b>Opis:</b><br />
              {assignment.opis}
            </div>
            <div className="assignment-deadline">
              <b>Termin oddania:</b> {formatDateTime(assignment.termin_realizacji)}
            </div>

            <h3 className="students-list-title">Lista studentów</h3>
            {loading ? (
              <div className="loading-message">Ładowanie uczniów...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : students.length === 0 ? (
              <div className="no-students">Brak uczniów zapisanych do tego kursu.</div>
            ) : (
              <table className="assignment-students-table">
                <thead>
                  <tr>
                    <th>Lp</th>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Data oddania</th>
                    <th>Oddane w terminie</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => {
                    const submission = submissions[student.id];
                    let status = "Brak informacji";
                    let time = "";
                    let onTime = "—";
                    if (submission) {
                      if (submission.result === "OK" && submission.time_of_upload) {
                        status = "Oddane";
                        time = formatDateTime(submission.time_of_upload);
                        onTime = isOnTime(submission.time_of_upload, assignment.termin_realizacji);
                      } else if (submission.result === "Brak pliku") {
                        status = "Nieoddane";
                      } else if (submission.result === "Termin przekroczony" && submission.time_of_check) {
                        status = "Oddane";
                        time = formatDateTime(submission.time_of_check);
                        onTime = "Nie";
                      }
                    }
                    return (
                      <tr key={student.id}>
                        <td>{idx + 1}</td>
                        <td>{student.imie} {student.nazwisko}</td>
                        <td className={
                          status === "Oddane" ? "status-oddane" :
                          status === "Nieoddane" ? "status-nieoddane" :
                          status === "Oddane po terminie" ? "status-late" :
                          "status-unknown"
                        }>
                          {status}
                        </td>
                        <td>{time}</td>
                        <td>{onTime}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
      <div className="assignment-actions-sidebar">
        <h3 className="assignment-actions-title">Akcje zadania</h3>
        <button
          className="assignment-action-btn"
          onClick={() => navigate(`remove`)}
        >
          Usuń zadanie
        </button>
        <button
          className="assignment-action-btn"
          onClick={() => navigate(`reschedule`)}
        >
          Zmień datę zadania
        </button>
      </div>
    </div>
  );
};

export default AssignmentDetails;