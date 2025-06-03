// Components/TeacherDashboard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../Auth/Auth";
import CourseTile from "./Course/CourseTile";

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([
    { id: 1, name: "Matematyka podstawowa" },
    { id: 2, name: "Fizyka kwantowa" },
    { id: 3, name: "Chemia organiczna" },
    { id: 4, name: "Literatura polska" },
  ]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const handleCourseClick = (courseId: number) => {
    // Tymczasowe logowanie - później można zastąpić przekierowaniem
    console.log("Wybrano kurs o ID:", courseId);
    // np. navigate(`/courses/${courseId}`)
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "32px"
      }}>
        <h2 style={{ margin: 0 }}>Panel nauczyciela</h2>
        <button 
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Wyloguj
        </button>
      </div>

      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
          width: "100%"
        }}
      >
        {courses.map((course) => (
          <CourseTile
            key={course.id}
            courseName={course.name}
            onClick={() => handleCourseClick(course.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
