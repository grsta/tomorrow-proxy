const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// -------------------------------
// Weather Code → Video Map
// -------------------------------
const weatherIcons = {
  // CLEAR / CLOUDS
  1000: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Clear_vb05.mp4",             // Clear
  1100: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Mostly_Clear_ur4do.mp4",     // Mostly Clear
  1101: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Partly_Cloudy_ruhmbt.mp4",   // Partly Cloudy
  1102: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Mostly_Cloudy_xuhdmh.mp4",   // Mostly Cloudy
  1103: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Cloudy_yrb8sf.mp4",          // Cloudy

  // FOG / HAZE
  2000: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Fog_Windy_Snow_nwcf6b.mp4",
  2100: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Light_Fog_Dreary_krfj1b.mp4",

  // RAIN
  4000: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Drizzle_slyvl1.mp4",
  4200: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Light_Rain_p5xl4v.mp4",
  4201: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Heavy_Rain_eqsaph.mp4",

  // SNOW / MIX
  5000: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Snow_pkrdcb.mp4",
  5100: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Light_Snow_xrh1kc.mp4",
  5101: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Heavy_Snow_Freezing_Rain_37r7ge.mp4",

  // ICE PELLETS / HAIL
  7000: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Ice_Pellets_ref62.mp4",
  7101: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Heavy_Ice_Pellets_uhxwps.mp4",
  7102: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Light_Freezing_Rain_nfj7qf.mp4",

  // THUNDERSTORMS & EXTREMES
  8000: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Thunderstorm_9chfdo.mp4",
  8001: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Thunderstorm_Custom_bliznm.mp4",
  8002: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Thunderstorm_Kind_vzj96u.mp4",
  8003: "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Dry_Lightning_Custom_vxj9qo.mp4"
};

// Fallback icon
const defaultIconUrl = "https://res.cloudinary.com/defqishvh/video/upload/v172266511/Clear_vb05.mp4";


// -------------------------------
// Weather Route
// -------------------------------
app.get("/weather", async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat or lon query params." });
  }

  try {
    console.log(`Fetching weather for lat=${lat}, lon=${lon}`);

    const response = await axios.get("https://api.tomorrow.io/v4/weather/realtime", {
      params: {
        location: `${lat},${lon}`,
        apikey: process.env.TOMORROW_API_KEY
      }
    });

    const weatherData = response.data;

    const temperature = weatherData.data.values.temperature;
    const feelsLike = weatherData.data.values.temperatureApparent;
    const weatherCode = weatherData.data.values.weatherCode;

    console.log("Fetched temp:", temperature);
    console.log("Weather code:", weatherCode);

    let iconUrl = defaultIconUrl;
    if (weatherIcons[weatherCode]) {
      iconUrl = weatherIcons[weatherCode];
    }

    // ** ARRAY RESPONSE for Adalo **
    res.json([{
      temperature,
      feelsLike,
      condition: weatherCode,
      iconUrl
    }]);

  } catch (error) {
    console.error("Error fetching weather from Tomorrow.io:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

// -------------------------------
// START SERVER
// -------------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Tomorrow proxy running on port ${PORT}`);
});
