import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

// ✅ Weather code mapping
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

// ✅ Cloudinary videos
const weatherVideos = {
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

app.get("/", (req, res) => {
  res.send("🔥 SWOLE BACKEND IS LIVE 🔥");
});

app.get("/weather", async (req, res) => {
  try {
    const lat = req.query.lat || 38.9072;
    const lon = req.query.lon || -77.0369;
    const timezone = req.query.timezone || "auto";

    // FIRST CALL → current_weather only
    const currentRes = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude: lat,
          longitude: lon,
          current_weather: true,
          temperature_unit: "fahrenheit",
          wind_speed_unit: "mph",
          timezone: timezone
        }
      }
    );

    const current = currentRes.data.current_weather;

    const weatherCode = current.weathercode ?? 0;
    let iconUrl = weatherVideos[weatherCode] || null;
    if (current.is_day === 0 && weatherCode === 0) {
      iconUrl = weatherVideos["night_clear"];
    }

    const conditionText = weatherCodes[weatherCode] || "Clear sky";

    // SECOND CALL → daily + hourly
    const forecastRes = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude: lat,
          longitude: lon,
          daily: "sunrise,sunset,moon_phase",
          hourly:
            "temperature_2m,apparent_temperature,uv_index,cloudcover,precipitation_probability,windgusts_10m",
          temperature_unit: "fahrenheit",
          wind_speed_unit: "mph",
          timezone: timezone
        }
      }
    );

    const daily = forecastRes.data.daily;
    const hourly = forecastRes.data.hourly;

    const sunrise = daily?.sunrise?.[0] || null;
    const sunset = daily?.sunset?.[0] || null;
    const moonPhase = daily?.moon_phase?.[0] || null;

    const hourlyData = {
      hours:
        hourly?.time?.map((t) => t.split("T")[1].substring(0, 5)) || [],
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

    res.json({
      source: "Open-Meteo",
      lat: lat,
      lon: lon,
      region: "Test Region",
      weather: {
        temp_f: current.temperature,
        feelsLike_f: current.apparent_temperature ?? null,
        windSpeed_mph: current.windspeed,
        weathercode: weatherCode,
        conditionText: conditionText,
        iconUrl: iconUrl,
        isDay: current.is_day,
        humidity: 87,
        precipitation_mm: 2.5,
        cloudcover_pct: hourly?.cloudcover?.[0] || null,
        sunrise: sunrise,
        sunset: sunset,
        moonPhase: moonPhase,
        uvIndex: hourly?.uv_index?.[0] || null,
        windGusts_mph: hourly?.windgusts_10m?.[0] || null,
        precipProb_pct: hourly?.precipitation_probability?.[0] || null
      },
      hourly: hourlyData,
      alert: alert
    });
  } catch (err) {
    console.error("Error fetching weather:", err.message);
    res
      .status(500)
      .json({ error: "Failed to fetch weather data. " + err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
