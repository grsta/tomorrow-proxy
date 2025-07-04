const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

/**
 * WEATHER VIDEO MAPPING
 * Map weather codes to Cloudinary video URLs
 */
const weatherVideos = {
  1000: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Sun_uvlifo.mp4",
  1100: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Sun_Clouds_ktbqho.mp4",
  1101: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Partly_Cloudy_xtichwf.mp4",
  1102: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Mostly_Cloudy_eqabmn.mp4",
  2000: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Fog_Snow_mcp6fo.mp4",
  2100: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Light_Fog_Dreary_krljfb.mp4",
  4000: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Drizzle_lsuyxl.mp4",
  4200: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Light_Rain_zqjyvy.mp4",
  4201: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Convective_Rain_asaish.mp4",
  5000: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Snow_wdxphe.mp4",
  5100: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Flurries_nkthce.mp4",
  5101: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Light_Snow_gvadwn.mp4",
  5110: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Freezing_Drizzle_Pellets_Rmix_jx7lsq.mp4",
  5111: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Heavy_Freezing_Rain_3777gf.mp4",
  7000: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Ice_Pellets_ref2sz.mp4",
  7101: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Heavy_Ice_Pellets_uvhves.mp4",
  7102: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Light_Freezing_Rain_zj1fsp.mp4",
  8000: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Thunderstorm_Custom_6fc9hcb.mp4",
  8001: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Thunderstorm_Custom_bliuam.mp4",
  8002: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Thunderstorm_Wind_Custom_vxqj2lo.mp4",
  8003: "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Dry_Lightning_qgqmnf.mp4",
};

// fallback video if code is unknown
const defaultIconUrl =
  "https://res.cloudinary.com/dqfoiq2eh/video/upload/Weather%20Icons%20MP4/Clear_uvb5.mp4";

/**
 * ROUTE: /weather
 * GET lat & lon query parameters
 */
app.get("/weather", async (req, res) => {
  try {
    const lat = req.query.lat;
    const lon = req.query.lon;

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: "Missing lat or lon query parameters." });
    }

    const response = await axios.get(
      "https://api.tomorrow.io/v4/weather/realtime",
      {
        params: {
          location: `${lat},${lon}`,
          apikey: process.env.TOMORROW_API_KEY,
        },
      }
    );

    const weatherData = response.data;

    const temperature = weatherData.data.values.temperature;
    const feelsLike = weatherData.data.values.temperatureApparent || null;
    const weatherCode = weatherData.data.values.weatherCode;

    const iconUrl = weatherVideos[weatherCode] || defaultIconUrl;

    // Return an array for Adalo
    res.json([
      {
        temperature,
        feelsLike,
        condition: weatherCode,
        iconUrl,
      },
    ]);
  } catch (error) {
    console.error(
      "Error fetching weather from Tomorrow.io:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Tomorrow proxy running on port ${PORT}`);
});
