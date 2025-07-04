const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// ✅ WeatherCode → Cloudinary video mapping
const weatherVideos = {
  1000: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Sun_uvlifo.mp4",
  1100: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Partly_Cloudy_xhctwf.mp4",
  1101: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Mostly_Cloudy_eqabmm.mp4",
  1001: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Cloudy_uijiry.mp4",
  1102: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Cumulous_Clouds_Sun_wxvhqe.mp4",

  4000: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Light_Rain_zqjzyv.mp4",
  4001: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Rain_Wind_dd2hjo.mp4",
  4200: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Rain_Snow_Shower_o7z9bpj.mp4",
  4201: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Convective_Rain_asxihh.mp4",

  5000: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Snow_Sun_wdvqphe.mp4",
  5001: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Flurries_sttkce.mp4",
  5100: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Light_Snow_gxwdah.mp4",
  5101: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Snow_Shower_upl6b3.mp4",

  6000: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Freezing_Drizzle_Rain_mrklqd.mp4",
  6001: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Freezing_Rain_37ffyp.mp4",
  6200: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Mix_vwmmd.mp4",
  6201: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Mix_Wind_711qq.mp4",

  7000: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Ice_Pellets_refzrs.mp4",
  7101: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Heavy_Ice_Pellets_uwhmps.mp4",

  8000: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Thunderstorm_Custom_btjleam.mp4",
  8001: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Thunderstorm_Wind_Custom_vzqio.mp4",
  8100: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Dry_Lightning_qgpmrf.mp4",

  2101: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Night_syxpfo.mp4",
  2103: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Windy_Snow_wadetn.mp4",
};

app.get("/weather", async (req, res) => {
  try {
    const lat = req.query.lat;
    const lon = req.query.lon;

    if (!lat || !lon) {
      return res.status(400).json({
        error: "Missing lat or lon parameters."
      });
    }

    const response = await axios.get(
      `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=lXFnAVn8p9WiNDhgjhG9tAwy0Gf9aFDT`
    );

    const weatherData = response.data;

    const temperature = weatherData.data.values.temperature;
    const feelLike = weatherData.data.values.temperatureApparent;
    const weatherCode = weatherData.data.values.weatherCode;

    const iconUrl = weatherVideos[weatherCode] || null;

    res.json([{
      temperature,
      feelLike,
      condition: weatherCode,
      iconUrl
    }]);

  } catch (error) {
    console.error("Error fetching weather:", error.message);
    res.status(500).json({
      error: "Failed to fetch weather data."
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
