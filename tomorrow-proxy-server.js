
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------------------------------------------
// Weather Code → Cloudinary Video Map
// -------------------------------------------------------------------

const weatherIcons = {
    // CLEAR / CLOUDS
    1000: "https://res.cloudinary.com/defqia9sh/video/upload/v1722661811/Clear_8965.mp4",         // Clear
    1100: "https://res.cloudinary.com/defqia9sh/video/upload/v1722662110/Mostly_Clear_urbdo.mp4", // Mostly Clear
    1101: "https://res.cloudinary.com/defqia9sh/video/upload/v1722662317/Partly_Cloudy_sukmeh.mp4", // Partly Cloudy
    1102: "https://res.cloudinary.com/defqia9sh/video/upload/v1722662471/Mostly_Cloudy_yushmb.mp4", // Mostly Cloudy
    1001: "https://res.cloudinary.com/defqia9sh/video/upload/v1722662614/Cloudy_q9dxtl.mp4",        // Cloudy

    // FOG / HAZE
    2100: "https://res.cloudinary.com/defqia9sh/video/upload/v1722662711/Fog_Windy_Snow_mn0cfe.mp4", // Fog / Windy Snow
    2000: "https://res.cloudinary.com/defqia9sh/video/upload/v1722662851/Light_Fog_Dreary_krjjlb.mp4", // Light Fog / Dreary

    // RAIN
    4200: "https://res.cloudinary.com/defqia9sh/video/upload/v1722662991/Drizzle_lipzli.mp4",       // Drizzle
    4201: "https://res.cloudinary.com/defqia9sh/video/upload/v1722663147/Light_Rain_sy4xlr.mp4",    // Light Rain
    4000: "https://res.cloudinary.com/defqia9sh/video/upload/v1722663298/Heavy_Rain_gegsh.mp4",     // Heavy Rain

    // SNOW / MIX
    5001: "https://res.cloudinary.com/defqia9sh/video/upload/v1722663461/Snow_7d5qvg.mp4",          // Snow
    5100: "https://res.cloudinary.com/defqia9sh/video/upload/v1722663594/Flurries_iwmqp4.mp4",      // Flurries
    5101: "https://res.cloudinary.com/defqia9sh/video/upload/v1722663724/Light_Snow_Pellets_wkypmb.mp4", // Light Snow
    5110: "https://res.cloudinary.com/defqia9sh/video/upload/v1722663843/Freezing_Drizzle_Mix_8k7b0g.mp4", // Freezing Drizzle / Mix
    5111: "https://res.cloudinary.com/defqia9sh/video/upload/v1722663978/Heavy_Freezing_Rain_377qfe.mp4", // Heavy Freezing Rain

    // ICE PELLETS / HAIL
    7000: "https://res.cloudinary.com/defqia9sh/video/upload/v1722664119/Ice_Pellets_n7reux.mp4",   // Ice Pellets
    7101: "https://res.cloudinary.com/defqia9sh/video/upload/v1722664246/Heavy_Ice_Pellets_xvqkmp.mp4", // Heavy Ice Pellets
    7102: "https://res.cloudinary.com/defqia9sh/video/upload/v1722664359/Light_Freezing_Rain_n7r4b6.mp4", // Light Freezing Rain

    // THUNDERSTORMS & OTHERS
    8000: "https://res.cloudinary.com/defqia9sh/video/upload/v1722664495/Thunderstorm_Custom_b1zjmn.mp4", // Thunderstorm (custom)
    8001: "https://res.cloudinary.com/defqia9sh/video/upload/v1722664590/Thunderstorm_Wind_Custom_v3y4p0.mp4", // Thunderstorm + Wind (custom)
    8002: "https://res.cloudinary.com/defqia9sh/video/upload/v1722664691/Dry_Lightning_Custom_s9kpop.mp4", // Dry Lightning (custom)
};

// Default video if no match
const defaultIconUrl = "https://res.cloudinary.com/defqia9sh/video/upload/v1722665122/Default_Clouds_Sun_smxkn.mp4";

// -------------------------------------------------------------------
// WEATHER ROUTE
// -------------------------------------------------------------------

app.get('/weather', async (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;

    if (!lat || !lon) {
        return res.status(400).json({ error: "Missing lat or lon query params." });
    }

    try {
        console.log(`Fetching weather data for lat=${lat}, lon=${lon}`);

        const response = await axios.get(`https://api.tomorrow.io/v4/weather/realtime`, {
            params: {
                location: `${lat},${lon}`,
                apikey: process.env.TOMORROW_API_KEY,
            }
        });

        const weatherData = response.data;

        // Pull out data values
        const temperature = weatherData.data.values.temperature;
        const feelsLike = weatherData.data.values.temperatureApparent || null;
        const weatherCode = weatherData.data.values.weatherCode || null;

        console.log("Fetched temp:", temperature);
        console.log("Weather Code:", weatherCode);

        let iconUrl = defaultIconUrl;

        if (weatherCode && weatherIcons[weatherCode]) {
            iconUrl = weatherIcons[weatherCode];
        }

        res.json([{
            temperature,
            feelsLike,
            condition: weatherCode,
            iconUrl
        }[);

    } catch (error) {
        console.error("Error fetching weather from Tomorrow.io", error?.response?.data || error?.message);
        res.status(500).json({ error: "Failed to fetch weather data." });
    }
});

// -------------------------------------------------------------------
// START SERVER
// -------------------------------------------------------------------

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Tomorrow Proxy running on port ${PORT}`);
});
