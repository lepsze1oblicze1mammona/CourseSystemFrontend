import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

interface Course {
  id: number;
  nazwa: string;
}

interface ContextType {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

const RemoveCourse: React.FC = () => {
  const { courses, setCourses } = useOutletContext<ContextType>();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const handleRemove = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourse) {
      setMessage("Wybierz kurs do usunięcia.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete("/kurs", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          nazwa: selectedCourse
        }
      });

      setMessage(response.data.output);

      // Aktualizacja listy kursów
      const updatedCourses = courses.filter(course => course.nazwa !== selectedCourse);
      setCourses(updatedCourses);
      setSelectedCourse("");

    } catch (error: any) {
      console.error("Błąd podczas usuwania kursu:", error);
      const errorMsg = error.response?.data?.error || "Wystąpił błąd podczas usuwania kursu.";
      setMessage(errorMsg);
    }
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
            {courses.length === 0 ? (
              <option disabled>Brak kursów</option>
            ) : (
              courses.map(course => (
                <option key={course.id} value={course.nazwa}>
                  {course.nazwa}
                </option>
              ))
            )}
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
      {message && <div style={{ marginTop: 12, color: "#dc3545", whiteSpace: "pre-wrap" }}>{message}</div>}
    </div>
  );
};

export default RemoveCourse;
