
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const weatherIcons = {
  1000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868741/Sun_Sunny_pfufio.mp4",        // Clear
  1100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868741/Sun_Mostly_Clear_uhudn4.mp4",  // Mostly Clear
  1101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868741/Sun_Partly_Cloudy_v8s6md.mp4", // Partly Cloudy
  1102: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868741/Sun_Cloudy_sx0mto.mp4",        // Cloudy
  2000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868510/Fog_Windy_Snow_vucdt5.mp4",    // Fog / Windy Snow
  2100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868510/Fog_Light_Fog_Dreary_p6t1mp.mp4", // Light Fog / Dreary
  4000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868613/Rain_Drizzle_jsqytr.mp4",      // Drizzle
  4200: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868613/Rain_Light_Rain_sqylsh.mp4",   // Light Rain
  4001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868613/Rain_Rain_jsqytr.mp4",         // Rain
  4201: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868613/Rain_Heavy_Convective_Rain_gashm9.mp4", // Heavy Rain
  5000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868675/Snow_Snow_vqkxmp.mp4",         // Snow
  5100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868675/Snow_Flurries_mlnntj.mp4",     // Flurries
  5101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868675/Snow_Heavy_Snow_zk7qpe.mp4",   // Heavy Snow
  6000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868613/Rain_Freezing_Drizzle_37t6tr.mp4", // Freezing Drizzle
  6001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868613/Rain_Freezing_Rain_oxpmeh.mp4", // Freezing Rain
  6200: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868613/Rain_Light_Freezing_Rain_xhcbde.mp4", // Light Freezing Rain
  6201: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868675/Snow_Heavy_Precipitation_Sun_sx0mto.mp4", // Heavy Freezing Rain
  7000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868741/Sun_Ice_Pellets_sasexr.mp4",   // Ice Pellets
  7101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868741/Sun_Heavy_Ice_Pellets_iybndk.mp4", // Heavy Ice Pellets
  7102: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868741/Sun_Light_Ice_Pellets_vjz5qm.mp4", // Light Ice Pellets
  8000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722868741/Sun_Thunderstorm_g5rblv.mp4"  // Thunderstorm
};

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

app.get("/weather", async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat or lon query params." });
  }

  try {
    console.log(`Fetching weather data for lat=${lat}, lon=${lon}`);

    const response = await axios.get("https://api.tomorrow.io/v4/weather/realtime", {
      params: {
        location: `${lat},${lon}`,
        apikey: process.env.TOMORROW_API_KEY
      }
    });

    const weatherData = response.data;

    const temperature = weatherData?.data?.values?.temperature;
    const feelsLike = weatherData?.data?.values?.temperatureApparent;
    const weatherCode = weatherData?.data?.values?.weatherCode;

    if (temperature === undefined) {
      console.error("Tomorrow.io returned no temperature!");
      return res.json({ error: "Failed to fetch weather data." });
    }

    // Pull video URL for this weather code
    const iconUrl = weatherIcons[weatherCode] || "";

    res.json([{
      temperature,
      feelslike: feelsLike,
      condition: weatherCode,
      iconUrl
    }]);

  } catch (error) {
    console.error("Tomorrow.io error:", error.response?.data || error.message);
    res.json({ error: "Failed to fetch weather data." });
  }
});

app.listen(port, () => {
  console.log(`Weather proxy running on port ${port}`);
});
