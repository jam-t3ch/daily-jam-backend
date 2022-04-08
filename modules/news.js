const axios = require('axios');
let cache = require('./cache.js');

function getNews(Search, Locale) {
  const key = 'news-' + Search + Locale;
  const url = `https://api.thenewsapi.com/v1/news/top?api_token=${process.env.NEWS_API_KEY}&search=${Search}&locale=${Locale}`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 1000 * 60 * 60 * 24 * 1)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url)
      .then(response => parseNews(response.data));
  }

  return cache[key].data;
}

function parseNews(newsData) {
  try {
    const newsSummaries = newsData.data.map(day => {
      console.log(day);
      return new NewsHeadline(day);
    });
    return Promise.resolve(newsSummaries);
  } catch (error) {
    return Promise.reject(error);
  }
}

class NewsHeadline {
  constructor(newsObject) {
    this.title = newsObject.title;
    this.description = newsObject.description;
  }
}

module.exports = getNews;
