import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../Style/AddStudent.css";

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
  const navigate = useNavigate();
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
        const token = sessionStorage.getItem("token");
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
      const token = sessionStorage.getItem("token");
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
  if (error) return <div>{error}</div>;

  return (
    <div className="add-students-container">
      <button
        className="add-students-back-btn"
        onClick={() => navigate(`/tc/${courseId}`)}
      >
        Powrót do szczegółów kursu
      </button>
      
      <h2 className="add-students-title">Dodaj ucznia do kursu</h2>

      <div className="sort-controls">
        <label>Sortuj według: </label>
        {(['surname', 'name', 'class'] as SortKey[]).map(key => (
          <button
            key={key}
            className="sort-btn"
            onClick={() => setSortBy(key)}
            disabled={sortBy === key}
          >
            {key === 'surname' ? 'Nazwisko' : 
            key === 'name' ? 'Imię' : 'Klasa'}
          </button>
        ))}
      </div>

      <div className="students-list">
        {sortedStudents.map(student => (
          <div
            key={student.id}
            className={`student-card ${selectedEmail === student.email ? 'selected' : ''}`}
            onClick={() => handleSelectStudent(student.email)}
          >
            <div className="student-name">{student.nazwisko} {student.imie}</div>
            <div className="student-class">Klasa: {student.klasa}</div>
            <div className="student-email">{student.email}</div>
          </div>
        ))}
      </div>

      <div className="course-actions">
        <button
          className="add-student-btn"
          onClick={handleAddStudent}
          disabled={adding}
        >
          {adding ? 'Dodawanie...' : 'Dodaj wybranego ucznia'}
        </button>
      </div>
    </div>
  );
};

export default AddStudents;
