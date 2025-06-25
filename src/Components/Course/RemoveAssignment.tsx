import React, { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import "../../Style/RemoveAssignment.css";

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
      const token = sessionStorage.getItem('token');
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
    <div className="remove-assignment-container">
      <h2 className="remove-assignment-title">Usuwanie zadania</h2>
      <div className="remove-assignment-question">
        Czy na pewno chcesz usunąć zadanie <strong>"{assignment.nazwa}"</strong>?
      </div>

      {error && <div className="remove-assignment-error">{error}</div>}

      <div className="remove-assignment-btn-group">
        <button
          className="remove-assignment-btn-delete"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? 'Usuwanie...' : 'Tak, usuń'}
        </button>
        <button
          className="remove-assignment-btn-cancel"
          onClick={() => navigate(-1)}
        >
          Anuluj
        </button>
      </div>
    </div>
  );
};

export default RemoveAssignment;
