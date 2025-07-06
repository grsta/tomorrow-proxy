/**
 * Swole Empire Unified Backend
 * ----------------------------
 * - Handles Tomorrow.io Proxy (optional, future use)
 * - Handles Open-Meteo + NOAA weather beast
 * - Maps weather codes to Cloudinary video URLs
 * - Provides data in both US + global units
 *
 * Written for Commander Red and the Swole Empire.
 */
const PORT = process.env.PORT || 3000;
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

/* -----------------------------------------------------------------------------
   TOMORROW.IO PROXY ROUTE
   -----------------------------------------------------------------------------

   📝 RED — READ THIS!

   If you're NOT using Tomorrow.io yet, you can safely COMMENT OUT
   the entire route below from:

       app.get("/tomorrow-proxy", ... )

   down to the closing bracket:

       });

   And just leave the new /weather route active.

----------------------------------------------------------------------------- */

app.get("/tomorrow-proxy", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Missing lat/lon parameters." });
    }

    const tomorrowUrl = `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=YOUR_TOMORROW_API_KEY`;

    const response = await fetch(tomorrowUrl);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Tomorrow.io Proxy Error:", error);
    res.status(500).json({ error: "Error calling Tomorrow.io API." });
  }
});

/* -----------------------------------------------------------------------------
   WEATHER CODES → TEXT DESCRIPTION
----------------------------------------------------------------------------- */

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

/* -----------------------------------------------------------------------------
   WEATHER CODES → CLOUDINARY VIDEO URLS
----------------------------------------------------------------------------- */

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
  56: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",
  57: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",
  61: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",
  63: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",
  65: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_I_qijqzs.mp4",
  66: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Shower_j5qs3f.mp4",
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

/* -----------------------------------------------------------------------------
   WEATHER BEAST ROUTE (OPEN-METEO + NOAA)
----------------------------------------------------------------------------- */

app.get("/weather", async (req, res) => {
  try {
    let lat = req.query.lat;
    let lon = req.query.lon;
    let regionCode = null;
    let source = "";

    if (!lat || !lon) {
      console.log("No lat/lon provided. Doing IP lookup…");
      const ipData = await fetch("https://ipapi.co/json/").then((r) => r.json());
      lat = ipData.latitude;
      lon = ipData.longitude;
      regionCode = ipData.region_code;
      source = "IP Lookup";
    } else {
      regionCode = req.query.region || "LA";
      source = "GPS or Provided Lat/Lon";
    }

    console.log("Using lat/lon:", lat, lon);

    // Call Open-Meteo
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation,windspeed_10m,cloudcover,weathercode&timezone=America/Chicago`;

    const weatherData = await fetch(openMeteoUrl).then((r) => r.json());

    const current = weatherData.current_weather;
    const hourly = weatherData.hourly || {};

    const temp_c = current?.temperature || null;
    const temp_f = temp_c ? ((temp_c * 9) / 5 + 32).toFixed(1) : null;

    const feelsLike_c = temp_c;
    const feelsLike_f = temp_f;

    const windspeed_kmh = current?.windspeed || null;
    const windspeed_mph = windspeed_kmh
      ? (windspeed_kmh * 0.621371).toFixed(1)
      : null;

    const weatherCode = current?.weathercode ?? 0;
    const isDay = current?.is_day ?? 1;

    let iconUrl = weatherVideos[weatherCode] || null;

    if (isDay === 0) {
      if (weatherCode === 0) {
        iconUrl = weatherVideos["night_clear"];
      } else {
        iconUrl = weatherVideos[weatherCode] || null;
      }
    }

    const conditionText = weatherCodes[weatherCode] || "Clear sky";

    const weather = {
      temp_c,
      temp_f,
      feelsLike_c,
      feelsLike_f,
      windspeed_kmh,
      windspeed_mph,
      weathercode: weatherCode,
      conditionText,
      iconUrl,
      isDay,
      humidity: hourly?.relative_humidity_2m?.[0] || null,
      precipitation_mm: hourly?.precipitation?.[0] || null,
      cloudcover_pct: hourly?.cloudcover?.[0] || null
    };

    console.log("Weather Data:", weather);

    // NOAA
    const noaaUrl = `https://api.weather.gov/alerts/active?area=${regionCode}`;
    const noaaData = await fetch(noaaUrl).then((r) => r.json());

    let alert = {
      alertActive: false,
      alertEvent: null,
      alertDescription: null,
      alertInstruction: null,
      alertExpires: null,
      alertSeverity: null,
      alertHeadline: null,
      alertSender: null
    };

    if (noaaData.features?.length > 0) {
      const alertProps = noaaData.features[0].properties;
      alert = {
        alertActive: true,
        alertEvent: alertProps.event,
        alertDescription: alertProps.description,
        alertInstruction: alertProps.instruction,
        alertExpires: alertProps.expires,
        alertSeverity: alertProps.severity,
        alertHeadline: alertProps.headline,
        alertSender: alertProps.senderName
      };
    }

    console.log("NOAA Alert:", alert);

    return res.json({
      source,
      lat,
      lon,
      region: regionCode,
      weather,
      alert
    });
  } catch (error) {
    console.error("Weather Beast Error:", error);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

/* -----------------------------------------------------------------------------
   START SERVER
----------------------------------------------------------------------------- */

app.listen(PORT, () => {
  console.log(`Swole backend running on port ${PORT}`);
});
