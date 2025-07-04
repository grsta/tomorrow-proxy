const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Map weather codes to Cloudinary MP4 URLs
const weatherIcons = {
  // Clear / Clouds
  1000: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Sun_uvifo.mp4",
  1100: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Sun_Clouds_tkbp6o.mp4",
  1101: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665112/Partly_Cloudy_zthchxf.mp4",
  1102: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Mostly_Cloudy_eqabmn.mp4",
  1001: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665112/Mix_vwmnd.mp4",

  // Fog / Haze
  2000: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Fog_Snow_mcp6c6.mp4",
  2100: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Light_Fog_Dreary_krljfb.mp4",

  // Rain
  4000: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Drizzle_lsywsl.mp4",
  4001: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665112/Light_Rain_xzjgyv.mp4",
  4200: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665112/Rain_Shower_t5pcaf.mp4",
  4201: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Heavy_Rain_g3pqph.mp4",

  // Snow / Mix
  5000: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Snow_uqfbx3.mp4",
  5001: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Flurries_kvthxe.mp4",
  5100: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Light_Snow_eqwdhn.mp4",
  5101: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Heavy_Freezing_Rain_3777gf.mp4",
  6000: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Freezing_Drizzle_Pellets_wynsps.mp4",
  6200: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665112/Mix_Sun_izkltd.mp4",
  6201: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Windy_Snow_wdqfhe.mp4",

  // Ice Pellets / Hail
  7000: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Ice_Pellets_wlwyex.mp4",
  7101: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Heavy_Ice_Pellets_xlphxe.mp4",
  7102: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665112/Light_Freezing_Rain_jlf3pst.mp4",

  // Thunderstorms & Extreme
  8000: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Thunderstorm_Custom_bizblsm.mp4",
  8001: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665112/Thunderstorm_Wind_odrm7v.mp4",
  8002: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665112/Thunderstorm_Custom_vxjzqio.mp4",
  8003: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Dry_Lightning_qqgmni.mp4",
  8004: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Convective_Rain_asxihh.mp4",
  8005: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Convective_Mix_dhwlzp4.mp4",
  8006: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665112/Thunderstorm_Mix_Sun_izkltd.mp4",
  8007: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Thunderstorm_Lkx25s.mp4",
  8008: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Thunderstorm_Rain_Snow_sh7gbf.mp4",
  8009: "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Thunderstorm_Wind_vtmy4.mp4"
};

// fallback video
const defaultIconUrl = "https://res.cloudinary.com/dqfoiq2eh/video/upload/v1722665111/Sun_uvifo.mp4";

app.get('/weather', async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;

  if (!lat || !lon) {
    return res.json({ error: "Missing lat or lon parameters." });
  }

  try {
    // Fetch from Tomorrow.io
    const response = await axios.get(`https://api.tomorrow.io/v4/weather/realtime`, {
      params: {
        location: `${lat},${lon}`,
        apikey: process.env.TOMORROW_API_KEY
      }
    });

    const weatherData = response.data;

    // Extract values
    const temperature = weatherData.data.values.temperature;
    const feelsLike = weatherData.data.values.temperatureApparent;
    const weatherCode = weatherData.data.values.weatherCode;

    let iconUrl = defaultIconUrl;
    if (weatherIcons[weatherCode]) {
      iconUrl = weatherIcons[weatherCode];
    }

    res.json({
      temperature,
      feelsLike,
      condition: weatherCode,
      iconUrl
    });

  } catch (error) {
    console.error("Error fetching weather from Tomorrow.io:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

// START SERVER
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Tomorrow proxy running on port ${PORT}`);
});
