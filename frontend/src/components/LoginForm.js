import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Backend URL: Adjust dynamically for local and production
  const backendURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000/api'
      : 'https://signup-form-backend.vercel.app/api';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendURL}/login`, {
        email,
        password,
      });

      setSuccessMessage(`Welcome, ${response.data.name}!`);
      setError('');
      navigate('/dashboard'); // Redirect to the dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setSuccessMessage('');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <div className="redirect">
        <p>
          Don't have an account?{' '}
          <Link to="/">Register</Link> {/* Redirect to registration page */}
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
