import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import "../../Style/RemoveCourse.css";

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
  const [selectedCourse, setSelectedCourse] = useState<number | "">("");
  const [message, setMessage] = useState<string | null>(null);

  const handleRemove = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCourse === "") {
      setMessage("Wybierz kurs do usunięcia.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.delete("/kurs", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          kurs_id: selectedCourse
        }
      });

      setMessage(response.data.output);

      const updatedCourses = courses.filter(course => course.id !== selectedCourse);
      setCourses(updatedCourses);
      setSelectedCourse("");

    } catch (error: any) {
      console.error("Błąd podczas usuwania kursu:", error);
      const errorMsg = error.response?.data?.error || "Wystąpił błąd podczas usuwania kursu.";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="remove-course-container">
      <h3 className="remove-course-title">Usuń kurs</h3>
      <form onSubmit={handleRemove} className="remove-course-form">
        <label>
          Wybierz kurs do usunięcia:
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
        <button type="submit" className="remove-course-btn">
          Usuń kurs
        </button>
      </form>
      {message && (
        <div
          className={
            "remove-course-message " +
            (message.includes("pomyślnie") ? "remove-course-message-success" : "remove-course-message-error")
          }
        >
          Kurs został usunięty.
        </div>
      )}
    </div>
  );
};

export default RemoveCourse;
