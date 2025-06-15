
// tomorrow-proxy-server.js
import express from 'express';
import axios   from 'axios';

const app  = express();
const PORT = process.env.PORT || 3000;

/** 🖼️ Map Tomorrow.io weatherCode ➜ custom icon URL */
const weatherIcons = {
  1000: 'https://yourcdn.com/icons/1000.png',
  1100: 'https://yourcdn.com/icons/1100.png',
  // … keep your other codes here …
};

app.get('/weather', async (req, res) => {
  try {
    /* 1️⃣  ── Primary request: Tomorrow.io ───────────────────────────── */
    const location = req.query.location || '29.9511,-90.0715';        // default NOLA
    const tmrResp  = await axios.get(
      'https://api.tomorrow.io/v4/weather/realtime',
      { params: { location, apikey: process.env.API_KEY } }
    );

    const v = tmrResp.data.data.values;                               // single datapoint
    const primary = {
      temperature: v.temperature,
      feelsLike:   v.temperatureApparent,
      condition:   v.weatherCode,
      weatherCode: v.weatherCode,
      iconUrl:     weatherIcons[v.weatherCode] || null
    };
    return res.json([primary]);                                       // ← done

  } catch (error) {

    /* 2️⃣  ── Fallback on Tomorrow.io 429 (rate-limit) ──────────────── */
    if (error.response?.status === 429) {
      try {
        const [lat, lon] = (req.query.location || '29.9511,-90.0715').split(',');
        const owmResp = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather',
          { params: { lat, lon, appid: process.env.OWM_KEY, units: 'imperial' } }
        );

        const d = owmResp.data;
        const fallback = {
          temperature: d.main.temp,
          feelsLike:   d.main.feels_like,
          condition:   d.weather[0].description,
          weatherCode: d.weather[0].id,
          iconUrl:     `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`
        };
        return res.json([fallback]);                                  // ← done

      } catch (owmErr) {
        return res.status(owmErr.response?.status || 500)
                 .json({ error: owmErr.message });
      }
    }

    /* 3️⃣ ── Any other Tomorrow.io error ───────────────────────────── */
    return res.status(error.response?.status || 500)
             .json({ error: error.message });
  }
});

/* ──────────────────────────────────────────────────────────────────── */
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
