'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const NoteSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: String, required: true }
});

const NoteModel = mongoose.model('note', NoteSchema);

module.exports = NoteModel;
