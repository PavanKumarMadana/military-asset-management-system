const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  personnel: { type: String, required: true },
  quantity: { type: Number, required: true },
  base: { type: String, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['assigned', 'expended'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Assignment', assignmentSchema);