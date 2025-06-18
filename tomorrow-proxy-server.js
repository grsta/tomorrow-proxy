
// index.js ─ Weather proxy for Adalo
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors  = require("cors");

const app  = express();
app.use(cors());

// 🔗 Animated Cloudinary icons ─ one for every relevant Tomorrow.io code
const weatherIcons = {
  1000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Sun_transparent.mp4",
  1100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Sun_&_Clouds_transparent.mp4",
  1101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Partly_Cloudy_transparent.mp4",
  1102: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Mostly_Cloudy_transparent.mp4",
  1001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Night_transparent.mp4",

  2000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Windy_Snow_transparent.mp4",
  2100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Mix_&_Wind_transparent.mp4",

  4000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Rain_I_transparent.mp4",
  4001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Rain_Shower_transparent.mp4",
  4200: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Rain_&_Wind_transparent.mp4",
  4201: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Convective_Rain_transparent.mp4",

  5000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Snow_transparent.mp4",
  5001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Snow_Shower_transparent.mp4",
  5100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Light_Snow_transparent.mp4",
  5101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Snow_&_Sun_transparent.mp4",

  6000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Mix_transparent.mp4",
  6001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Mix_&_Wind_transparent.mp4",
  6200: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Convective_Mix_transparent.mp4",
  6201: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Thunderstorm_Mix_transparent.mp4",

  7000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Thunderstorm_&_Sun_transparent.mp4",
  7101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Thunderstorm_+_Wind_transparent.mp4",
  7102: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Thunderstorm_Mix_+_Sun_transparent.mp4",

  8000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/f_auto,vc_auto,q_auto:eco/v1750222700/Thunderstorm_transparent.mp4"
};


/**
 * GET /weather?lat=<number>&lon=<number>
 * Returns: { temperature, feelsLike, weatherCode, iconUrl }
 */
app.get("/weather", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat or lon query params" });
  }

  try {
    // Tomorrow.io Timelines - current snapshot
    const apiURL = "https://api.tomorrow.io/v4/timelines";
    const response = await axios.get(apiURL, {
      params: {
        location: `${lat},${lon}`,
       fields: ["temperature", "temperatureApparent", "weatherCode", "humidity", "windSpeed"],

        timesteps: ["current"],
        units: "imperial",
        apikey: process.env.TOMORROW_API_KEY
      }
    });

    // Drill down to current values
    const values = response.data.data.timelines[0].intervals[0].values;
    const weatherCode = values.weatherCode;

    // Shape the JSON exactly how Adalo expects it
   res.json([
  {
    temperature : Math.round(values.temperature),
    feelsLike   : Math.round(values.temperatureApparent),
    weatherCode,
    humidity    : Math.round(values.humidity),
    windSpeed   : Math.round(values.windSpeed),
    iconUrl     : weatherIcons[weatherCode] || null
  }
]);

  } catch (err) {
    console.error("Tomorrow.io error:", err.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Spin it up
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Weather proxy running on ${PORT}`));
