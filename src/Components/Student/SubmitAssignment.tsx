import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

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
    const login = localStorage.getItem('email');
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

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Brak tokenu autoryzacji. Proszę się zalogować.');
        return;
      }

      const formData = new FormData();
      formData.append('student_login', studentLogin);
      formData.append('kurs_id', courseIdInt.toString());
      formData.append('nazwa_zadania', assignmentName);
      formData.append('plik', selectedFile);

      await axios.post('/zadanie/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Plik został pomyślnie wysłany!');
      navigate(`/courses/${courseId}`);
    } catch (err) {
      console.error('Błąd wysyłania pliku:', err);
      setError('Wystąpił błąd podczas wysyłania pliku.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
      <h2>Wyślij rozwiązanie</h2>

      {!assignmentName && (
        <div style={{ marginBottom: '1rem', color: 'red' }}>
          Nie podano nazwy zadania. Proszę wrócić do listy zadań i spróbować ponownie.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ margin: '1rem 0' }}>
          <input id="file-upload" type="file" accept=".pdf" onChange={handleFileChange} />
        </div>

        {selectedFile && (
          <div style={{ margin: '1rem 0', color: '#1976d2' }}>
            Wybrany plik: <b>{selectedFile.name}</b>
          </div>
        )}

        {error && (
          <div style={{ color: '#dc3545', margin: '1rem 0' }}>
            {error}
          </div>
        )}

        {fileUrl && (
          <div style={{ marginBottom: '1rem' }}>
            <iframe
              src={fileUrl}
              title="Podgląd PDF"
              width="100%"
              height="400px"
              style={{ border: '1px solid #ccc', borderRadius: 4 }}
            />
          </div>
        )}

        {selectedFile && assignmentName && (
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Wyślij
          </button>
        )}

        <button
          type="button"
          onClick={() => navigate(`/sc/${courseId}`)}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Wróć do listy zadań
        </button>
      </form>
    </div>
  );
};

export default SubmitAssignment;
