const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // Dynamic import for node-fetch

// Import models
const User = require('./models/User');
const Script = require('./models/Script');

const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Enable CORS for frontend-backend communication
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB:', err));

// Route for user registration (signup)
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Route for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Route to handle script generation using Hugging Face
app.post('/generate-script', async (req, res) => {
  const { title, description, userId } = req.body;

  try {
    const prompt = `Write a script about: ${title}. Details: ${description}`;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/gpt2', // Use GPT-2 model
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`, // Use your Hugging Face API key
        },
        body: JSON.stringify({ inputs: prompt }), // Send the prompt in the request body
      }
    );

    const data = await response.json();
    console.log('Hugging Face API Response:', data);

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data[0] || !data[0].generated_text) {
      throw new Error('No generated text returned from Hugging Face API');
    }

    const generatedText = data[0].generated_text.trim();

    // Save the script to MongoDB
    const script = new Script({ title, description, content: generatedText, userId });
    await script.save();

    res.json(generatedText);
  } catch (error) {
    console.error('Error generating script:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch scripts for a user
app.get('/scripts/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const scripts = await Script.find({ userId });
    res.json(scripts);
  } catch (error) {
    console.error('Error fetching scripts:', error);
    res.status(500).json({ error: 'Failed to fetch scripts' });
  }
});

// Route to save a script
app.post('/scripts', async (req, res) => {
    const { title, description, content, userId } = req.body;
  
    try {
      const script = new Script({ title, description, content, userId });
      await script.save();
      res.status(201).json({ message: 'Script saved successfully' });
    } catch (error) {
      console.error('Error saving script:', error);
      res.status(500).json({ error: 'Failed to save script' });
    }
  });
  
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});