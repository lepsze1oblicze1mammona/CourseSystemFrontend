import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

interface Student {
  id: number;
  name: string;
  surname: string;
  email: string;
  class: string;
}

type SortKey = 'surname' | 'name' | 'class';

const RemoveStudent = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Jan', surname: 'Kowalski', email: 'jan.kowalski@example.com', class: '1a' },
    { id: 2, name: 'Anna', surname: 'Nowak', email: 'anna.nowak@example.com', class: '2b' },
    { id: 3, name: 'Marek', surname: 'Wiśniewski', email: 'marek.wisniewski@example.com', class: '3c' }
  ]);
  
  const [sortBy, setSortBy] = useState<SortKey>('surname');

  // Sortowanie uczniów
  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === 'surname') return a.surname.localeCompare(b.surname);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return a.class.localeCompare(b.class);
  });

  const handleDeleteStudent = (studentId: number) => {
    setStudents(prev => prev.filter(student => student.id !== studentId));
  };

  return (
    <div className="remove-students-container">
      <h2>Usuń ucznia z kursu</h2>
      
      <div className="sort-controls" style={{ marginBottom: '1rem' }}>
        <label>Sortuj według: </label>
        <button 
          onClick={() => setSortBy('surname')}
          disabled={sortBy === 'surname'}
          style={{
            margin: '0 4px',
            padding: '4px 8px',
            backgroundColor: sortBy === 'surname' ? '#2196F3' : '#f0f0f0',
            color: sortBy === 'surname' ? 'white' : 'black'
          }}
        >
          Nazwisko
        </button>
        <button 
          onClick={() => setSortBy('name')}
          disabled={sortBy === 'name'}
          style={{
            margin: '0 4px',
            padding: '4px 8px',
            backgroundColor: sortBy === 'name' ? '#2196F3' : '#f0f0f0',
            color: sortBy === 'name' ? 'white' : 'black'
          }}
        >
          Imię
        </button>
        <button 
          onClick={() => setSortBy('class')}
          disabled={sortBy === 'class'}
          style={{
            margin: '0 4px',
            padding: '4px 8px',
            backgroundColor: sortBy === 'class' ? '#2196F3' : '#f0f0f0',
            color: sortBy === 'class' ? 'white' : 'black'
          }}
        >
          Klasa
        </button>
      </div>

      <div className="students-list">
        {sortedStudents.map((student) => (
          <div 
            key={student.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              margin: '8px 0',
              border: '2px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white',
            }}
          >
            <div>
              <div style={{ fontWeight: 500 }}>{student.surname} {student.name}</div>
              <div>Klasa: {student.class}</div>
              <div style={{ color: '#666' }}>{student.email}</div>
            </div>
            <button 
              onClick={() => handleDeleteStudent(student.id)}
              style={{
                background: '#ff4444',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '16px'
              }}
            >
              Usuń
            </button>
          </div>
        ))}
      </div>

      <div className="course-actions" style={{ marginTop: '24px' }}>
      </div>
    </div>
  );
};

export default RemoveStudent;
