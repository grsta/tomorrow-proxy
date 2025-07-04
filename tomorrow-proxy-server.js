
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const weatherIcons = {
  // CLEAR / CLOUDS
  1000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668210/Clear_s6ljy6.mp4",                    // Clear
  1100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668211/Mostly_Clear_uxfqlo.mp4",             // Mostly Clear
  1101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668212/Partly_Cloudy_nuhobm.mp4",            // Partly Cloudy
  1102: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668213/Mostly_Cloudy_iyadhm.mp4",            // Mostly Cloudy
  1001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668214/Cloudy_vzb0kt.mp4",                   // Cloudy

  // FOG / HAZE
  2000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668215/Fog_Windy_Snow_nvcf6t.mp4",           // Fog / Windy Snow
  2100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668216/Light_Fog_Dreary_kzjjjo.mp4",         // Light Fog / Dreary

  // DRIZZLE / RAIN
  4000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668217/Drizzle_yg5l3u.mp4",                  // Drizzle
  4200: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668218/Light_Rain_9s4iyt.mp4",               // Light Rain
  4201: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668219/Heavy_Rain_gscsgh.mp4",               // Heavy Rain

  // SNOW / MIX
  5000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668220/Snow_vpb9ej.mp4",                     // Snow
  5100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668221/Flurries_k57ewq.mp4",                 // Flurries
  5101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668222/Light_Snow_o5zmp4.mp4",               // Light Snow
  5001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668223/Mix_1lmzpe.mp4",                      // Freezing Drizzle / Mix
  7102: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668224/Heavy_Freezing_Rain_377fgt.mp4",      // Heavy Freezing Rain

  // ICE PELLETS / HAIL
  7000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668225/Ice_Pellets_r4zswx.mp4",             // Ice Pellets
  7101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668226/Heavy_Ice_Pellets_xh6ymn.mp4",       // Heavy Ice Pellets
  7110: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668227/Light_Freezing_Rain_nkl7b4.mp4",     // Light Freezing Rain

  // THUNDERSTORMS & EXTREMES
  8000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668228/Thunderstorm_suhfox.mp4",           // Thunderstorm
  8001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668229/Thunderstorm_Custom_lb1zzh.mp4",    // Thunderstorm (custom)
  8002: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668230/Thundersnow_Custom_rvyqjo.mp4",     // Thundersnow + Wind (custom)
  8003: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668231/Dry_Lightning_Custom_xbkqwp.mp4"    // Dry Lightning (custom)
};

const defaultIconUrl = "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722668232/Default_Clouds_Sun_smokno.mp4";


const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

app.get("/weather", async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat or lon query params." });
  }

 

    // Pull video URL for this weather code
   const iconUrl = "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1722662014/Cloudy_vzb0kt.mp4";

res.json({
  temperature,
  feelslike,
  condition,
  iconUrl
});


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
