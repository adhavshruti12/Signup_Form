const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const validator = require('validator');
require('dotenv').config();
const User = require('./models/User');

const app = express();

// Middleware for CORS
app.use(cors({
  origin: 'https://signup-form-frontend.vercel.app', // Your Vercel frontend URL
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Additional Headers for CORS (optional but helps in some cases)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://signup-form-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});


// Body parser
app.use(bodyParser.json());

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
  console.log('Registration request received:', req.body); // Debugging log
  const { name, email, password, confirmPassword } = req.body;

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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email ID already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
  console.log('Login request received:', req.body); // Debugging log
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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

// Default Route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Export for Vercel
module.exports = app;
