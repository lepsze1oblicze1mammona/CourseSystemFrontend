import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setAuth } from "../Auth/Auth";
import "../Style/Login.css"

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  try {
    const response = await axios.post("/login", formData, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const { token, role, user_id } = response.data;

    if (token && role && user_id) {
      console.log("Login OK:", response.data);
      setSuccess("Zalogowano pomyślnie");

      setAuth(token, role, user_id);
      sessionStorage.setItem("email", formData.email);
      if (role == "teacher"){
        navigate("/teacher");
      }
      else if (role=="student"){
        navigate("/student");
      }
      
    } else {
      setError("Nie znaleziono użytkownika");
    }

  } catch (err: any) {
    setError(err.response?.data?.error || "Wystąpił błąd podczas logowania.");
  }
};



  return (
    <div className="login-container">
    <h2 className="login-title">Logowanie</h2>
    {error && <div className="login-error-message">{error}</div>}
    {success && <div className="login-success-message">{success}</div>}
    <form onSubmit={handleSubmit} className="login-form">
      <div className="login-form-group">
        <label htmlFor="email" className="login-form-label">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Wpisz swój email"
          className="login-form-input"
        />
      </div>
      <div className="login-form-group">
        <label htmlFor="password" className="login-form-label">Hasło</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Wpisz swoje hasło"
          className="login-form-input"
        />
      </div>
      <button type="submit" className="login-btn-submit">Zaloguj się</button>
    </form>
    <p className="login-redirect-signup">
      Chcesz założyć konto? <a href="/register">Zarejestruj się</a>
    </p>
  </div>

  );
};

export default Login;