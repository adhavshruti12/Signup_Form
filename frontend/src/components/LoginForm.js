import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add a loading state
  const navigate = useNavigate();

  // Backend URL: Adjust dynamically for local and production
  const backendURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000/api'
      : 'https://signup-form-backend.vercel.app/api';

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error and success messages
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${backendURL}/login`, {
        email,
        password,
      });

      // Save token or user info to localStorage/sessionStorage if needed
      localStorage.setItem('token', response.data.token);

      setSuccessMessage(`Welcome, ${response.data.name}!`);
      setError('');
      navigate('/dashboard'); // Redirect to the dashboard after login
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      {/* Success and Error Messages */}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />

        {/* Password Field */}
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Redirect to Registration */}
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
