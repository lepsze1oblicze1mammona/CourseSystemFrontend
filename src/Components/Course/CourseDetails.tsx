import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet, useMatch } from 'react-router-dom';
import CourseSidebar from './CourseSidebar';
import { clearAuth } from '../../Auth/Auth';

interface Course {
  id: number;
  name: string;
  assignments: Array<{
    id: number;
    title: string;
    description: string;
    deadline?: string;
  }>;
}



const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);

  const match = useMatch("/courses/:courseId");
  const isMain = !!match;

  const handleLogout = () => {
      clearAuth();           // Czyści token, role, id nauczyciela z localStorage
      navigate("/login");    // Przekierowuje na stronę logowania
    }

  const moveToCourses = () => {
    navigate("/teacher")
  }


  // Tymczasowe dane
  const mockCourses: Course[] = [
    {
      id: 1,
      name: "Matematyka podstawowa",
      assignments: [
        {
          id: 1,
          title: "Podstawy algebry",
          description: "Rozwiąż zadania 1-10 ze strony 45",
          deadline: "2025-06-15"
        }
      ]
    }
  ];

  useEffect(() => {
    const selectedCourse = mockCourses.find(c => c.id === Number(courseId));
    setCourse(selectedCourse || null);
  }, [courseId]);

  if (!course) return <div>Ładowanie...</div>;




  return (
    <div className="course-details-layout" style={{ display: "flex", minHeight: "80vh" }}>
      <CourseSidebar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <button onClick={handleLogout}>
          Wyloguj
        </button>
        <button onClick={moveToCourses}>
          Powrót do listy kursów
        </button>
        <h2>{course.name}</h2>
        {!isMain && (
          <button onClick={() => navigate(`/courses/${courseId}`)}>
            Powrót do listy zadań
          </button>
        )}
        {/* Tutaj będą się pojawiać podstrony ZAMIAST listy zadań */}
        <Outlet context={{ course }} />
      </div>
    </div>
  );
};

export default CourseDetails;
