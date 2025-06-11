import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const AddAssignment: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !deadline) {
      alert('Uzupełnij wszystkie pola!');
      return;
    }

    alert(
      `Dodano zadanie:\n\nNazwa: ${name}\nOpis: ${description}\nData oddania: ${deadline}\nID kursu: ${courseId}`
    );

    setName('');
    setDescription('');
    setDeadline('');
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
    </div>
  );
};

export default AddAssignment;
