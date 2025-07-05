const express = require('express');
const axios = require('axios');

const app = express();

const weatherDescriptions = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
};

const weatherVideos = {
  0: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Sun_vlifro.mp4",
  1: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Partly_Cloudy_xhcdwf.mp4",
  2: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Partly_Cloudy_xhcdwf.mp4",
  3: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mostly_Cloudy_eqdbmn.mp4",
  45: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mix_rwvamd.mp4",
  48: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mix_rwvamd.mp4",
  51: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",
  53: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",
  55: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",
  61: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",
  63: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",
  65: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_I_qijqzs.mp4",
  71: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Snow_gswdxh.mp4",
  73: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_apib0s.mp4",
  75: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_Shower_uqb03b.mp4",
  80: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",
  81: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",
  82: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_I_qijqzs.mp4",
  95: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_zu58xq.mp4",
  96: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_Sun_pgrbjd.mp4",
  99: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_Sun_pgrbjd.mp4",
  night_clear: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4"
};

app.get('/weather', async (req, res) => {
  try {
    const lat = req.query.lat || 38.9072;
    const lon = req.query.lon || -77.0369;

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

    const now = new Date();
    const currentHour = now.toISOString().slice(0, 13);

    let foundIndex = hourly.time.findIndex(t => t.startsWith(currentHour));
    if (foundIndex === -1) foundIndex = 0;

    const tempVal = hourly.temperature_2m[foundIndex];
    const humidityVal = hourly.relative_humidity_2m[foundIndex];
    const precipProbVal = hourly.precipitation_probability[foundIndex];
    const conditionCode = hourly.weathercode[foundIndex];
    const windSpeedVal = hourly.windspeed_10m[foundIndex];

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

    const conditionText = weatherDescriptions[conditionCode] || "Unknown";

    res.json([{
      temperature: tempVal,
      feelsLike: tempVal,
      precipitationProbability: precipProbVal,
      windSpeed: windSpeedVal,
      humidity: humidityVal,
      condition: conditionText,
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
