import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

    const message = response.data.message?.toLowerCase();

    if (
      message?.includes("zalogowano") &&
      response.data.token
    ) {
      setSuccess(response.data.message);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard"); 
    } else {
      setError(response.data.message || "Błąd logowania.");
    }
  } catch (err: any) {
    setError(err.response?.data?.error || "Wystąpił błąd podczas logowania.");
  }
};


  return (
    <div className="login-container">
      <h2 className="login-title">Logowanie</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Wpisz swój email"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Hasło</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Wpisz swoje hasło"
            className="form-input"
          />
        </div>

        <button type="submit" className="btn-submit">Zaloguj się</button>
      </form>

      <p className="redirect-signup">
        Chcesz założyć konto? <a href="/register">Zarejestruj się</a>
      </p>
    </div>
  );
};

export default Login;
