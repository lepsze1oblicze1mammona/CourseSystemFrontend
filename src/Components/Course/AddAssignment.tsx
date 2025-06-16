import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AddAssignment: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !deadline) {
      alert('Uzupełnij wszystkie pola!');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        '/zadanie',
        {
          kurs_id: Number(courseId),
          nazwa_zadania: name,
          opis: description,
          termin: deadline
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage(response.data.output || 'Zadanie zostało dodane.');
      setName('');
      setDescription('');
      setDeadline('');
    } catch (error: any) {
      console.error('Błąd podczas dodawania zadania:', error);
      const errorMsg = error.response?.data?.error || 'Wystąpił błąd podczas dodawania zadania.';
      setMessage(errorMsg);
    }
  };

  return (
    <div className="add-assignment-container" style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>Dodaj zadanie do kursu</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>
            Nazwa zadania:<br />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: 8 }}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Opis zadania:<br />
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ width: '100%', padding: 8, minHeight: 80 }}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Data oddania:<br />
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              style={{ width: '100%', padding: 8 }}
              required
            />
          </label>
        </div>
        <button
          type="submit"
          style={{
            background: '#4CAF50',
            color: 'white',
            padding: '10px 24px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Dodaj zadanie
        </button>
      </form>
      {message && (
        <div style={{ marginTop: 16, color: message.includes('błąd') ? '#dc3545' : '#4CAF50' }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AddAssignment;
