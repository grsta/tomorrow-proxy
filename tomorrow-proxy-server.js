const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// ✅ WeatherCode → Cloudinary video mapping
const weatherVideos = {
  1000: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Sun_vlifro.mp4",
  1100: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Partly_Cloudy_xhcdwf.mp4",
  1101: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Mostly_Cloudy_eqdbmn.mp4",
  1102: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Cloudy_ujjjyr.mp4",
  2100: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Mix_rwvamd.mp4",
  4000: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Light_Rain_azdyyv.mp4",
  4001: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Rain_I_qijqzs.mp4",
  4200: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Rain_Shower_j5qs3f.mp4",
  4201: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Rain_Wind_ddpjhp.mp4",
  4210: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Thunderstorm_zu58xq.mp4",
  4211: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Thunderstorm_Wind_vdvny4.mp4",
  4212: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Thunderstorm_Sun_pgrbjd.mp4",
  5000: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Snow_apib0s.mp4",
  5001: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Snow_Shower_uqb03b.mp4",
  5100: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Light_Snow_gswdxh.mp4",
  5101: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Thundersnow_tx2ae5.mp4",
  5110: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Snow_Sun_wdvphe.mp4",
  5111: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Windy_Snow_wdaet6.mp4",
  5200: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Rain_Snow_Sun_xoxeqr.mp4",
  5201: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Rain_Snow_Shower_o77gbf.mp4",
  6000: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Rain_Snow_Shower_o77gbf.mp4",
  6001: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Rain_Snow_Shower_o77gbf.mp4",
  6200: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Rain_Snow_Shower_o77gbf.mp4",
  6201: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Rain_Snow_Shower_o77gbf.mp4",
  7000: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Mix_rwvamd.mp4",
  7101: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Mix_Wind_t711q0.mp4",
  7110: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Convective_Snow_pubntn.mp4",
  7111: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Convective_Rain_sasinh.mp4",
  7112: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Convective_Mix_dhw2p4.mp4",
  8000: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Dry_Lightning_qcgmuh.mp4",
  1001: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Night_sykp1o.mp4"
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
