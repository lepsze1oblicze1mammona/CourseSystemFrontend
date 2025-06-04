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

const RemoveCourse: React.FC = () => {
  const { courses, setCourses } = useOutletContext<ContextType>();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const handleRemove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
      setMessage("Wybierz kurs do usunięcia.");
      return;
    }
    const updatedCourses = courses.filter(course => course.name !== selectedCourse);
    setCourses(updatedCourses);
    setMessage(`Kurs "${selectedCourse}" został usunięty.`);
    setSelectedCourse("");
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h3>Usuń kurs</h3>
      <form onSubmit={handleRemove} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>
          Wybierz kurs do usunięcia:
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          >
            <option value="">-- wybierz kurs --</option>
            {courses.map(course => (
              <option key={course.id} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          style={{
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "8px 16px",
            cursor: "pointer"
          }}
        >
          Usuń kurs
        </button>
      </form>
      {message && <div style={{ marginTop: 12, color: "#dc3545" }}>{message}</div>}
    </div>
  );
};

export default RemoveCourse;
