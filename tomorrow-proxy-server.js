const express = require('express');
const axios = require('axios');
const app = express();

const weatherVideos = {
  1000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Sun_vlifro.mp4",
  1100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Sun_Clouds_kfb1c9.mp4",
  1101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Sun_Clouds_kfb1c9.mp4",
  1102: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Sun_Clouds_kfb1c9.mp4",
  1001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mostly_Cloudy_eqdbmn.mp4",
  1103: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mostly_Cloudy_eqdbmn.mp4",
  2000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Cloudy_ujjjyr.mp4",
  4200: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Rain_azdyyv.mp4",
  4201: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_I_qijqzs.mp4",
  5000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_apib0s.mp4",
  5001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_Shower_uqb03b.mp4",
  5100: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Light_Snow_gswdxh.mp4",
  5101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_Shower_uqb03b.mp4",
  6000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mist_rwvamd.mp4",
  6001: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mist_rwvamd.mp4",
  6200: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mist_Wind_t711q0.mp4",
  6201: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Mist_Wind_t711q0.mp4",
  7000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Snow_Sun_wdvphe.mp4",
  7101: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Snow_Shower_o77gbf.mp4",
  7102: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Rain_Snow_Sun_xoxeqr.mp4",
  8000: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1750226637/Thunderstorm_zu58xq.mp4",
  4400: "https://res.cloudinary.com/dqfoiq9zh/video/upload/v1751686564/Night_hdskkm.mp4"
};

app.get('/weather', async (req, res) => {
  try {
    const lat = req.query.lat || '38.9072';
    const lon = req.query.lon || '-77.0369';
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,is_day,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=mph`;

    const response = await axios.get(url);
    const weather = response.data.current;

    let iconUrl = weatherVideos[weather.weather_code] || null;

    // Check if it's night and override icon
    if (weather.is_day === 0) {
      iconUrl = weatherVideos[4400];
    }

    res.json([
      {
        temperature: weather.temperature_2m,
        feelsLike: weather.temperature_2m,
        condition: weather.weather_code,
        conditionText: getConditionText(weather.weather_code),
        isDay: weather.is_day,
        iconUrl: iconUrl,
        windSpeed: weather.windspeed_10m,
        humidity: weather.relative_humidity_2m,
        precipitation: weather.precipitation
      }
    ]);
  } catch (error) {
    console.error("Error fetching weather:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

function getConditionText(code) {
  const map = {
    1000: "Clear",
    1001: "Partly Cloudy",
    1100: "Partly Cloudy",
    1101: "Partly Cloudy",
    1102: "Partly Cloudy",
    1103: "Mostly Cloudy",
    2000: "Cloudy",
    4200: "Light Rain",
    4201: "Rain",
    5000: "Snow",
    5001: "Snow Shower",
    5100: "Light Snow",
    5101: "Snow Shower",
    6000: "Mist",
    6001: "Mist",
    6200: "Mist & Wind",
    6201: "Mist & Wind",
    7000: "Snow & Sun",
    7101: "Rain & Snow Shower",
    7102: "Rain & Snow Sun",
    8000: "Thunderstorm"
  };
  return map[code] || "Unknown";
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
