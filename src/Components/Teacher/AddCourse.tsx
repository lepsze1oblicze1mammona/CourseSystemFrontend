import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

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

  const token = localStorage.getItem("token");
  const wlasciciel_login = localStorage.getItem("email");

  if (!token || !wlasciciel_login) {
    setMessage("Brak autoryzacji lub loginu właściciela.");
    return;
  }

  try {
    const response = await axios.post(
      "/kurs",
      {
        nazwa: courseName,
        wlasciciel_login: wlasciciel_login
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    const newCourse: Course = {
      id: Math.max(0, ...courses.map((c) => c.id)) + 1,
      name: courseName
    };

    setCourses([...courses, newCourse]);
    setCourseName("");
    setMessage("Kurs dodany!");
  } catch (err: any) {
    console.error(err);
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
