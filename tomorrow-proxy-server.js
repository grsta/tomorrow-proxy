const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// ✅ Weather code text mapping
const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
};

// ✅ Cloudinary animated weather icons (MP4s)
const weatherIcons = {
  0: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Sun_vlifro.mp4",
  1: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Partly_Cloudy_xhcdwf.mp4",
  2: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Partly_Cloudy_xhcdwf.mp4",
  3: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mostly_Cloudy_eqdbmn.mp4",
  45: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mix_rwvamd.mp4",
  48: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mix_rwvamd.mp4",
  51: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",
  53: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",
  55: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",
  56: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",
  57: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",
  61: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",
  63: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",
  65: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_I_qijqzs.mp4",
  66: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",
  67: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_I_qijqzs.mp4",
  71: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Snow_gswdxh.mp4",
  73: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_apib0s.mp4",
  75: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_Shower_uqb03b.mp4",
  77: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_apib0s.mp4",
  80: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",
  81: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",
  82: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_I_qijqzs.mp4",
  85: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_apib0s.mp4",
  86: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_Shower_uqb03b.mp4",
  95: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_zu58xq.mp4",
  96: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_Sun_pgrbjd.mp4",
  99: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_Sun_pgrbjd.mp4",
  night_clear: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4"
};

// ✅ Cloudinary background overlays (MP4s)
const overlayVideos = {
  "0": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752205058/Sunny_and_Hot_pidmg6.mp4",
  "1": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204937/Foggy_Mountains_t3rwn5.mp4",
  "2": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204937/Foggy_Mountains_t3rwn5.mp4",
  "3": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752202716/Rolling_Dark_Stormy_Clouds_fnddfr.mp4",
  "45": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204937/Foggy_Mountains_t3rwn5.mp4",
  "48": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204937/Foggy_Mountains_t3rwn5.mp4",
  "51": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203562/Daytime_Drizzle_cuavcf.mp4",
  "53": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203562/Daytime_Drizzle_cuavcf.mp4",
  "55": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204136/Daytime_Heavy_Rains_vxwtnv.mp4",
  "56": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203562/Daytime_Drizzle_cuavcf.mp4",
  "57": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204136/Daytime_Heavy_Rains_vxwtnv.mp4",
  "61": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203562/Daytime_Drizzle_cuavcf.mp4",
  "63": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204136/Daytime_Heavy_Rains_vxwtnv.mp4",
  "65": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204136/Daytime_Heavy_Rains_vxwtnv.mp4",
  "66": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203562/Daytime_Drizzle_cuavcf.mp4",
  "67": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204136/Daytime_Heavy_Rains_vxwtnv.mp4",
  "71": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752202888/Snow_Fall_xuji5g.mp4",
  "73": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752202888/Snow_Fall_xuji5g.mp4",
  "75": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203080/Night_time_snow_fgtvdd.mp4",
  "77": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752202888/Snow_Fall_xuji5g.mp4",
  "80": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203562/Daytime_Drizzle_cuavcf.mp4",
  "81": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203562/Daytime_Drizzle_cuavcf.mp4",
  "82": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204136/Daytime_Heavy_Rains_vxwtnv.mp4",
  "85": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752202888/Snow_Fall_xuji5g.mp4",
  "86": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203080/Night_time_snow_fgtvdd.mp4",
  "95": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203432/Lightning_ur7amh.mp4",
  "96": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203432/Lightning_ur7amh.mp4",
  "99": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203432/Lightning_ur7amh.mp4",
  "night_clear": "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203811/Clear_Night_time_Sky_maywjz.mp4"
};

app.get("/weather", async (req, res) => {
  try {
    const lat = req.query.lat || "38.9168";
    const lon = req.query.lon || "-77.0195";

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,uv_index,cloudcover,precipitation_probability,windgusts_10m,windspeed_10m,winddirection_10m,weathercode&current_weather=true&timezone=auto`;

    const { data } = await axios.get(url);

    const currentCode = data.current_weather?.weathercode || 0;
    const currentTempF = data.current_weather?.temperature
      ? (data.current_weather.temperature * 9/5 + 32).toFixed(1)
      : null;

    const feelslikeTempF = data.hourly?.apparent_temperature?.[0] != null
      ? (data.hourly.apparent_temperature[0] * 9/5 + 32).toFixed(1)
      : null;

    const windSpeedMph = data.current_weather?.windspeed
      ? (data.current_weather.windspeed * 0.621371).toFixed(1)
      : null;

    function degreesToDirection(degrees) {
      if (degrees === null) return null;
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
      return directions[Math.round(degrees / 45) % 8];
    }

    const windDirection = degreesToDirection(data.current_weather?.winddirection);

    const cloudcover = data.hourly?.cloudcover?.[0] || null;
    const precipitationProbability = data.hourly?.precipitation_probability?.[0] || null;
    const uvIndex = data.hourly?.uv_index?.[0] || null;

    const conditionText = weatherCodes[currentCode] || "Unknown";
    const iconURL = weatherIcons[currentCode] || weatherIcons[0];
    const overlayURL = overlayVideos[String(currentCode)] || overlayVideos["0"];

    const hourlyArray = (data.hourly?.time || []).map((h, i) => ({
      hour: h,
      temp_f: data.hourly.temperature_2m?.[i] != null
        ? (data.hourly.temperature_2m[i] * 9/5 + 32).toFixed(1)
        : null,
      feelslike_f: data.hourly.apparent_temperature?.[i] != null
        ? (data.hourly.apparent_temperature[i] * 9/5 + 32).toFixed(1)
        : null,
      uv_index: data.hourly.uv_index?.[i] || null,
      cloudcover: data.hourly.cloudcover?.[i] || null,
      precipitation_probability: data.hourly.precipitation_probability?.[i] || null,
      windgusts_mph: data.hourly.windgusts_10m?.[i] != null
        ? (data.hourly.windgusts_10m[i] * 0.621371).toFixed(1)
        : null,
      weathercode: data.hourly.weathercode?.[i] || null,
      conditionText: weatherCodes[data.hourly.weathercode?.[i]] || null,
      icon: weatherIcons[data.hourly.weathercode?.[i]] || null,
      overlay: overlayVideos[String(data.hourly.weathercode?.[i])] || null
    }));

    res.json({
      current_weather: [
        {
          source: "Open-Meteo",
          lat,
          lon,
          weathercode: currentCode,
          conditionText,
          icon: iconURL,
          overlay: overlayURL,
          temp_f: currentTempF,
          feelslike_f: feelslikeTempF,
          windspeed_mph: windSpeedMph,
          winddirection: windDirection,
          cloudcover,
          precipitation_probability: precipitationProbability,
          uv_index: uvIndex
        }
      ],
      hourly: hourlyArray
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: true, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
