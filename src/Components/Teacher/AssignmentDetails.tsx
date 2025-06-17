import React, { useEffect, useState } from "react";
import { useParams, useOutletContext, useNavigate, Outlet, useMatch } from "react-router-dom";
import axios from "axios";

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
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year}, ${hours}:${minutes}`;
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

  // Sprawdź, czy jesteś na podstronie remove lub reschedule
  const isRemove = useMatch("/tc/:courseId/assignments/:assignmentId/remove");
  const isReschedule = useMatch("/tc/:courseId/assignments/:assignmentId/reschedule");

  // Pobierz zadanie jeśli nie ma go w context
  useEffect(() => {
    if (!assignment && assignmentId) {
      const fetchAssignment = async () => {
        try {
          const token = localStorage.getItem("token");
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

  // Pobierz studentów do kursu
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/specialtreatment/allstudents", {
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

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!assignment) return <div>Ładowanie zadania...</div>;

  return (
    <div style={{ display: "flex" }}>
      {/* Główna zawartość po lewej */}
      <div style={{ flex: 1, marginRight: 24 }}>
        {(isRemove || isReschedule) ? (
          <Outlet context={{ assignment }} />
        ) : (
          <>
            <button
              onClick={() => navigate(`/tc/${courseId}`)}
              style={{
                marginBottom: "1rem",
                padding: "0.5rem 1rem",
                background: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Powrót do listy zadań
            </button>

            <h2>{assignment.nazwa}</h2>
            <div style={{ marginBottom: 12 }}>
              <b>Opis:</b><br />
              {assignment.opis}
            </div>
            <div style={{ marginBottom: 24 }}>
              <b>Termin oddania:</b> {formatDateTime(assignment.termin_realizacji)}
            </div>

            <h3>Lista studentów</h3>
            {loading ? (
              <div>Ładowanie uczniów...</div>
            ) : error ? (
              <div style={{ color: "red" }}>{error}</div>
            ) : students.length === 0 ? (
              <div>Brak uczniów zapisanych do tego kursu.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Lp</th>
                    <th>Student</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={student.id}>
                      <td style={{ textAlign: "center" }}>{idx + 1}</td>
                      <td>{student.imie} {student.nazwisko}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
      {/* Boczne menu po prawej */}
      <div
        style={{
          minWidth: 180,
          marginLeft: 24,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          borderLeft: "1px solid #eee",
          paddingLeft: 16
        }}
      >
        <button
          style={{
            padding: "0.5rem 1rem",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}
          onClick={() => navigate(`remove`)}
        >
          Usuń zadanie
        </button>
        <button
          style={{
            padding: "0.5rem 1rem",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}
          onClick={() => navigate(`reschedule`)}
        >
          Zmień datę zadania
        </button>
      </div>
    </div>
  );
};

export default AssignmentDetails;
