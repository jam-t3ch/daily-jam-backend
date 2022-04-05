'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  user: { type: String, required: true },
  note: { type: String, required: true },
  loc: { type: String, required: true }
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
