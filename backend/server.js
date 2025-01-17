const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const validator = require('validator');
require('dotenv').config();
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors({
  origin: 'https://signup-form-frontend.vercel.app', // Frontend deployed URL
  methods: ['GET', 'POST'], // Allowed methods
  credentials: true, // If cookies are used
}));
app.use(bodyParser.json()); // Parse incoming JSON requests

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err.message));

// Registration Endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Input Validation
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password should be at least 6 characters long' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Password and Confirm Password do not match' });
  }

  try {
    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email ID already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ name: user.name, message: `Welcome, ${user.name}!` });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Default Route for Health Check
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Export for Vercel Serverless Functions
module.exports = app;
