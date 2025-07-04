
// index.js ─ Weather proxy for Adalo
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors  = require("cors");

const app  = express();
app.use(cors());

// 🔗 Animated Cloudinary icons ─ one for every relevant Tomorrow.io code
const weatherIcons = {
  /* ─────────────── CLEAR / CLOUDS ─────────────── */
  1000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226621/Sun_vlifro.mp4",                     // Clear
  1100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226619/Sun_Clouds_kfb1c9.mp4",             // Mostly Clear
  1101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226602/Partly_Cloudy_xhcdwf.mp4",          // Partly Cloudy
  1102: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226600/Mostly_Cloudy_eqdbmn.mp4",          // Mostly Cloudy
  1001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226592/Cloudy_ujjjyr.mp4",                 // Cloudy

  /* ─────────────── WIND / FOG VARIANTS ────────── */
  2000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Windy_Snow_wdaet6.mp4",             // Fog / Windy Snow
  2100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226598/Mix_Wind_t711q0.mp4",               // Light Fog / Breezy

  /* ─────────────── DRIZZLE / RAIN ─────────────── */
  4000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226610/Rain_I_qijqzs.mp4",                 // Drizzle
  4001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226611/Rain_Shower_j5qs3f.mp4",            // Rain
  4200: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226595/Light_Rain_azdyyv.mp4",             // Light Rain
  4201: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226596/Convective_Rain_sasinh.mp4",        // Heavy / Convective Rain

  /* ─────────────── SNOW / MIX ─────────────────── */
  5000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226617/Snow_apib0s.mp4",                   // Snow
  5001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226616/Snow_Shower_uqb03b.mp4",            // Flurries
  5100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226597/Light_Snow_gswdxh.mp4",             // Light Snow
  5101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226613/Snow_Sun_wdvphe.mp4",               // Heavy Snow
  6000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226599/Mix_rwvamd.mp4",                    // Freezing Drizzle / Mix
  6001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226606/Rain_Snow_Shower_o77gbf.mp4",       // Freezing Rain
  6200: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226584/Convective_Mix_dhw2p4.mp4",         // Light Freezing Rain
  6201: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226594/Cumulonimbus_Clouds_Sun_wvxhcp.mp4",// Heavy Freezing Rain

  /* ─────────────── ICE PELLETS / WINTRY MIX ───── */
  7000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226604/Rain_Snow_Sun_xoxeqr.mp4",          // Ice Pellets
  7101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226631/Thunderstorm_Wind_vdvny4.mp4",      // Heavy Ice Pellets
  7102: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226634/Thunderstorm_Mix_Sun_kzlkld.mp4",   // Light Ice Pellets

  /* ─────────────── THUNDER & EXTREMES ─────────── */
  8000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_zu58xq.mp4",           // Thunderstorm
  5002: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226626/Thundersnow_tx2ae5.mp4",            // Thundersnow (custom)
  5003: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226624/Thundersnow_Wind_onvm7v.mp4",       // Thundersnow + Wind (custom)
  3002: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226591/Dry_Lightning_qcgmuh.mp4",           // Dry Lightning (custom)
  "night": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226601/Night_sykp1o.mp4"

};



/**
 * GET /weather?lat=<number>&lon=<number>
 * Returns: { temperature, feelsLike, weatherCode, iconUrl }
 */
let cachedWeather = null;
let lastFetched = null;

app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat or lon query params." });
  }

  const now = Date.now();
  const cacheDuration = 15 * 60 * 1000; // 15 minutes

  if (cachedWeather && (now - lastFetched < cacheDuration)) {
    console.log("Serving cached weather data...");
    return res.json(cachedWeather);
  }

  try {
    console.log("Fetching fresh weather data...");

    const url = 'https://api.tomorrow.io/v4/weather/realtime';
    const response = await axios.get(url, {
      params: {
        location: `${lat},${lon}`,
        apikey: process.env.TOMORROW_API_KEY,
        fields: ['temperature', 'temperatureApparent', 'weatherCode', 'humidity', 'windSpeed']
      }
    });

    const values = response.data.data.values;
    const weatherCode = values.weatherCode;

    const currentHour = new Date().getHours();
    const isNight = currentHour < 6 || currentHour > 18;

    let iconUrl = weatherIcons[weatherCode] || null;

    if (isNight && (weatherCode === 1000 || weatherCode === 1100)) {
      iconUrl = weatherIcons['night'];
    }

    return res.json({
        updated_at: new Date().toISOString(),
        temperature: Math.round(values.temperature),
        feelslike: Math.round(values.temperatureApparent),
        weatherCode,
        humidity: Math.round(values.humidity),
        windspeed: Math.round(values.windSpeed),
        iconUrl
    }
});


    return res.json(weatherObject);

  } catch (err) {
    console.error("Tomorrow.io error:", err.message);
    return res.status(500).json({ error: "Failed to fetch weather data." });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Weather proxy running on port ${PORT}`);
});
