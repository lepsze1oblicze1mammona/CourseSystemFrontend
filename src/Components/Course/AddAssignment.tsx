import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../Style/AddAssignment.css";

const AddAssignment: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

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
      const token = sessionStorage.getItem('token');

      // Format daty do UTC
      const formattedDeadline = new Date(deadline).toISOString();

      const response = await axios.post(
        '/zadanie',
        {
          kurs_id: Number(courseId),
          nazwa_zadania: name,
          opis: description,
          termin: formattedDeadline // wysyłamy sformatowaną datę
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
    <div className="add-assignment-container">
      <button
        className="add-assignment-back-btn"
        onClick={() => navigate(`/tc/${courseId}`)}
      >
        Powrót do szczegółów kursu
      </button>
      <h2 className="add-assignment-title">Dodaj zadanie do kursu</h2>
      
      <form onSubmit={handleSubmit} className="add-assignment-form">
        <div className="form-group">
          <label>Nazwa zadania:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Opis zadania:</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Data i godzina oddania:</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="add-assignment-btn">
          Dodaj zadanie
        </button>
      </form>
    </div>
  );
};

export default AddAssignment;
