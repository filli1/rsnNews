const express = require('express');
const router = express.Router();

const weatherController = require('../controllers/weather.controllers');

router.get('/', (req, res) => {
    return weatherController.getForecast(req, res);
});

router.get('/currentweather', (req, res) => {
    return weatherController.getCurrentWeather(req, res);
})

module.exports = router;