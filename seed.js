'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./modules/user');
mongoose.connect(process.env.DB_URL);

async function seed() {
  await User.create({
    user: 'brooksjamesk01@gmail.com',
    note: 'This is a test note',
    loc: 'Seattle, King County, Washington'
  });
  console.log('James Brooks was added to the DB');
  mongoose.disconnect();
}

seed();
