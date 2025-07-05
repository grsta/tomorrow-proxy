const express = require("express");
const axios = require("axios");
const app = express();

// ✅ FULL Cloudinary video mapping
const weatherVideos = {
  1000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Sun_vlifro.mp4",
  1100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Partly_Cloudy_xhcdwf.mp4",
  1101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mostly_Cloudy_eqdbmn.mp4",
  1102: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Cloudy_ujjjyr.mp4",
  2000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Fog_s7h2pn.mp4",
  2100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Fog_s7h2pn.mp4",
  4000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",
  4001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",
  4200: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Snow_gswdxh.mp4",
  4201: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_apib0s.mp4",
  5000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_apib0s.mp4",
  5001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_Shower_uqb03b.mp4",
  5100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Snow_gswdxh.mp4",
  5101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_Shower_uqb03b.mp4",
  6000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mix_rwvamd.mp4",
  6001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mix_Wind_t711q0.mp4",
  6200: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Snow_Shower_o77gbf.mp4",
  6201: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Snow_Sun_xoxeqr.mp4",
  7000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_zu58xq.mp4",
  7101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_Wind_vdvny4.mp4",
  7102: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_Mix_wl2jiv.mp4",
  8000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Dry_Lightning_qcgmuh.mp4",
  4400: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4"
};

// ✅ Weather code → text mapping
const weatherConditions = {
  1000: "Clear",
  1100: "Mostly Clear",
  1101: "Partly Cloudy",
  1102: "Cloudy",
  2000: "Fog",
  2100: "Fog",
  4000: "Light Rain",
  4001: "Rain",
  4200: "Light Snow",
  4201: "Snow",
  5000: "Snow",
  5001: "Snow Showers",
  5100: "Light Snow",
  5101: "Snow Showers",
  6000: "Sleet/Mix",
  6001: "Sleet/Mix Wind",
  6200: "Rain/Snow Mix",
  6201: "Rain/Snow Sun",
  7000: "Thunderstorm",
  7101: "Thunderstorm Wind",
  7102: "Thunderstorm Mix",
  8000: "Dry Lightning"
};

function getConditionText(code) {
  return weatherConditions[code] || "Unknown";
}

app.get("/weather", async (req, res) => {
  try {
    // Use query params from the URL if provided
    const latitude = req.query.lat || 38.9072;
    const longitude = req.query.lon || -77.0369;

    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: latitude,
        longitude: longitude,
        current: "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,is_day",
        timezone: "auto",
        temperature_unit: "fahrenheit",
        wind_speed_unit: "mph"
      }
    });

    const weather = response.data.current;

    // ✅ Default safe weather code if missing
    const weatherCode = weather.weather_code ?? 1000;
    let iconUrl = weatherVideos[weatherCode] || null;

    if (weather.is_day === 0) {
      iconUrl = weatherVideos[4400];
    }

    const conditionText = getConditionText(weatherCode);

    res.json([
      {
        temperature: weather.temperature_2m,
        feelsLike: weather.temperature_2m,
        condition: weatherCode,
        conditionText: conditionText,
        isDay: weather.is_day,
        iconUrl: iconUrl,
        windSpeed: weather.wind_speed_10m,
        humidity: weather.relative_humidity_2m,
        precipitation: weather.precipitation
      }
    ]);
  } catch (error) {
    console.error("Error fetching weather:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
