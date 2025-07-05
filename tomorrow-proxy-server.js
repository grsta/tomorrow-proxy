import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

// Map condition codes to your Cloudinary video URLs
const iconVideos = {
  1000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Sun_vlifro.mp4",
  1003: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4", // adjust for partly cloudy day/night
  1006: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4",
  1009: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4",
  1030: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4",
  1063: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4",
  1066: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4",
  1069: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4",
  1072: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4",
  1087: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4",
  // add more as you wish
  0: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4", // fallback for unknown codes
};

// Map condition codes to human-readable text
const weatherCodes = {
  0: "Clear",
  1000: "Clear",
  1003: "Partly Cloudy",
  1006: "Cloudy",
  1009: "Overcast",
  1030: "Mist",
  1063: "Patchy Rain",
  1066: "Snow",
  1069: "Sleet",
  1072: "Freezing Drizzle",
  1087: "Thunderstorm",
  1114: "Blowing Snow",
  1117: "Blizzard",
  1135: "Fog",
  1147: "Freezing Fog",
  1150: "Light Drizzle",
  1153: "Drizzle",
  // add more as needed
};

// Replace YOUR_API_KEY_HERE with your actual Open-Meteo API key if required.
// Open-Meteo is free and does not require a key for basic data.
app.get("/weather", async (req, res) => {
  try {
    const lat = req.query.lat || 38.9072;
    const lon = req.query.lon || -77.0369;

    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lon,
        current: "temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,relative_humidity_2m",
        timezone: "auto",
        temperature_unit: "fahrenheit",
      },
    });

    const data = response.data.current;
    const condition = data.weather_code ?? 0;
    const iconUrl = iconVideos[condition] || iconVideos[0];
    const conditionText = weatherCodes[condition] || "Clear";

    const weather = {
      temperature: data.temperature_2m,
      feelsLike: data.apparent_temperature,
      condition,
      conditionText,
      isDay: data.is_day ?? 0,
      iconUrl,
      windSpeed: data.wind_speed_10m,
      humidity: data.relative_humidity_2m,
      precipitation: data.precipitation,
    };

    res.json([weather]);
  } catch (error) {
    console.error("Error fetching weather:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

const PORT = process.env.PORT || 10003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
