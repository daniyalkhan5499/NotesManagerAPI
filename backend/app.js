// Importing Dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Importing Configuration and Models
const config = require('./config.json');
const User = require('./models/user.model');
const Note = require('./models/note.model');
const { authenticateToken } = require('./utilities');

// Initialize Express app
const app = express();

// ✅ Middlewares
app.use(cors()); // Enabling Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON request bodies

// ✅ Connect to MongoDB
mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Test Home Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome Home" });
});


// ==========================
// ** User Routes: Create, Login, Get User Info ** 
// ==========================

// Create Account Route
app.post("/create-account", async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ error: true, message: "All fields required" });
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: true, message: "Email already exists" });
  }

  // Create new user and save
  const newUser = new User({ name, email, password });
  await newUser.save();

  // Generate JWT token
  const token = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

  // Return the token and user data
  res.status(201).json({ error: false, user: newUser, token, message: "Account created successfully" });
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: true, message: "Email and password are required" });
  }

  // Find user
  const userInfo = await User.findOne({ email });
  if (!userInfo) {
    return res.status(400).json({ error: true, message: "User not found" });
  }

  // Verify password
  if (userInfo.email === email && userInfo.password === password) {
    const token = jwt.sign({ userId: userInfo._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    return res.json({ error: false, email, accessToken: token, message: "Login Successful" });
  } else {
    return res.status(400).json({ error: true, message: "Invalid Credentials" });
  }
});

// Get User Info Route (with token authentication)
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const userInfo = await User.findOne({ _id: user._id });

  if (!userInfo) return res.sendStatus(401);

  return res.json({
    user: {
      name: userInfo.name,
      email: userInfo.email,
      "_id": userInfo._id,
      createdOn: userInfo.createdOn
    },
    message: "User info retrieved successfully"
  });
});

// ==========================
// ** Notes Routes: Create, Edit, Delete, Fetch ** 
// ==========================

// Add Note Route (with token authentication)
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { userId } = req.user.userId;

  // Validate input
  if (!title || !content) {
    return res.status(400).json({ error: true, message: "Title and content are required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId
    });

    await note.save();
    return res.json({ error: false, note, message: "Note Added Successfully" });

  } catch (err) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Edit Note Route
app.post("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res.status(400).json({ error: true, message: "No content provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note Not Found" });
    }

    // Update note fields
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();
    return res.json({ error: false, note, message: "Note updated successfully" });

  } catch (err) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Delete Note Route
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) return res.status(404).json({ error: true, message: "Note Not Found" });

    await Note.deleteOne({ _id: noteId, userId: user._id });
    return res.json({ error: false, message: "Note deleted successfully" });

  } catch (err) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Get All Notes Route
app.post("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json({ error: false, notes, message: "Notes retrieved successfully" });

  } catch (err) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Update Pinned Status Route
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) return res.status(404).json({ error: true, message: "Note Not Found" });

    note.isPinned = isPinned;
    await note.save();
    return res.json({ error: false, note, message: "Note pinned status updated" });

  } catch (err) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// ✅ Start Server
app.listen(8000, () => {
  console.log("🚀 Server running at http://localhost:8000");
});
