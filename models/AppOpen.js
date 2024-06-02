// models/AppOpen.js

const mongoose = require('mongoose');

const appOpenSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 1,
    required: true
  }
});

const AppOpen = mongoose.model('AppOpen', appOpenSchema);

module.exports = AppOpen;
