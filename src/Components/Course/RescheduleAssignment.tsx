import React, { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import "../../Style/RescheduleAssignment.css";

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
    return d.toISOString().slice(0, 10);
  });

  const [time, setTime] = useState(() => {
    const d = new Date(assignment.termin_realizacji);
    return d.toTimeString().slice(0, 5);
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const newDateTime = `${date}T${time}:00`;
    setLoading(true);

    try {
      const token = sessionStorage.getItem('token');
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

      // ⬇️ WAŻNE: przekazujemy znacznik czasu do stanu, by odświeżyć dane w AssignmentDetails
      navigate(`/tc/${courseId}/assignments/${assignmentId}`, {
        state: { rescheduledAt: new Date().toISOString() },
      });

    } catch (err) {
      setError('Nie udało się zmienić terminu. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reschedule-container">
      <h2 className="reschedule-title">Zmień termin zadania</h2>
      <div className="assignment-name">
        Zadanie: <strong>{assignment.nazwa}</strong>
      </div>
      <form onSubmit={handleSubmit} className="reschedule-form">
        <div className="form-group">
          <label>Nowa data:</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Nowa godzina:</label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
          />
        </div>

        {error && <div className="reschedule-error">{error}</div>}

        <div className="button-group">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Zapisywanie...' : 'Zapisz nowy termin'}
          </button>
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
};

export default RescheduleAssignment;
