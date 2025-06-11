import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet, useMatch } from 'react-router-dom';
import CourseSidebar from '../Course/CourseSidebar';
import { clearAuth } from '../../Auth/Auth';
import axios from 'axios';

interface Assignment {
  id: number;
  kurs_id: number;
  nazwa: string;
  opis: string;
  termin_realizacji: string;
}

const CourseDetailsTeacher: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const match = useMatch("/courses/:courseId");
  const isMain = !!match;

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Brak tokenu");

        const response = await axios.get('/specialtreatment/tasks', {
          params: { kurs_id: Number(courseId) },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        setAssignments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Błąd ładowania zadań:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadAssignments();
    } else {
      setLoading(false);
    }
  }, [courseId]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const moveToDashboard = () => {
    navigate('/teacher');
  };

  if (loading) return <div>Ładowanie zadań...</div>;

  return (
    <div className="course-details-layout" style={{ display: "flex", minHeight: "80vh" }}>
      <div style={{ display: "flex", width: '100%' }}>
        <CourseSidebar />
        <div style={{ flex: 1, padding: "2rem" }}>
          <button onClick={handleLogout}>Wyloguj</button>
          <button onClick={moveToDashboard}>Powrót do listy kursów</button>
          {isMain && (
          <h2>Zadania kursu</h2>
        )}
        {!isMain && (
          <button onClick={() => navigate(`/courses/${courseId}`)}>
            Powrót do listy zadań
          </button>
        )}
          <Outlet context={{ assignments }} />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsTeacher;
