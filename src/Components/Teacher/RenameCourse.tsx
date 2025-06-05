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

const RenameCourse: React.FC = () => {
  const { courses, setCourses } = useOutletContext<ContextType>();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedCourse || !newName.trim()) {
      setMessage("Wypełnij wszystkie pola.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "/kurs",
        {
          stara_nazwa: selectedCourse,
          nowa_nazwa: newName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setMessage(response.data.output || "Nazwa kursu została zmieniona.");

      // Aktualizacja lokalnej listy kursów
      const updatedCourses = courses.map(course =>
        course.nazwa === selectedCourse ? { ...course, nazwa: newName } : course
      );
      setCourses(updatedCourses);

      // Wyczyść pola
      setSelectedCourse("");
      setNewName("");

    } catch (error: any) {
      console.error("Błąd podczas zmiany nazwy kursu:", error);
      const errorMsg = error.response?.data?.error || "Wystąpił błąd podczas zmiany nazwy kursu.";
      setMessage(errorMsg);
    }
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h3>Zmień nazwę kursu</h3>
      <form onSubmit={handleRename} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>
          Wybierz kurs:
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

        <label>
          Nowa nazwa kursu:
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <button
          type="submit"
          style={{
            background: "#ffc107",
            color: "#000",
            border: "none",
            borderRadius: 4,
            padding: "8px 16px",
            cursor: "pointer"
          }}
        >
          Zmień nazwę
        </button>
      </form>
      {message && <div style={{ marginTop: 12, color: "#ffc107", whiteSpace: "pre-wrap" }}>{message}</div>}
    </div>
  );
};

export default RenameCourse;
