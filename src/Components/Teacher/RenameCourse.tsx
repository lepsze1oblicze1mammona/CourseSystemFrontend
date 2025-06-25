import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import "../../Style/RenameCourse.css";

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
  const [selectedCourse, setSelectedCourse] = useState<number | "">("");
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (selectedCourse === "" || !newName.trim()) {
      setMessage("Wypełnij wszystkie pola.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.put(
        "/kurs",
        {
          kurs_id: selectedCourse,
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

      const updatedCourses = courses.map(course =>
        course.id === selectedCourse ? { ...course, nazwa: newName } : course
      );
      setCourses(updatedCourses);

      setSelectedCourse("");
      setNewName("");

    } catch (error: any) {
      console.error("Błąd podczas zmiany nazwy kursu:", error);
      const errorMsg = error.response?.data?.error || "Wystąpił błąd podczas zmiany nazwy kursu.";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="rename-course-container">
      <h3 className="rename-course-title">Zmień nazwę kursu</h3>
      <form onSubmit={handleRename} className="rename-course-form">
        <label>
          Wybierz kurs:
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(Number(e.target.value))}
            required
          >
            <option value="">-- wybierz kurs --</option>
            {courses.length === 0 ? (
              <option disabled>Brak kursów</option>
            ) : (
              courses.map(course => (
                <option key={course.id} value={course.id}>
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
          />
        </label>

        <button type="submit" className="rename-course-btn">
          Zmień nazwę
        </button>
      </form>
      {message && (
        <div
          className={
            "rename-course-message " +
            (message.includes("zmieniona") || message.includes("pomyślnie") 
              ? "rename-course-message-success" 
              : "rename-course-message-error")
          }
        >
          Zmieniono nazwę kursu
        </div>
      )}
    </div>
  );
};

export default RenameCourse;
