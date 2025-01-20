import React, { useState } from 'react';
import axios from 'axios';
import validator from 'validator'; // Email validation
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const navigate = useNavigate();

  // Backend URL
  const backendURL = `${window.location.origin.includes('localhost') 
    ? 'http://localhost:5000/api' 
    : 'https://signup-form-backend.vercel.app/api'}`;

  const checkPasswordStrength = (password) => {
    let strengthMessage = '';
    let isValid = true;

    if (password.length < 6) {
      strengthMessage = 'Password should be at least 6 characters long';
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strengthMessage = 'Password should include at least one special character';
      isValid = false;
    } else {
      strengthMessage = 'Password is strong';
    }

    setPasswordStrength(strengthMessage);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccessMessage('');

    if (!validator.isEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength !== 'Password is strong') {
      setError('Password must meet strength requirements');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${backendURL}/register`, {
        name,
        email,
        password,
        confirmPassword,
      });

      setSuccessMessage(response.data.message);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <div className="password-strength">
          <small>{passwordStrength}</small>
        </div>
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default RegistrationForm;
