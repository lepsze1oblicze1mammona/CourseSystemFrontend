import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SubmitAssignment: React.FC = () => {
  const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Pobieramy nazwę kursu i nazwę zadania z location.state (np. z nawigacji)
  // Jeśli nie ma tych danych, można ustawić na pusty string lub obsłużyć inaczej
  const {
    courseName = '',
    assignmentName = ''
  } = location.state || {};

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [studentLogin, setStudentLogin] = useState<string>('');

  useEffect(() => {
    // Załaduj login studenta z localStorage (lub innego źródła)
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
    if (!studentLogin || !courseName || !assignmentName) {
      setError('Brak wymaganych danych: login, nazwa kursu lub nazwa zadania.');
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
      formData.append('nazwa_kursu', courseName);
      formData.append('nazwa_zadania', assignmentName);
      formData.append('plik', selectedFile);

      await axios.post('http://localhost:8080/zadanie/upload', formData, {
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
      <form onSubmit={handleSubmit}>
        <div style={{ margin: '1rem 0' }}>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />
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

        {selectedFile && (
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Wyślij
          </button>
        )}

        <button
          type="button"
          onClick={() => navigate(`/courses/${courseId}`)}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Wróć do listy zadań
        </button>
      </form>
    </div>
  );
};

export default SubmitAssignment;
