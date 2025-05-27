import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import do przekierowania

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook do przekierowania

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    //tutaj wysyłanie do bazy i przypisanie do error i success odpowiednich wartości
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