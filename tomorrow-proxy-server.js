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
  95: "Thunderstorm"
};

const videoLinks = {
  clearDay: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Sun_vlifro.mp4",
  clearNight: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4",
  partlyCloudy: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Partly_Cloudy_xhcdwf.mp4",
  cloudy: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Cloudy_ujjjyr.mp4",
  mostlyCloudy: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mostly_Cloudy_eqdbmn.mp4",
  fog: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mostly_Cloudy_eqdbmn.mp4",
  lightRain: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",
  rain: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_I_qijqzs.mp4",
  rainWind: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Wind_ddpjhp.mp4",
  thunderstormDay: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_Sun_pgrbjd.mp4",
  thunderstormNight: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_zu58xq.mp4",
  snowDay: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_Sun_wdvphe.mp4",
  snowNight: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_apib0s.mp4",
  snowWind: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Windy_Snow_wdaet6.mp4",
  mixed: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mix_rwvamd.mp4",
  mixedWind: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mix_Wind_t711q0.mp4",
  default: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Cloudy_ujjjyr.mp4"
};

app.get('/weather', async (req, res) => {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast';

    const params = {
      latitude: 38.9072,
      longitude: -77.0369,
      hourly: "temperature_2m,humidity_2m,precipitation_probability,weathercode,windspeed_10m",
      timezone: "America/New_York",
      temperature_unit: "fahrenheit"
    };

    console.log("Making request to:", url, "with params:", params);

    const response = await axios.get(url, { params });

    const hourly = response.data.hourly;

    const now = new Date();
    const currentHour = now.toISOString().slice(0, 13); // e.g. "2025-07-05T12"

    let foundIndex = hourly.time.findIndex(t => t.startsWith(currentHour));
    if (foundIndex === -1) foundIndex = 0;

    const tempVal = hourly.temperature_2m[foundIndex];
    const humidityVal = hourly.humidity_2m[foundIndex];
    const precipProbVal = hourly.precipitation_probability[foundIndex];
    const conditionCode = hourly.weathercode[foundIndex];
    const windSpeedVal = hourly.windspeed_10m[foundIndex];

    const temperature = `${tempVal}°F`;
    const feelsLike = `${tempVal}°F`;
    const humidity = `${humidityVal}%`;
    const precipitationProbability = `${precipProbVal}%`;
    const conditionText = weatherDescriptions[conditionCode] || "Unknown";
    const windSpeed = `${windSpeedVal}
