require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const memberRoutes = require('./routes/memberRoutes.js');
const trainerRoutes = require('./routes/trainerRoutes.js');
const feeRoutes = require('./routes/feeRoutes.js');

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/members', memberRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/fees', feeRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Gym Management API is running' });
});

// Simple global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});