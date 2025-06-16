import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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
        const token = localStorage.getItem('token');
        const response = await axios.get<Student[]>('/specialtreatment/kursstudents', {
          params: { kurs_id: Number(courseId) },
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(response.data);
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
      const token = localStorage.getItem('token');
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
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="remove-students-container">
      <h2>Usuń ucznia z kursu</h2>

      <div className="sort-controls" style={{ marginBottom: '1rem' }}>
        <label>Sortuj według: </label>
        {(['nazwisko', 'imie', 'klasa'] as SortKey[]).map(key => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            disabled={sortBy === key}
            style={{
              margin: '0 4px',
              padding: '4px 8px',
              backgroundColor: sortBy === key ? '#2196F3' : '#f0f0f0',
              color: sortBy === key ? 'white' : 'black',
              cursor: sortBy === key ? 'default' : 'pointer',
            }}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="students-list">
        {sortedStudents.map(student => (
          <div
            key={student.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              margin: '8px 0',
              border: '2px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white',
            }}
          >
            <div>
              <div style={{ fontWeight: 500 }}>
                {student.nazwisko} {student.imie}
              </div>
              <div>Klasa: {student.klasa}</div>
              <div style={{ color: '#666' }}>{student.email}</div>
            </div>
            <button
              onClick={() => handleDeleteStudent(student.email)}
              style={{
                background: '#ff4444',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '16px',
              }}
            >
              Usuń
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RemoveStudent;
