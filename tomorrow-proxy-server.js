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
  1000: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266111/Clear_vb05.mp4",         // Clear
  1100: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266171/Mostly_Clear_ur4ob0.mp4", // Mostly Clear
  1101: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266137/Partly_Cloudy_nubtcn.mp4", // Partly Cloudy
  1102: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266154/Mostly_Cloudy_yudshn.mp4", // Mostly Cloudy
  1001: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266124/Cloudy_eztp9f.mp4",        // Cloudy

  // FOG / HAZE
  2100: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266181/Fog_Windy_Snow_mr6cfb.mp4", 
  2000: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266205/Light_Fog_Dreary_krjjlp.mp4",

  // RAIN
  4200: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266191/Drizzle_kyltib.mp4",
  4000: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266187/Light_Rain_sy4syl.mp4",
  4201: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266198/Heavy_Rain_zgxqph.mp4",

  // SNOW / MIX
  5000: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266213/Snow_uqvxx4.mp4",
  5100: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266225/Flurries_wlymwp.mp4",
  5001: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266233/Light_Snow_gklhck.mp4",
  5101: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266243/Freezing_Drizzle_Mix_kyktdb.mp4",
  5110: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266254/Heavy_Freezing_Rain_377gfp.mp4",

  // ICE PELLETS / HAIL
  7000: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266264/Ice_Pellets_refuzc.mp4",
  7101: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266271/Heavy_Ice_Pellets_wlymwp.mp4",
  7102: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266278/Light_Freezing_Rain_p7fjqk.mp4",

  // THUNDERSTORMS & EXTREMES
  8000: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266284/Thunderstorm_s6fhcb.mp4",
  8001: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266291/Thunderstorm_Custom_blizam.mp4",
  8002: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266298/Thunderstorm_Kindi_vy2djo.mp4",
  8003: "https://res.cloudinary.com/defdqhshh/video/upload/v1722266305/Dry_Lightning_Custom_vzkgpo.mp4"
};

// fallback icon
const defaultIconUrl = "https://res.cloudinary.com/defdqhshh/video/upload/v1722266111/Clear_vb05.mp4";

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
