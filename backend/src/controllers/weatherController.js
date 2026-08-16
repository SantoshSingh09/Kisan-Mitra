const https = require('https');

function getWeather(req, res) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const lat = req.query.lat || '26.7637';
  const lon = req.query.lon || '83.4039';

  if (!apiKey) {
    return res.status(500).json({ message: 'Weather API key is not configured' });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  https.get(url, (apiRes) => {
    let data = '';
    apiRes.on('data', (chunk) => { data += chunk; });
    apiRes.on('end', () => {
      try {
        const weatherData = JSON.parse(data);
        if (weatherData.cod !== 200) {
          return res.status(400).json({ message: weatherData.message || 'Weather API error' });
        }
        res.json({
          location: weatherData.name,
          temperature: weatherData.main.temp,
          feelsLike: weatherData.main.feels_like,
          humidity: weatherData.main.humidity,
          description: weatherData.weather[0].description,
          windSpeed: weatherData.wind.speed
        });
      } catch (err) {
        res.status(500).json({ message: 'Error parsing weather data' });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ message: 'Error fetching weather data', error: err.message });
  });
}

module.exports = { getWeather };