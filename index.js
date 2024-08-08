const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    console.log(query);
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`, {
      params: {
        access_token: process.env.MAPBOX_ACCESS_TOKEN,
        limit: 5
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while searching' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
