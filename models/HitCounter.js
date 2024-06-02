const mongoose = require('mongoose');

const hitCounterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 1,
    required: true
  }
});

const HitCounter = mongoose.model('HitCounter', hitCounterSchema);

module.exports = HitCounter;