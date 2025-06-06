import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SubmitAssignment: React.FC = () => {
  const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Czyszczenie URL przy zmianie pliku lub odmontowaniu komponentu
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    // wysyłka na backend
    alert('Plik poprawny, gotowy do wysłania!');
    navigate(`/courses/${courseId}`);
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

        {/* Opcjonalny podgląd PDF */}
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
          Wróc do listy zadań
        </button>
      </form>
    </div>
  );
};

export default SubmitAssignment;
