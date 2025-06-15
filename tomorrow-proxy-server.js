
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


app.get('/weather', async (req, res) => {
  try {
    // 1️⃣  Primary request – Tomorrow.io
    const location = req.query.location || '29.9511,-90.0715'; // default NOLA
    const tmrRes = await axios.get(
      'https://api.tomorrow.io/v4/weather/realtime',
      {
        params: { location, apikey: process.env.API_KEY }
      }
    );

    // 👉 grab the single datapoint correctly
const values = tmrRes.data.data.values;

const result = {
  temperature: values.temperature,
  feelsLike:   values.temperatureApparent,
  condition:   values.weatherCode,          // short code
  weatherCode: values.weatherCode,
  iconUrl:     weatherIcons[values.weatherCode] || null
};


    // 2️⃣  Tomorrow.io hit a rate-limit (429) → fallback to OpenWeatherMap
    if (error.response?.status === 429) {
      try {
        const [lat, lon] = (req.query.location || '29.9511,-90.0715').split(',');
        const owmRes = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather',
          {
            params: {
              lat,
              lon,
              appid: process.env.OWM_KEY,
              units: 'imperial'           // use metric for °C
            }
          }
        );

        const data = owmRes.data;
        const fallback = {
          temperature: data.main.temp,
          feelsLike:   data.main.feels_like,
          condition:   data.weather[0].description,
          weatherCode: data.weather[0].id,
          iconUrl:     `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        };

        return res.json([fallback]);          // send same array shape

      } catch (owmErr) {
        return res.status(owmErr.response?.status || 500)
                  .json({ error: owmErr.message });
      }
    }

    // 3️⃣  Any other Tomorrow.io error
    return res.status(error.response?.status || 500)
              .json({ error: error.message });
  }
});
