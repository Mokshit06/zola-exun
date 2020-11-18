const { Router } = require('express');
const axios = require('axios');

const router = Router();

router.get('/', async (req, res) => {
  const { lon, lat } = req.query;

  const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
  const unit = 'imperial';

  const url = `${BASE_WEATHER_URL}?lat=${lon}&lon=${lat}&appid=${process.env.WEATHER_API_KEY}&units=${unit}`;

  try {
    const { data } = await axios.get(url);

    res.json({
      weather: data.weather[0].main,
      minTemp: data.main.temp_min,
      maxTemp: data.main.temp_max,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      feelsLike: data.main.feels_like,
      icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    });
  } catch (error) {
    console.log(error);

    res.json({
      message: 'Unable to connect to weather service!',
      success: false,
    });
  }
});

module.exports = router;
