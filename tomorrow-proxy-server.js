
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
// Weather code → icon URL map
const weatherIcons = {
  1000: "https://yourcdn.com/icons/1000.png",
  1001: "https://yourcdn.com/icons/1001.png",
  1100: "https://yourcdn.com/icons/1100.png",
  1101: "https://yourcdn.com/icons/1101.png",
  1102: "https://yourcdn.com/icons/1102.png",
  2000: "https://yourcdn.com/icons/2000.png",
  2100: "https://yourcdn.com/icons/2100.png",
  3000: "https://yourcdn.com/icons/3000.png",
  3001: "https://yourcdn.com/icons/3001.png",
  3002: "https://yourcdn.com/icons/3002.png",
  4000: "https://yourcdn.com/icons/4000.png",
  4001: "https://yourcdn.com/icons/4001.png",
  4200: "https://yourcdn.com/icons/4200.png",
  4201: "https://yourcdn.com/icons/4201.png",
  5000: "https://yourcdn.com/icons/5000.png",
  5001: "https://yourcdn.com/icons/5001.png",
  5100: "https://yourcdn.com/icons/5100.png",
  5101: "https://yourcdn.com/icons/5101.png",
  6000: "https://yourcdn.com/icons/6000.png",
  6001: "https://yourcdn.com/icons/6001.png",
  6200: "https://yourcdn.com/icons/6200.png",
  6201: "https://yourcdn.com/icons/6201.png",
  7000: "https://yourcdn.com/icons/7000.png",
  7101: "https://yourcdn.com/icons/7101.png",
  7102: "https://yourcdn.com/icons/7102.png"
};

const API_KEY = 'lXFnAVn8p9WiNDhgjhG9tAvvy0Gf9aFDT';

app.get('/weather', async (req, res) => {
  try {
    // latitude,longitude passed from Adalo (or default)
    const location = req.query.location || '29.9511,-90.0715';

    // ➜ KEY GOES IN THE QUERY STRING, not a header
    const response = await axios.get(
      'https://api.tomorrow.io/v4/weather/realtime',
      {
        params: {
          location,
          apikey: process.env.API_KEY       // pulled from Render env var
        }
      }
    );

    // Return ONLY the values object (flat JSON for Adalo)
 console.log('Full API response:', response.data);
res.json(response.data);

result.iconUrl = weatherIcons[result.weatherCode] || null;
res.json([result]);
 
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json({ error: error.response?.data || error.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
