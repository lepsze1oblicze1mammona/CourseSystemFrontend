import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

interface Course {
  id: number;
  name: string;
}

interface ContextType {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

const RenameCourse: React.FC = () => {
  const { courses, setCourses } = useOutletContext<ContextType>();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [newName, setNewName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCourses = courses.map(course => 
      course.id === Number(selectedCourse) 
        ? { ...course, name: newName } 
        : course
    );
    setCourses(updatedCourses);
    setNewName("");
  };

  return (
    <div className="rename-form">
      <h3>Zmień nazwę kursu</h3>
      <form onSubmit={handleSubmit}>
        <select 
          value={selectedCourse} 
          onChange={(e) => setSelectedCourse(e.target.value)}
          required
        >
          <option value="">Wybierz kurs</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Nowa nazwa kursu"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        
        <button type="submit">Zapisz zmiany</button>
      </form>
    </div>
  );
};

export default RenameCourse;
