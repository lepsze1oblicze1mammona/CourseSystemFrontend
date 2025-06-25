import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../Style/RemoveStudent.css";

interface Student {
  id: number;
  imie: string;
  nazwisko: string;
  email: string;
  klasa: string;
}

type SortKey = 'nazwisko' | 'imie' | 'klasa';

const RemoveStudent = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>('nazwisko');

  useEffect(() => {
    const fetchStudents = async () => {
      if (!courseId) return;

      setLoading(true);
      setError(null);

      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('/specialtreatment/kursstudents', {
          params: { kurs_id: Number(courseId) },
          headers: { Authorization: `Bearer ${token}` }
        });

        // Upewniamy się, że dane to tablica
        const fetchedStudents = Array.isArray(response.data) ? response.data : [];
        setStudents(fetchedStudents);
      } catch (err: any) {
        const msg = err.response?.data?.error || 'Błąd podczas pobierania listy uczniów.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId]);

  const sortedStudents = [...students].sort((a, b) => {
    const getField = (student: Student, key: SortKey) => {
      const val = student[key];
      return typeof val === 'string' ? val : '';
    };
    return getField(a, sortBy).localeCompare(getField(b, sortBy));
  });

  const handleDeleteStudent = async (studentEmail: string) => {
    if (!courseId) {
      alert('Nie znaleziono ID kursu!');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      await axios.post('/kurs/remove', {
        kurs_id: Number(courseId),
        student_login: studentEmail,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Usuń lokalnie ucznia z listy po powodzeniu
      setStudents(prev => prev.filter(s => s.email !== studentEmail));
      alert(`Usunięto ucznia: ${studentEmail} z kursu.`);
    } catch {
      alert('Wystąpił błąd podczas usuwania ucznia z kursu.');
    }
  };

  if (loading) return <div>Ładowanie uczniów...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="remove-students-container">
      <button
        className="remove-students-back-btn"
        onClick={() => navigate(`/tc/${courseId}`)}
      >
        Powrót do szczegółów kursu
      </button>
      <h2 className="remove-students-title">Usuń ucznia z kursu</h2>

      <div className="sort-controls">
        <label>Sortuj według: </label>
        {(['nazwisko', 'imie', 'klasa'] as SortKey[]).map(key => (
          <button
            key={key}
            className="sort-btn"
            onClick={() => setSortBy(key)}
            disabled={sortBy === key}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="students-list">
        {students.length === 0 ? (
          <div className="no-students">Brak uczniów zapisanych do tego kursu.</div>
        ) : (
          sortedStudents.map(student => (
            <div key={student.id} className="student-card">
              <div className="student-info">
                <div className="student-name">{student.nazwisko} {student.imie}</div>
                <div className="student-class">Klasa: {student.klasa}</div>
                <div className="student-email">{student.email}</div>
              </div>
              <button
                className="remove-student-btn"
                onClick={() => handleDeleteStudent(student.email)}
              >
                Usuń
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RemoveStudent;
