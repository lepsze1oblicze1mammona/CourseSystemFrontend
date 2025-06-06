import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet, useMatch } from 'react-router-dom';
import CourseSidebar from './CourseSidebar';
import { clearAuth } from '../../Auth/Auth';
import { fetchCourse } from '../../services/mockData';
import { Course } from '../../types/courseTypes';

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const match = useMatch("/courses/:courseId");
  const isMain = !!match;
  const role = localStorage.getItem('role');

  useEffect(() => {                                         //dane z pliku /src/services/mockData.ts, typy w /src/types/courseTypes.ts
    const loadCourse = async () => {
      try {
        const data = await fetchCourse(courseId!);
        setCourse(data);
      } catch (error) {
        console.error("Błąd ładowania kursu:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCourse();
  }, [courseId]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const moveToDashboard = () => {
    navigate(role === 'teacher' ? '/teacher' : '/student');
  };

  if (loading) return <div>Ładowanie kursu...</div>;
  if (!course) return <div>Kurs nie znaleziony</div>;         //jeśli go nie ma w pliku - potem można usunąć

  return (
    <div className="course-details-layout" style={{ display: "flex", minHeight: "80vh" }}>
      {role === "teacher" ? (
        <div style={{ display: "flex", width: '100%' }}>
          <CourseSidebar />
          <div style={{ flex: 1, padding: "2rem" }}>
            <button onClick={handleLogout}>Wyloguj</button>
            <button onClick={moveToDashboard}>Powrót</button>
            <h2>{course.name}</h2>
            {!isMain && (
              <button onClick={() => navigate(`/courses/${courseId}`)}>
                Powrót do listy zadań
              </button>
            )}
            <Outlet context={{ course }} />
          </div>
        </div>
      ) : role === "student" ? (
        <div style={{ flex: 1, padding: "2rem" }}>
          <button onClick={handleLogout}>Wyloguj</button>
          <button onClick={moveToDashboard}>Powrót</button>
          <h2>{course.name}</h2>
          
          {/* Lista zadań dla studenta */}
          <div className="assignments-container">
            {course.assignments.map(assignment => (
              <div key={assignment.id} className="assignment-card">
                <h3>{assignment.title}</h3>
                <p>{assignment.description}</p>
                <div className="assignment-meta">
                  {assignment.deadline && (
                    <span>Termin: {assignment.deadline}</span>
                  )}
                  <button
                    onClick={() => navigate(`submit/${assignment.id}`)}
                    style={{
                      alignSelf: 'center',
                      padding: '0.5rem 1rem',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer'
                    }}
                  >
                    Wyślij rozwiązanie
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CourseDetails;
