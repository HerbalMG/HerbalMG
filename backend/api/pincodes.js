const fetch = require('node-fetch'); // Add this if not already
const data = require('./data.json'); // Optional: if not using fs.readFile

app.get('/api/detect-location', async (req, res) => {
  try {
    const ipRes = await fetch('https://ipapi.co/json/');
    const ipData = await ipRes.json();

    const userCity = ipData.city?.toLowerCase();
    const userState = ipData.region?.toLowerCase();

    const match = data.Pincodes.find(item =>
      item.City.toLowerCase() === userCity &&
      item.State.toLowerCase() === userState
    );

    if (match) {
      res.json({ pincode: match.Pincode });
    } else {
      res.status(404).json({ message: 'Pincode not found for your location' });
    }
  } catch (err) {
    console.error('Geo detection error:', err);
    res.status(500).json({ message: 'Failed to detect location' });
  }
});
