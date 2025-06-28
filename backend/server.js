const express = require('express');
const cors = require('cors');
const fs = require('fs');
const uploadRoutes = require('./routes/upload');
require('dotenv').config(); // This loads .env variables into process.env


const app = express();
const PORT = 3001;

app.use(cors());
app.use('/api', uploadRoutes);
app.use(cors({ origin: "http://localhost:5173" }));

// Endpoint to return unique pincodes
// app.get('/api/pincodes', (req, res) => {
//   fs.readFile('./data.json', 'utf8', (err, jsonData) => {
//     if (err) {
//       console.error('Failed to read data.json:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     try {
//       const data = JSON.parse(jsonData);
//       const pincodes = new Set();

//       data.Pincodes.forEach(item => {
//         pincodes.add(item.Pincode);
//       });

//       res.json(Array.from(pincodes));
//     } catch (parseErr) {
//       console.error('Error parsing data.json:', parseErr);
//       res.status(500).json({ error: 'Invalid JSON format' });
//     }
//   });
// });

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
