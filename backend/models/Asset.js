const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., vehicle, weapon, ammunition
  base: { type: String, required: true },
  quantity: { type: Number, required: true },
  openingBalance: { type: Number, default: 0 },
  closingBalance: { type: Number, default: 0 }
});

module.exports = mongoose.model('Asset', assetSchema);