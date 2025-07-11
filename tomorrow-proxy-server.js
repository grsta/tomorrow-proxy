import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

// ✅ Weather code → condition text
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

// ✅ Weather code → animated icons (your premium icons)
const weatherIcons = {
  0: "https://lordicon.com/your_sunny_icon.json",
  1: "https://lordicon.com/your_clear_icon.json",
  2: "https://lordicon.com/your_partly_cloudy_icon.json",
  3: "https://lordicon.com/your_cloudy_icon.json",
  45: "https://lordicon.com/your_fog_icon.json",
  48: "https://lordicon.com/your_fog_icon.json",
  51: "https://lordicon.com/your_light_drizzle_icon.json",
  53: "https://lordicon.com/your_light_drizzle_icon.json",
  55: "https://lordicon.com/your_heavy_rain_icon.json",
  56: "https://lordicon.com/your_snow_icon.json",
  57: "https://lordicon.com/your_snow_icon.json",
  61: "https://lordicon.com/your_light_rain_icon.json",
  63: "https://lordicon.com/your_heavy_rain_icon.json",
  65: "https://lordicon.com/your_heavy_rain_icon.json",
  66: "https://lordicon.com/your_snow_icon.json",
  67: "https://lordicon.com/your_snow_icon.json",
  71: "https://lordicon.com/your_snow_icon.json",
  73: "https://lordicon.com/your_snow_icon.json",
  75: "https://lordicon.com/your_heavy_snow_icon.json",
  77: "https://lordicon.com/your_snow_icon.json",
  80: "https://lordicon.com/your_light_rain_icon.json",
  81: "https://lordicon.com/your_heavy_rain_icon.json",
  82: "https://lordicon.com/your_heavy_rain_icon.json",
  85: "https://lordicon.com/your_snow_icon.json",
  86: "https://lordicon.com/your_heavy_snow_icon.json",
  95: "https://lordicon.com/your_thunderstorm_icon.json",
  96: "https://lordicon.com/your_thunderstorm_icon.json",
  99: "https://lordicon.com/your_thunderstorm_icon.json",
  night_clear: "https://lordicon.com/your_clear_night_icon.json"
};

// ✅ Weather code → HD overlay videos
const weatherVideos = {
  0: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752205058/Sunny_and_Hot_pidmg6.mp4",
  1: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203017/clear_skies_azqxco.mp4",
  2: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204937/Foggy_Mountains_t3rwn5.mp4",
  3: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752202716/Rolling_Dark_Stormy_Clouds_fnddfr.mp4",
  45: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204937/Foggy_Mountains_t3rwn5.mp4",
  48: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204937/Foggy_Mountains_t3rwn5.mp4",
  51: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203562/Daytime_Drizzle_cuavcf.mp4",
  53: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203562/Daytime_Drizzle_cuavcf.mp4",
  55: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204136/Daytime_Heavy_Rains_vxwtnv.mp4",
  56: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203080/Night_time_snow_fgtvdd.mp4",
  57: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203080/Night_time_snow_fgtvdd.mp4",
  61: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203562/Daytime_Drizzle_cuavcf.mp4",
  63: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204136/Daytime_Heavy_Rains_vxwtnv.mp4",
  65: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204136/Daytime_Heavy_Rains_vxwtnv.mp4",
  66: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203080/Night_time_snow_fgtvdd.mp4",
  67: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203080/Night_time_snow_fgtvdd.mp4",
  71: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752202888/Snow_Fall_xuji5g.mp4",
  73: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752202888/Snow_Fall_xuji5g.mp4",
  75: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203080/Night_time_snow_fgtvdd.mp4",
  77: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752202888/Snow_Fall_xuji5g.mp4",
  80: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203562/Daytime_Drizzle_cuavcf.mp4",
  81: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204136/Daytime_Heavy_Rains_vxwtnv.mp4",
  82: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204136/Daytime_Heavy_Rains_vxwtnv.mp4",
  85: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752202888/Snow_Fall_xuji5g.mp4",
  86: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203080/Night_time_snow_fgtvdd.mp4",
  95: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203432/Lightning_ur7amh.mp4",
  96: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203432/Lightning_ur7amh.mp4",
  99: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203432/Lightning_ur7amh.mp4",
  night_clear: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203811/Clear_Night_time_Sky_maywjz.mp4",
  night_cloudy: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204445/Clouded_Moon_Night_Sky_ykziso.mp4",
  crescent_moon: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752204640/Cresent_Moon_in_Night_Sky_irjnpz.mp4",
  hurricane: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203160/Severe_Hurricane_ncauue.mp4",
  hurricane_zoom: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1752203288/Zooming_on_Hurricane_kfbnu5.mp4"
};

app.get("/", (req, res) => {
  res.send("🔥 SWOLE BACKEND IS LIVE 🔥");
});

app.get("/weather", async (req, res) => {
  try {
    const lat = req.query.lat || 38.9072;
    const lon = req.query.lon || -77.0369;
    const timezone = req.query.timezone || "auto";

    const url = "https://api.open-meteo.com/v1/forecast";

    const params = {
      latitude: lat,
      longitude: lon,
      current: "temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m,cloudcover",
      daily: "sunrise,sunset",
      hourly: "temperature_2m,apparent_temperature,uv_index,cloudcover,precipitation_probability,windgusts_10m",
      timezone: timezone,
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph"
    };

    console.log("Sending request to Open-Meteo:", url);
    console.log("Params:", params);

    const response = await axios.get(url, { params });

    const current = response.data.current;
    const daily = response.data.daily;
    const hourly = response.data.hourly;

    const weatherCode = current.weather_code ?? 0;

    const iconUrl = weatherIcons[weatherCode] || null;
    let videoUrl = weatherVideos[weatherCode] || null;

    if (current.is_day === 0 && weatherCode === 0) {
      videoUrl = weatherVideos["night_clear"];
    }

    const conditionText = weatherCodes[weatherCode] || "Clear sky";

    const sunrise = daily?.sunrise?.[0] || null;
    const sunset = daily?.sunset?.[0] || null;

    const hourlyData = {
      hours: hourly?.time?.map(t => t.split("T")[1].substring(0, 5)) || [],
      temp_f: hourly?.temperature_2m || [],
      feelsLike_f: hourly?.apparent_temperature || [],
      uvIndex: hourly?.uv_index || [],
      cloudCover_pct: hourly?.cloudcover || [],
      precipProb_pct: hourly?.precipitation_probability || [],
      windGusts_mph: hourly?.windgusts_10m || []
    };

    const alert = {
      alertActive: true,
      alertEvent: "Special Weather Statement",
      alertDescription: "A big storm is coming!",
      alertInstruction: "Seek shelter indoors immediately.",
      alertExpires: "2025-07-06T19:45:00-05:00",
      alertSeverity: "Severe",
      alertHeadline: "Severe Thunderstorm Warning",
      alertSender: "NWS Shreveport LA"
    };

    res.json([{
      source: "Open-Meteo",
      lat: lat,
      lon: lon,
      region: "Test Region",
      weather: {
        temp_f: current.temperature_2m,
        feelsLike_f: current.apparent_temperature,
        windSpeed_mph: current.wind_speed_10m,
        weathercode: weatherCode,
        conditionText: conditionText,
        iconUrl: iconUrl,
        videoUrl: videoUrl,
        isDay: current.is_day,
        humidity: 87,
        precipitation_mm: 2.5,
        cloudcover_pct: current.cloudcover,
        sunrise: sunrise,
        sunset: sunset,
        uvIndex: hourly?.uv_index?.[0] || null,
        windGusts_mph: hourly?.windgusts_10m?.[0] || null,
        precipProb_pct: hourly?.precipitation_probability?.[0] || null
      },
      hourly: hourlyData,
      alert: alert
    }]);

  } catch (error) {
    console.error("Error fetching weather:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
