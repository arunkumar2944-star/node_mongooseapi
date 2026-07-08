// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({
  path: './config/dev.env'
});

const userRoutes = require('./routes/userroutes');

const app = express();


// Middleware
app.use(cors()); // CRITICAL: Allows connection from Angular (usually http://localhost:4200)
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true }));

// Routes Link
app.use('/api/users', userRoutes);

// Database Connection
console.log(process.env.MONGODB_URL)
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected successfully to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
