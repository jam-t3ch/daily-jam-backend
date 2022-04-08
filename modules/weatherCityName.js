const axios = require('axios');
let cache = require('./cache.js');

function getWeatherCityName(cityName) {
  const key = 'weather-' + cityName;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lang=en&city=${cityName}&days=5`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 1000 * 60 * 60 * 24 * 1)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url)
      .then(response => parseWeather(response.data));
  }

  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Forecast(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (error) {
    return Promise.reject(error);
  }
}

let monthArr = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function fToC(celsius) {
  return (celsius * (9 / 5)) + 32;
}

let weekdayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

class Forecast {
  constructor(cityObject) {
    this.dayNum = cityObject.valid_date.slice(8, 10);
    this.month = monthArr[cityObject.valid_date.slice(6, 7)];
    this.year = cityObject.valid_date.slice(0, 4);
    this.high = Math.floor(fToC(cityObject.max_temp)).toString();
    this.low = Math.floor(fToC(cityObject.min_temp)).toString();
    this.condition = cityObject.weather.description;
    let dayindex = new Date(`${this.month} ${this.dayNum}, ${this.year} 23:15:30`);
    this.dayofweek = weekdayArr[dayindex.getDay()];
    this.imgsrc = this.condition.split(' ')[0];
  }
}

module.exports = getWeatherCityName;
