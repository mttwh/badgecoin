const mongoose = require("mongoose");

const IndustrySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  }
});

const Industry = mongoose.model("Industry", IndustrySchema);

module.exports = Industry;
