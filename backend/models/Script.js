const mongoose = require('mongoose');

const scriptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link scripts to users
});

module.exports = mongoose.model('Script', scriptSchema);