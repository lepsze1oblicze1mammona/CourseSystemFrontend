import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    imie: "",
    nazwisko: "",
  });
  const [confirmPassword, setConfirmPassword] = useState(""); // osobny stan!
  const [error, setError] = useState<string | null>(null);  //czy udalo się zarejestrowac
  const [success, setSuccess] = useState<string | null>(null); //czy udalo się zarejestrowac
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Sprawdzamy, czy hasła się zgadzają
    if (formData.password !== confirmPassword) {
      setError("Hasła nie są zgodne.");
      return;
    }

    // Przygotowanie danych do wysłania
    const payload = {
      email: formData.email,
      password: formData.password,
      role: formData.role,
      imie: formData.imie,
      nazwisko: formData.nazwisko
    };

    //tutaj wysyłanie do bazy i przypisanie do error i success odpowiednich wartości
  };

  return (
    <div className="register-container">
      <h2>Rejestracja</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="imie">Imię</label>
          <input
            type="text"
            id="imie"
            name="imie"
            value={formData.imie}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="nazwisko">Nazwisko</label>
          <input
            type="text"
            id="nazwisko"
            name="nazwisko"
            value={formData.nazwisko}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Hasło</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Potwierdź hasło</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-submit">
          Zarejestruj się
        </button>
      </form>
    </div>
  );
};

export default Register;
