
/* ------------------------------------------------------------------ */
/*  tomorrow-proxy-server.js  –  Weather proxy with icon + label      */
/* ------------------------------------------------------------------ */

import express from 'express';
import axios   from 'axios';

const app  = express();
const PORT = process.env.PORT || 3000;

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*  ICON & LABEL MAPS  - customize these to match your own graphics   */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const conditionLabels = {
  // Tomorrow.io condition codes  ────────────────────────────────────
  1000: 'Clear',
  1100: 'Mostly Clear',
  1101: 'Partly Cloudy',
  1102: 'Mostly Cloudy',
  4000: 'Drizzle',
  4200: 'Light Rain',
  4201: 'Heavy Rain',
  5000: 'Snow',
  8000: 'Thunderstorm',
};

const iconMap = {
  1000: 'https://yourcdn.com/icons/sun.png',
  1100: 'https://yourcdn.com/icons/mostly-clear.png',
  1101: 'https://yourcdn.com/icons/partly-cloudy.png',
  1102: 'https://yourcdn.com/icons/mostly-cloudy.png',
  4201: 'https://yourcdn.com/icons/heavy-rain.png',
  default: 'https://yourcdn.com/icons/default.png',
};

/* ------------------------------------------------------------------ */
/*  /weather  –  Primary: Tomorrow.io  ➜  Fallback: OpenWeather       */
/* ------------------------------------------------------------------ */
app.get('/weather', async (req, res) => {
  try {
    /* 1️⃣  Tomorrow.io realtime ------------------------------------ */
    const location = req.query.location || '29.9511,-90.0715';        // default NOLA
    const tmrRes   = await axios.get(
      'https://api.tomorrow.io/v4/weather/realtime',
      { params: { location, apikey: process.env.API_KEY } }
    );

    const v = tmrRes.data.data.values;
    const primary = {
      temperature : v.temperature,
      feelsLike   : v.temperatureApparent,
      condition   : conditionLabels[v.weatherCode] || `Code ${v.weatherCode}`,
      weatherCode : v.weatherCode,
      iconUrl     : iconMap[v.weatherCode] || iconMap.default,
    };

    return res.json([primary]);                                       // always array

  } catch (err) {
    /* 2️⃣  Hit Tomorrow.io rate-limit (status 429) –> fallback ------ */
    if (err.response?.status === 429) {
      try {
        const [lat, lon] = (req.query.location || '29.9511,-90.0715').split(',');
        const owmRes = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather',
          { params: { lat, lon, appid: process.env.OWM_KEY, units: 'imperial' } }
        );

        const d = owmRes.data;
        const fallback = {
          temperature : d.main.temp,
          feelsLike   : d.main.feels_like,
          condition   : d.weather[0].description,                     // already text
          weatherCode : d.weather[0].id,
          iconUrl     : `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`,
        };

        return res.json([fallback]);
      } catch (owmErr) {
        return res.status(owmErr.response?.status || 500)
                  .json({ error: owmErr.message });
      }
    }

    /* 3️⃣  Any other Tomorrow.io error ----------------------------- */
    return res.status(err.response?.status || 500)
              .json({ error: err.message });
  }
});

/* ------------------------------------------------------------------ */
app.listen(PORT, () => console.log(`🌤️  Proxy running on port ${PORT}`));
/* ------------------------------------------------------------------ */
