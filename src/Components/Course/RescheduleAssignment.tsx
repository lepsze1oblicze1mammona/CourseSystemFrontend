import React, { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';

interface Assignment {
  id: number;
  nazwa: string;
  termin_realizacji: string;
}

const RescheduleAssignment: React.FC = () => {
  const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>();
  const navigate = useNavigate();
  const { assignment } = useOutletContext<{ assignment: Assignment }>();

  const [date, setDate] = useState(() => {
    const d = new Date(assignment.termin_realizacji);
    return d.toISOString().slice(0, 10); // yyyy-mm-dd
  });

  const [time, setTime] = useState(() => {
    const d = new Date(assignment.termin_realizacji);
    return d.toTimeString().slice(0, 5); // hh:mm
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const newDateTime = `${date}T${time}:00`;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Brak tokenu autoryzacji.');
        setLoading(false);
        return;
      }

      await axios.put(
        '/zadanie',
        {
          kurs_id: Number(courseId),
          zadanie_id: Number(assignmentId),
          nowy_termin: newDateTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      navigate(`/tc/${courseId}/assignments/${assignmentId}`, {
        state: { success: 'Termin zadania został zmieniony.' },
      });
    } catch (err) {
      setError('Nie udało się zmienić terminu. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>Zmień termin zadania</h2>
      <div style={{ marginBottom: '1rem' }}>
        Zadanie: <strong>{assignment.nazwa}</strong>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Nowa data:
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Nowa godzina:
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {loading ? 'Zapisywanie...' : 'Zapisz nowy termin'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: '0.5rem 1rem',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
};

export default RescheduleAssignment;
