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

const AddStudents = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [students] = useState<Student[]>([
    { id: 1, name: 'Jan', surname: 'Kowalski', email: 'jan.kowalski@example.com', class: '3a' },
    { id: 2, name: 'Anna', surname: 'Nowak', email: 'anna.nowak@example.com', class: '2b' },
    { id: 3, name: 'Marek', surname: 'Wiśniewski', email: 'marek.wisniewski@example.com', class: '1c' }
  ]);
  
  const [sortBy, setSortBy] = useState<SortKey>('surname');
  const [selectedEmail, setSelectedEmail] = useState<string>('');


/*

axios z listą wszystkich studentów w bazie

*/



  // Sortowanie uczniów
  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === 'surname') return a.surname.localeCompare(b.surname);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return a.class.localeCompare(b.class);
  });

  const handleSelectStudent = (email: string) => {
    setSelectedEmail(email);
  };

  const handleAddStudent = () => {          //dodanie studenta do kursu
    if (selectedEmail && courseId) {
      alert(`Dodano ucznia: ${selectedEmail} do kursu o ID: ${courseId}`);
      setSelectedEmail('');
    } else {
      alert('Proszę wybrać ucznia!');
    }
  };

  return (
    <div className="add-students-container">
      <h2>Dodaj ucznia do kursu</h2>
      
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
            onClick={() => handleSelectStudent(student.email)}
            style={{
              padding: '12px',
              margin: '8px 0',
              border: `2px solid ${selectedEmail === student.email ? '#2196F3' : '#ddd'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: selectedEmail === student.email ? '#e3f2fd' : 'white',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontWeight: 500 }}>{student.surname} {student.name}</div>
            <div>Klasa: {student.class}</div>
            <div style={{ color: '#666' }}>{student.email}</div>
          </div>
        ))}
      </div>

      <div className="course-actions" style={{ marginTop: '24px' }}>
        <button 
          onClick={handleAddStudent}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Dodaj wybranego ucznia
        </button>
      </div>
    </div>
  );
};

export default AddStudents;
