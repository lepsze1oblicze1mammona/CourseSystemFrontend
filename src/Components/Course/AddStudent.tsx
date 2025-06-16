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

type SortKey = 'surname' | 'name' | 'class';

const AddStudents = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<SortKey>('surname');
  const [selectedEmail, setSelectedEmail] = useState<string>('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<Student[]>('/specialtreatment/allstudents', {
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

    if (courseId) {
      fetchStudents();
    }
  }, [courseId]);

  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === 'surname') return a.nazwisko.localeCompare(b.nazwisko);
    if (sortBy === 'name') return a.imie.localeCompare(b.imie);
    return a.klasa.localeCompare(b.klasa);
  });

  const handleSelectStudent = (email: string) => {
    setSelectedEmail(email);
  };

  const handleAddStudent = async () => {
    if (!selectedEmail) {
      alert('Proszę wybrać ucznia!');
      return;
    }
    if (!courseId) {
      alert('Nie znaleziono ID kursu!');
      return;
    }

    setAdding(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post('/kurs/assign', {
        kurs_id: Number(courseId),
        student_login: selectedEmail,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Dodano ucznia: ${selectedEmail} do kursu o ID: ${courseId}`);
      setSelectedEmail('');
    } catch {
      alert('Wystąpił błąd podczas dodawania ucznia do kursu.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div>Ładowanie uczniów...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="add-students-container">
      <h2>Dodaj ucznia do kursu</h2>

      <div className="sort-controls" style={{ marginBottom: '1rem' }}>
        <label>Sortuj według: </label>
        {(['surname', 'name', 'class'] as SortKey[]).map(key => (
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
            onClick={() => handleSelectStudent(student.email)}
            style={{
              padding: '12px',
              margin: '8px 0',
              border: `2px solid ${selectedEmail === student.email ? '#2196F3' : '#ddd'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: selectedEmail === student.email ? '#e3f2fd' : 'white',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontWeight: 500 }}>{student.nazwisko} {student.imie}</div>
            <div>Klasa: {student.klasa}</div>
            <div style={{ color: '#666' }}>{student.email}</div>
          </div>
        ))}
      </div>

      <div className="course-actions" style={{ marginTop: '24px' }}>
        <button
          onClick={handleAddStudent}
          disabled={adding}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: adding ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          {adding ? 'Dodawanie...' : 'Dodaj wybranego ucznia'}
        </button>
      </div>
    </div>
  );
};

export default AddStudents;
