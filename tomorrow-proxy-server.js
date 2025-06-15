
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = 'lXFnAVn8p9WiNDhgjhG9tAvvy0Gf9aFDT';

app.get('/weather', async (req, res) => {
  try {
    const location = req.query.location || '29.9511,-90.0715';

    const response = await axios.get('https://api.tomorrow.io/v4/weather/realtime', {
      params: { location },
      headers: {
        'apikey': API_KEY
      }
    });

    res.json(response.data.data.values);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
