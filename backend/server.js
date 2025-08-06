const express = require('express');
const cors = require('cors');
const fs = require('fs');
const uploadRoutes = require('./routes/upload');
const supabase = require('./config/supabase');
const sql = require('./config/supabase').default || require('./config/supabase');
require('dotenv').config(); 
const imagekit = require("./config/imagekit");

const PORT = 3001;

const app = require('./app');

// Middleware is now handled in app.js


// Test routes are now handled in app.js

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});