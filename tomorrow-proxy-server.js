const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

/**
 * WEATHER CODE → VIDEO URL mapping
 */
const weatherVideos = {
  1102: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Sun_uvlifo.mp4",
  1101: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Sun_Clouds_txiozh.mp4",
  1103: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Partly_Cloudy_xthchaf.mp4",
  1105: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Mostly_Cloudy_eqadnm.mp4",
  2100: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Mix_wvmmd.mp4",
  4200: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Light_Rain_zdzyyw.mp4",
  4201: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Convective_Rain_asaqhh.mp4",
  5001: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Light_Snow_gwxdhn.mp4",
  5100: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Snow_Sun_wdxphe.mp4",
  5101: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Snow_Shower_uqbfo3.mp4",
  7102: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Ice_Pellets_refzz.mp4",
  7101: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Heavy_Ice_Pellets_uvhws.mp4",
  7103: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Freezing_Rain_377fgf.mp4",
  8000: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Thunderstorm_Custom_btjlam.mp4",
  8001: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Thunderstorm_Wind_Custom_vxjzlo.mp4",
  8002: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Dry_Lightning_qgqmrf.mp4",
  2101: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Night_sygxlsp.mp4",
  2102: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Mix_Wind_t1niq4.mp4",
  2103: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Windy_Snow_wadetn.mp4",
  2104: "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Cumulonimbus_Clouds_Sun_wvxhqe.mp4"
};

// fallback video if weather code not found
const defaultIconUrl = "https://res.cloudinary.com/dfq6hq2eh/video/upload/Weather%20Icons%20MP4/Sun_uvlifo.mp4";

app.get("/weather", async (req, res) => {
  try {
    const lat = req.query.lat;
    const lon = req.query.lon;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Missing lat or lon parameters." });
    }

    const response = await axios.get(
      `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=YOUR_API_KEY`
    );

    const weatherData = response.data;
    const temperature = weatherData.data.values.temperature;
    const feelsLike = weatherData.data.values.temperatureApparent;
    const weatherCode = weatherData.data.values.weatherCode;

    // ✅ [ ] Correct syntax for object lookup
    const iconUrl = weatherVideos[weatherCode] || defaultIconUrl;

    res.json([{
      temperature,
      feelsLike,
      condition: weatherCode,
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
