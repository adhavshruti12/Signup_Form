import React, { useState } from 'react';
import axios from 'axios';
import validator from 'validator';  // Importing validator for email validation

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);  // State to manage loading (disable button)
  const [passwordMatch, setPasswordMatch] = useState(null);  // State to track password match
  const [passwordStrength, setPasswordStrength] = useState(''); // State to track password strength
  const [passwordFocused, setPasswordFocused] = useState(false);  // Track if password field is focused
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);  // Track if confirm password field is focused

  // Check password strength
  const checkPasswordStrength = (password) => {
    let strengthMessage = '';
    let isValid = true;

    if (password.length < 6) {
      strengthMessage = 'Password should be at least 6 characters long';
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) { // Checking for at least one special character
      strengthMessage = 'Password should include at least one special character';
      isValid = false;
    } else {
      strengthMessage = 'Password is strong';
    }
    
    setPasswordStrength(strengthMessage);
    return isValid;
  };

  // Handle password and confirm password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);

    // Check if passwords match
    setPasswordMatch(newPassword === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    // Check if passwords match
    setPasswordMatch(password === newConfirmPassword);
  };

  // Handle focus event for password field
  const handlePasswordFocus = () => {
    setPasswordFocused(true);
  };

  // Handle focus event for confirm password field
  const handleConfirmPasswordFocus = () => {
    setConfirmPasswordFocused(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation for email format
    if (!validator.isEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password matching check
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password strength check
    if (passwordStrength !== 'Password is strong') {
      setError('Please ensure your password meets the strength requirements');
      return;
    }

    setLoading(true);  // Start loading state

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        name,
        email,
        password,
        confirmPassword
      });
      setSuccessMessage(response.data.message);
      setError('');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setSuccessMessage('');
    } finally {
      setLoading(false);  // Stop loading state
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
          onFocus={handlePasswordFocus}
          required
        />
        {passwordFocused && (
          <div className="password-strength">
            <small>{passwordStrength}</small>
          </div>
        )}

        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          onFocus={handleConfirmPasswordFocus}
          required
        />
        {confirmPasswordFocused && (
  <div className={`password-match ${passwordMatch === true ? 'correct' : passwordMatch === false ? 'incorrect' : ''}`}>
    {passwordMatch === false ? (
      <small>Passwords do not match</small>
    ) : (
      passwordMatch === true && <small>Passwords match</small>
    )}
  </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
