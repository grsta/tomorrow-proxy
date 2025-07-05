const express = require('express');
const axios = require('axios');
const app = express();

// ✅ FULL Cloudinary video mapping
const weatherVideos = {
  4210: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_zu58xq.mp4",
  4220: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Windy_Snow_wdaet6.mp4",
  4230: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_Mix_wl2jiv.mp4",
  4240: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_Mix_Sun_kzlkld.mp4",
  4250: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_Wind_vdvny4.mp4",
  4260: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_Sun_pgrbjd.mp4",
  4270: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thundersnow_tx2ae5.mp4",
  4280: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thundersnow_Wind_onvm7v.mp4",
  4290: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Sun_vlifro.mp4",
  4300: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Sun_Clouds_kfb1c9.mp4",
  4310: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_apib0s.mp4",
  4320: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_Shower_uqb03b.mp4",
  4330: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_Sun_wdvphe.mp4",
  4340: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",
  4350: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_I_qijqzs.mp4",
  4360: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Wind_ddpjhp.mp4",
  4370: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Snow_Shower_o77gbf.mp4",
  4380: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Snow_Sun_xoxeqr.mp4",
  4390: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Partly_Cloudy_xhcdwf.mp4",
  4400: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Night_sykp1o.mp4",
  4410: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mostly_Cloudy_eqdbmn.mp4",
  4420: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mix_rwvamd.mp4",
  4430: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mix_Wind_t711q0.mp4",
  4440: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Snow_gswdxh.mp4",
  4450: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Convective_Rain_sasinh.mp4",
  4460: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",
  4470: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Cloudy_ujjjyr.mp4",
  4480: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Convective_Snow_pubntn.mp4",
  4490: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Dry_Lightning_qcgmuh.mp4",
  4500: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Convective_Mix_dhw2p4.mp4"
};

app.get('/weather', async (req, res) => {
  try {
    const response = await axios.get('https://api.tomorrow.io/v4/timelines', {
      params: {
        location: "38.9072,-77.0369", // Replace with your lat,lon if needed
        fields: ["temperature", "temperatureApparent", "weatherCode", "isDay"],
        timesteps: "current",
        units: "imperial",
        apikey:"lXFnAVn8p9WiNDhgjhG9tAwy0Gf9aFDT" // <-- replace with your real API key
      }
    });

    const weather = response.data.data.timelines[0].intervals[0].values;

    const weatherCode = weather.weatherCode;
    const iconUrl = weatherVideos[weatherCode] || null;

    res.json([
      {
        temperature: weather.temperature,
        feelsLike: weather.temperatureApparent,
        condition: weatherCode,
        isDay: weather.isDay,
        iconUrl: iconUrl
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
