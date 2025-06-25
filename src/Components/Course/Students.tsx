import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Style/Students.css";

interface Student {
  id: number;
  email: string;
  imie: string;
  nazwisko: string;
  klasa: string;
}

const Students: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const fetchedStudents = Array.isArray(response.data) ? response.data : [];
        setStudents(fetchedStudents);
        setError(null);
      } catch (err: any) {
        console.error("Błąd podczas pobierania uczniów:", err);
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

  if (loading) return <div>Ładowanie uczniów...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="students-container">
      <button
        className="students-back-btn"
        onClick={() => navigate(`/tc/${courseId}`)}
      >
        Powrót do szczegółów kursu
      </button>
      
      <h3 className="students-title">Uczniowie zapisani do kursu</h3>
      
      {students.length === 0 ? (
        <div className="no-students">Brak uczniów zapisanych do tego kursu.</div>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>Email</th>
              <th>Klasa</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.imie}</td>
                <td>{student.nazwisko}</td>
                <td>{student.email}</td>
                <td>{student.klasa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Students;
