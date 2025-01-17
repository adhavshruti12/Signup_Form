import React, { useState } from 'react';
import axios from 'axios';
import validator from 'validator'; // Email validation
import { useNavigate } from 'react-router-dom'; // For navigation

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState('');

  const navigate = useNavigate();

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

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
    setPasswordMatch(newPassword === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordMatch(password === newConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validator.isEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength !== 'Password is strong') {
      setError('Please ensure your password meets the strength requirements');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'https://deploy-mern-5w5r.vercel.app/register',
        { name, email, password,confirmPassword}
      );
      setSuccessMessage(response.data.message);
      setError('');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigate('/login');
    } catch (err) {
    setError(err.response && err.response.data && err.response.data.message ? err.response.data.message : 'An error occurred');
     setSuccessMessage('');
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
          onChange={handlePasswordChange}
          required
        />
        <div className="password-strength">
          <small>{passwordStrength}</small>
        </div>

        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
        <div
          className={`password-match ${
            passwordMatch ? 'correct' : 'incorrect'
          }`}
        >
          {passwordMatch === false && <small>Passwords do not match</small>}
          {passwordMatch === true && <small>Passwords match</small>}
        </div>

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
