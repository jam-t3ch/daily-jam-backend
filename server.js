'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const axios = require('axios');
const mongoose = require('mongoose');
const app = express();
const weather = require('./modules/weather');
const weatherCityName = require('./modules/weatherCityName');
const verifyUser = require('./auth');
const User = require('./modules/user');
const notes = require('./modules/notes');


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

app.get('/test', (req, res) => {
  verifyUser(req, async (err) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      res.send('test request received');
    }
  });
});

app.get('/weather', weatherHandler);
app.get('/weatherCity', weatherCityHandler);

app.get('/profile', getProfile);
app.post('/profile', postProfile);
app.put('/profile/:id', putProfile);
app.delete('/profile/:id', deleteProfile);

app.get('/notes', getNotes);
app.post('/notes', postNotes);
app.put('/notes/:id', putNotes);
app.delete('/notes/:id', deleteNotes);

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

function weatherCityHandler(request, response) {
  const cityName = request.query.cityName;
  weatherCityName(cityName)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong!');
    });
}

async function getProfile(req, res, next) {
  verifyUser(req, async (err) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      try {
        let queryObject = {};
        if (req.query.name) {
          queryObject.name = req.query.name;
          // console.log(queryObject);
        }
        let results = await User.find(queryObject);
        // console.log(results);
        res.status(200).send(results);
      } catch (error) {
        next(error);
      }
    }
  });
}

async function postProfile(req, res, next) {
  verifyUser(req, async (err) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      try {
        console.log(req.body);
        let newUser = await User.create(req.body);
        res.status(200).send(newUser);
      } catch (error) {
        next(error);
      }
    }
  });
}

async function putProfile(req, res, next) {
  verifyUser(req, async (err) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      try {
        let id = req.params.id;
        let updatedUser = await User.findByIdAndUpdate(id, req.body, {new: true, overwrite: true});
        res.status(200).send(updatedUser);
      } catch (error) {
        next(error);
      }
    }
  });
}

async function deleteProfile(req, res, next) {
  verifyUser(req, async (err) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      try {
        let id = req.params.id;
        await User.findByIdAndDelete(id);
        res.send('User Deleted');
      } catch (error) {
        next(error);
      }
    }
  });
}

async function getNotes(req,res,next){
  verifyUser(req, async (err) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      try {
        let queryObject = {};
        // console.log(`params: ${req.query.email}`);
        if (req.params) {
          queryObject.user = req.query.email;
        }
        let results = await notes.find(queryObject);
        // console.log(results);
        res.status(200).send(results);
      } catch (error) {
        next(error);
      }
    }
  });
}

async function postNotes(req,res,next){
  verifyUser(req, async (err) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      try {
        console.log(req.body);
        let newUser = await notes.create(req.body);
        res.status(200).send(newUser);
      } catch (error) {
        next(error);
      }
    }
  });
}

async function putNotes(req,res,next){
  verifyUser(req, async (err) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      try {
        let id = req.params.id;
        let updatedNotes = await notes.findByIdAndUpdate(id, req.body, {new: true, overwrite: true});
        res.status(200).send(updatedNotes);
      } catch (error) {
        next(error);
      }
    }
  });
}

async function deleteNotes(req,res,next){
  verifyUser(req, async (err) => {
    if (err) {
      console.error(err);
      res.send('invalid token');
    } else {
      try {
        let id = req.params.id;
        await notes.findByIdAndDelete(id);
        console.log('Note Deleted');
        res.send('Note Deleted');
      } catch (error) {
        next(error);
      }
    }
  });
}

app.use((error, request, response, next) => {
  next(error);
});



app.listen(PORT, () => console.log(`listening on port ${PORT}`));
