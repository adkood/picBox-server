const mongoose = require("mongoose");

const demandSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  country: String,
  street: String,
  city: String,
  social: String,
  imageDesc: String,
  isResolved: {
    type: Boolean,
    default: false,
  }
});

const Demand = mongoose.model("Demand", demandSchema);

module.exports = Demand;
