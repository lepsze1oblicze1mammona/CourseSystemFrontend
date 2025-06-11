import React from "react";
import CourseDetailsTeacher from "../Teacher/CourseDetailsTeacher";
import CourseDetailsStudent from "../Student/CourseDetailsStudent";

const CourseDetailsWrapper: React.FC = () => {
  const role = localStorage.getItem("role");
  if (role === "teacher") return <CourseDetailsTeacher />;
  if (role === "student") return <CourseDetailsStudent />;
  return <div>Brak dostępu lub nieznana rola.</div>;
};

export default CourseDetailsWrapper;
