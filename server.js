'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const axios = require('axios');
const mongoose = require('mongoose');
const app = express();
const weather = require('./modules/weather');

mongoose.connect(process.env.DB_URL);
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});


app.get('/', (request, response) => {
  response.send('Hello this works!');
});

app.get('/weather', weatherHandler);

app.get('*', (request, response) => {
  response.send('Not sure what you are looking for. but it doesn\'t exist.');
});

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong!');
    });
}

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});



app.listen(PORT, () => console.log(`listening on port ${PORT}`));
