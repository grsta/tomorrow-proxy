const express = require('express');
const axios = require('axios');

const app = express();

// ✅ YOUR FULL CLOUDINARY VIDEO MAPPING
const weatherVideos = {
  0: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Sun_vlifro.mp4",                         // Clear sky daytime
  1: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Partly_Cloudy_xhcdwf.mp4",               // Mainly clear
  2: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Partly_Cloudy_xhcdwf.mp4",               // Partly cloudy
  3: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mostly_Cloudy_eqdbmn.mp4",               // Overcast
  45: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mix_rwvamd.mp4",                        // Fog
  48: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mix_rwvamd.mp4",                        // Depositing rime fog
  51: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",                 // Drizzle light
  53: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",                 // Drizzle moderate
  55: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",                // Drizzle dense
  61: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",                 // Rain slight
  63: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",                // Rain moderate
  65: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_I_qijqzs.mp4",                     // Rain heavy
  71: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Snow_gswdxh.mp4",                 // Snow slight
  73: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_apib0s.mp4",                       // Snow moderate
  75: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_Shower_uqb03b.mp4",                // Snow heavy
  80: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",                // Rain showers slight
  81: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",                // Rain showers moderate
  82: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_I_qijqzs.mp4",                     // Rain showers violent
  95: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_zu58xq.mp4",              // Thunderstorm
  96: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_Sun_pgrbjd.mp4",          // Thunderstorm + hail slight
  99: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_Sun_pgrbjd.mp4",          // Thunderstorm + hail heavy
  // Add night-specific clear sky:
  night_clear: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4"
};

app.get('/weather', async (req, res) => {
  try {
    // ✅ Accept lat/lon from query string
    const lat = req.query.lat || 38.9072;     // default DC lat
    const lon = req.query.lon || -77.0369;    // default DC lon

    const url = "https://api.open-meteo.com/v1/forecast";

    const params = {
      latitude: lat,
      longitude: lon,
      hourly: "temperature_2m,relative_humidity_2m,precipitation_probability,weathercode,windspeed_10m",
      timezone: "America/New_York",
      temperature_unit: "fahrenheit"
    };

    console.log("Making request to:", url);
    console.log("Params:", params);

    const response = await axios.get(url, { params });
    const hourly = response.data.hourly;

    // Get current hour timestamp (e.g. "2025-07-05T23")
    const now = new Date();
    const currentHour = now.toISOString().slice(0, 13);

    let foundIndex = hourly.time.findIndex(t => t.startsWith(currentHour));
    if (foundIndex === -1) foundIndex = 0;

    const tempVal = hourly.temperature_2m[foundIndex];
    const humidityVal = hourly.relative_humidity_2m[foundIndex];
    const precipProbVal = hourly.precipitation_probability[foundIndex];
    const conditionCode = hourly.weathercode[foundIndex];
    const windSpeedVal = hourly.windspeed_10m[foundIndex];

    // Day/night logic
    const hourNum = Number(currentHour.slice(11, 13));
    const isDay = (hourNum >= 6 && hourNum < 19) ? 1 : 0;

    let iconUrl;
    if (isDay) {
      iconUrl = weatherVideos[conditionCode] || null;
    } else {
      if (conditionCode === 0) {
        iconUrl = weatherVideos["night_clear"];
      } else {
        iconUrl = weatherVideos[conditionCode] || null;
      }
    }

    res.json([{
      temperature: tempVal,
      feelsLike: tempVal,
      precipitationProbability: precipProbVal,
      windSpeed: windSpeedVal,
      humidity: humidityVal,
      condition: conditionCode,
      isDay,
      iconUrl
    }]);
  } catch (error) {
    console.error("Error fetching weather:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
