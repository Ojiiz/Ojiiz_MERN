const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./connect'); // Assuming this is your database connection
const UserRoutes = require('./routes/UserRoutes');
const app = express();
const port = process.env.PORT || 5000;

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


// API routes
app.use('/api/ojiiz', UserRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
