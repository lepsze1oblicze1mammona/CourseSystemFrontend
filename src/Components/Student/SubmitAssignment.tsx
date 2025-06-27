import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import "../../Style/SubmitAssignment.css"

const SubmitAssignment: React.FC = () => {
  const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  
  const { assignmentName = '' } = location.state || {};

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [studentLogin, setStudentLogin] = useState<string>('');

  useEffect(() => {
    const login = sessionStorage.getItem('email');
    if (login) setStudentLogin(login);
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setFileUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setFileUrl(null);
    }
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
      setError('Dopuszczalny jest tylko format PDF!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Proszę wybrać plik PDF.');
      return;
    }

    const missingFields: string[] = [];
    if (!studentLogin) missingFields.push('login studenta');
    if (!courseId) missingFields.push('ID kursu');
    if (!assignmentName) missingFields.push('nazwa zadania');

    if (missingFields.length > 0) {
      setError(`Brak wymaganych danych: ${missingFields.join(', ')}.`);
      return;
    }

    const courseIdInt = Number(courseId);
    if (isNaN(courseIdInt)) {
      setError('ID kursu jest nieprawidłowe.');
      return;
    }
    const assignmentIdInt = Number(assignmentId);
    if (isNaN(assignmentIdInt)) {
      setError('ID zadania jest nieprawidłowe.');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('Brak tokenu autoryzacji. Proszę się zalogować.');
        return;
      }

      const formData = new FormData();
      formData.append('student_login', studentLogin);
      formData.append('kurs_id', courseIdInt.toString());
      formData.append('zadanie_id', assignmentIdInt.toString());
      formData.append('plik', selectedFile);

      await axios.post('/zadanie/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Plik został pomyślnie wysłany!');
      navigate(`/sc/${courseId}`, { replace: true });
      window.location.reload();
    } catch (err) {
      console.error('Błąd wysyłania pliku:', err);
      setError('Wystąpił błąd podczas wysyłania pliku.');
    }
  };

  return (
    <div className="submit-assignment-container">
      <h2 className="submit-assignment-title">Wyślij rozwiązanie</h2>

      {!assignmentName && (
        <div className="missing-assignment-name">
          Nie podano nazwy zadania. Proszę wrócić do listy zadań i spróbować ponownie.
        </div>
      )}

      <form onSubmit={handleSubmit} className="submit-assignment-form">
        <div>
          <input 
            id="file-upload" 
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange}
            className="submit-assignment-file-input"
          />
        </div>

        {selectedFile && (
          <div className="file-selected-info">
            Wybrany plik: <b>{selectedFile.name}</b>
          </div>
        )}

        {error && (
          <div className="submit-assignment-error">
            {error}
          </div>
        )}

        {fileUrl && (
          <div className="pdf-preview-container">
            <iframe
              src={fileUrl}
              className="pdf-preview"
              title="Podgląd PDF"
            />
          </div>
        )}

        <div className="submit-assignment-btn-group">
          {selectedFile && assignmentName && (
            <button
              type="submit"
              className="submit-assignment-btn submit-assignment-btn-submit"
            >
              Wyślij
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate(`/sc/${courseId}`)}
            className="submit-assignment-btn submit-assignment-btn-back"
          >
            Wróć do listy zadań
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitAssignment;