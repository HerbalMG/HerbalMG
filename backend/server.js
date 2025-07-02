const express = require('express');
const cors = require('cors');
const fs = require('fs');
const uploadRoutes = require('./routes/upload');
const supabase = require('./config/supabase');
const sql = require('./config/supabase').default || require('./config/supabase');
require('dotenv').config(); // This loads .env variables into process.env


const app = express();
const PORT = 3001;
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use(cors());
app.use('/api', uploadRoutes);
app.use('/api/blog', require('./routes/blog'));
app.use('/api/delivery_status', require('./routes/delivery_status'));
app.use('/api/user', require('./routes/user'));
app.use('/api/product_price', require('./routes/product_price'));
app.use('/api/product', require('./routes/product'));
app.use('/api/doctor', require('./routes/doctor'));
app.use('/api/banner', require('./routes/banner'));
app.use('/api/book', require('./routes/book'));
app.use('/api/brand', require('./routes/brand'));
app.use('/api/order', require('./routes/order'));

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

// Test route to verify Postgres connection
app.get('/api/postgres-test', async (req, res) => {
  try {
    const result = await sql`SELECT 1 as test`;
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});


// Example usage in a route

// Example: Fetch data from a table
async function getData() {
  const { data, error } = await supabase
    .from('your_table')
    .select('*');
  if (error) {
    console.error(error);
    return null;
  }
  return data;
}