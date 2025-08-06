const axios = require('axios');

async function detectLocation(req, res) {
  const { lat, lon } = req.body;
  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude required' });
  }
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'YourAppName/1.0' }
    });

    const data = response.data;
    const pincode = data.address && (data.address.postcode || data.address.zipcode);

    if (pincode) {
      return res.json({ pincode });
    } else {
      return res.status(404).json({ message: 'Pincode not found for location' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reverse geocode location' });
  }
}

async function searchPincodes(req, res) {
  const query = req.params.query;
  let url;
  if (/^\d+$/.test(query)) {
    url = `https://api.postalpincode.in/pincode/${encodeURIComponent(query)}`;
  } else {
    url = `https://api.postalpincode.in/postoffice/${encodeURIComponent(query)}`;
  }

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (Array.isArray(data) && data[0].Status === "Success") {
      const pincodes = data[0].PostOffice.map(po => ({
        Pincode: po.Pincode,
        Name: po.Name,
        District: po.District,
        State: po.State
      }));
      res.json(pincodes);
    } else {
      res.status(404).json({ error: "No pincodes found for this query" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pincodes" });
  }
}

module.exports = {
  detectLocation,
  searchPincodes,
};
