import React, { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';

interface Assignment {
  id: number;
  nazwa: string;
}

const RemoveAssignment: React.FC = () => {
  const { courseId, assignmentId } = useParams<{ 
    courseId: string;
    assignmentId: string;
  }>();
  const navigate = useNavigate();
  const { assignment } = useOutletContext<{ assignment: Assignment }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!window.confirm(`Czy na pewno chcesz usunąć zadanie "${assignment.nazwa}"?`)) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Brak tokenu autoryzacji. Proszę się zalogować.');
        setLoading(false);
        return;
      }

      await axios.delete('/zadanie', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          kurs_id: Number(courseId),
          zadanie_id: Number(assignmentId)
        }
      });

      alert('Zadanie zostało usunięte.');
      navigate(`/tc/${courseId}`);
    } catch (err) {
      console.error('Błąd podczas usuwania zadania:', err);
      setError('Wystąpił błąd podczas usuwania zadania.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Usuwanie zadania</h2>
      <div style={{ marginBottom: '1rem' }}>
        Czy na pewno chcesz usunąć zadanie <strong>"{assignment.nazwa}"</strong>?
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          {loading ? 'Usuwanie...' : 'Tak, usuń'}
        </button>

        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '0.5rem 1rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Anuluj
        </button>
      </div>
    </div>
  );
};

export default RemoveAssignment;
