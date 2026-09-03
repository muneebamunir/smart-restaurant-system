const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  available: {
    type: Boolean,
    default: true
  },

  /* AI RECOMMENDATION */

  recommendWith: [
    {
      type: String
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Menu", menuSchema);