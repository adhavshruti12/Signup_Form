const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const User = require('./models/User');

const app = express();

// Middleware: Parse JSON and Enable CORS
app.use(bodyParser.json());
app.use(cors()); // Relaxed CORS for debugging

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err.message));

// Debugging: Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// API Routes
app.post('/api/register', async (req, res) => {
  console.log('Received registration request:', req.body);

  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    console.log('Checked for existing user:', existingUser);

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    console.log('User registered successfully');

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error occurred during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Health Check Route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
