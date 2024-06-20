const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./connect'); // Assuming this is your database connection
const UserRoutes = require('./routes/UserRoutes');
const app = express();
const port = 5000;

const apiKey = process.env.API_KEY
// Middleware for CORS
app.use(
  cors({
    origin: [process.env.CORS_ORIGIN],
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// Test API endpoint
app.get('/', async (req, res) => {
  res.json({ message: 'Server is running' });
});


// Middleware to check API key
const checkApiKey = (req, res, next) => {
  const apiKeyHeader = req.headers['x-api-key'];
  if (apiKeyHeader && apiKeyHeader === apiKey) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
};

// Apply checkApiKey middleware to all routes under '/api/ojiiz'
app.use('/api/ojiiz', checkApiKey, UserRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
