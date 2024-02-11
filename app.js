const express = require('express');
const bodyParser = require('body-parser');
const authController = require('./authController');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', authController);

// Start the server
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
