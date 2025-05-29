import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    imie: "",
    nazwisko: "",
    klasa: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== confirmPassword) {
      setError("Hasła nie są zgodne.");
      return;
    }

    try {
      const response = await axios.post("/register", formData, {
        headers: { "Content-Type": "application/json","X-Requested-With": "XMLHttpRequest" }
        
      });

      if (response.status === 200 && response.data.output) {
        setSuccess(response.data.output);
        navigate("/login");
      } else {
        setError(response.data.error || "Błąd rejestracji.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Wystąpił błąd podczas rejestracji.");
    }
  };

  return (
    <div className="register-container">
      <h2>Rejestracja</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="imie">Imię</label>
          <input type="text" id="imie" name="imie" value={formData.imie} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="nazwisko">Nazwisko</label>
          <input type="text" id="nazwisko" name="nazwisko" value={formData.nazwisko} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Hasło</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Potwierdź hasło</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="role">Rola</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange} required>
            <option value="">Wybierz rolę</option>
            <option value="student">Uczeń</option>
            <option value="teacher">Nauczyciel</option>
          </select>
        </div>
        {formData.role === "student" && (
          <div className="form-group">
            <label htmlFor="klasa">Klasa</label>
            <input type="text" id="klasa" name="klasa" value={formData.klasa} onChange={handleChange} required />
          </div>
        )}
        <button type="submit" className="btn-submit">Zarejestruj się</button>
      </form>
    </div>
  );
};

export default Register;
