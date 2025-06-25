import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import "../../Style/AddCourse.css";

interface Course {
  id: number;
  name: string;
}

interface ContextType {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  refetchCourses: () => void; // dodajemy do kontekstu
}

const AddCourse: React.FC = () => {
  const { courses, setCourses, refetchCourses } = useOutletContext<ContextType>();
  const [courseName, setCourseName] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!courseName.trim()) {
      setMessage("Podaj nazwę kursu.");
      return;
    }

    const token = sessionStorage.getItem("token");
    const wlasciciel_login = sessionStorage.getItem("email");

    if (!token || !wlasciciel_login) {
      setMessage("Brak autoryzacji lub loginu właściciela.");
      return;
    }

    try {
      await axios.post(
        "/kurs",
        {
          nazwa: courseName,
          wlasciciel_login: wlasciciel_login,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCourseName("");
      setMessage("Kurs dodany!");
      await refetchCourses(); 

    } catch (err: any) {
      console.error(err);
      setMessage("Błąd podczas dodawania kursu.");
    }
  };

  return (
    <div className="add-course-container">
  <h3 className="add-course-title">Dodaj kurs</h3>
  <form onSubmit={handleSubmit} className="add-course-form">
    <label>
      Nazwa kursu:
      <input
        type="text"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        required
      />
    </label>
    <button type="submit" className="add-course-btn">
      Dodaj kurs
    </button>
  </form>
  {message && (
    <div
      className={
        "add-course-message " +
        (message === "Kurs dodany!" ? "add-course-message-success" : "add-course-message-error")
      }
    >
      {message}
    </div>
  )}
</div>
  );
};

export default AddCourse;
