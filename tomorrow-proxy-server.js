const express = require('express');
const app = express();

// ✅ Your real Cloudinary video mapping
const weatherVideos = {
  1103: "https://res.cloudinary.com/dfq6hq2eh/video/upload/v1722665111/Weather%20Icons%20MP4/Mostly_Cloudy_eqdbmn.mp4"
};

app.get('/weather', async (req, res) => {
  try {
    // For this test, force the weatherCode to 1103
    const weatherCode = 1103;

    const iconUrl = weatherVideos[weatherCode] || null;

    // ✅ Return JSON as an array for Adalo "Get All"
    res.json([{
      temperature: 72,
      feelsLike: 73.9,
      condition: weatherCode,
      iconUrl
    }]);

  } catch (error) {
    console.error("Error fetching weather:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
