
const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

const weatherIcons = {
  1000: "https://openweathermap.org/img/wn/01d@2x.png", // Clear
  1100: "https://openweathermap.org/img/wn/02d@2x.png", // Mostly Clear
  1101: "https://openweathermap.org/img/wn/03d@2x.png", // Partly Cloudy
  1102: "https://openweathermap.org/img/wn/04d@2x.png", // Mostly Cloudy
  1001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/cloudy.mp4", // Cloudy
  2000: "https://openweathermap.org/img/wn/50d@2x.png", // Fog
  4000: "https://openweathermap.org/img/wn/09d@2x.png", // Drizzle
  4200: "https://openweathermap.org/img/wn/10d@2x.png", // Light Rain
  4001: "https://openweathermap.org/img/wn/10d@2x.png", // Rain
  4201: "https://openweathermap.org/img/wn/09d@2x.png", // Heavy Rain
  5001: "https://openweathermap.org/img/wn/13d@2x.png", // Flurries
  5100: "https://openweathermap.org/img/wn/13d@2x.png", // Light Snow
  5000: "https://openweathermap.org/img/wn/13d@2x.png", // Snow
  5101: "https://openweathermap.org/img/wn/13d@2x.png", // Heavy Snow
  8000: "https://openweathermap.org/img/wn/11d@2x.png", // Thunderstorm
};

app.get("/weather", async (req, res) => {
  const location = req.query.location;
  if (!location) {
    return res.status(400).json({ error: "Missing location parameter" });
  }

  try {
    const response = await axios.get("https://api.tomorrow.io/v4/weather/forecast", {
      params: {
        location,
        apikey: process.env.TOMORROW_API_KEY,
        timesteps: "1h",
        fields: ["temperature", "temperatureApparent", "weatherCode"],
        units: "imperial",
      },
    });

    const result = response.data.timelines.hourly[0].values;
    result.weatherCode = 1001; // Change to 4200 for Rain, 8000 for Thunderstorm, etc.

    result.iconUrl = weatherIcons[result.weatherCode] || "https://openweathermap.org/img/wn/01d@2x.png";


    res.json([result]);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
