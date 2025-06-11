import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Student {
  id: number;
  email: string;
  imie: string;
  nazwisko: string;
  klasa: string;
}

const Students: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {};           //axios

    if (courseId) fetchStudents();
  }, [courseId]);

  if (loading) return <div>Ładowanie uczniów...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h3>Uczniowie zapisani do kursu</h3>
      {students.length === 0 ? (
        <div>Brak uczniów zapisanych do tego kursu.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
