const express = require('express');
const cors = require('cors');
const locationRoutes = require('./routes/locationRoutes');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', locationRoutes);

module.exports = app;
