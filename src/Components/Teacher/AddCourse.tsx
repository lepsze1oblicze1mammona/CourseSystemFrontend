import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

// Typy kontekstu, jeśli chcesz odświeżać listę kursów lokalnie
interface Course {
  id: number;
  name: string;
}
interface ContextType {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

const AddCourse: React.FC = () => {
  const { courses, setCourses } = useOutletContext<ContextType>();
  const [courseName, setCourseName] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  // Pobierz id nauczyciela z localStorage (lub z kontekstu autoryzacji)
  const id = localStorage.getItem("id");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!courseName.trim()) {
      setMessage("Podaj nazwę kursu.");
      return;
    }

    // Przykład lokalnego dodania kursu (do podmiany na zapytanie do backendu)
    // Po podpięciu backendu, wyślij POST na /api/courses 
    try {
      //wysyłka do backendu

      // Tymczasowo lokalnie:
      const newCourse: Course = {
        id: Math.max(0, ...courses.map(c => c.id)) + 1,
        name: courseName,
      };
      setCourses([...courses, newCourse]);
      setMessage("Kurs dodany!");
      setCourseName("");
    } catch (err) {
      setMessage("Błąd podczas dodawania kursu.");
    }
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h3>Dodaj kurs</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>
          Nazwa kursu:
          <input
            type="text"
            value={courseName}
            onChange={e => setCourseName(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>
        <button
          type="submit"
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "8px 16px",
            cursor: "pointer"
          }}
        >
          Dodaj kurs
        </button>
      </form>
      {message && <div style={{ marginTop: 12, color: "#1976d2" }}>{message}</div>}
    </div>
  );
};

export default AddCourse;
