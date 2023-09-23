const mongoose = require("mongoose");

const CountSchema = new mongoose.Schema({
  downloadCount: {
    type: Number,
    default: 0,
  },
  transactionCount: {
    type: Number,
    default: 0,
  },
  downloadedPhotoIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo", // Assuming you have a Photo model for storing photo details
    },
  ],
  transactionPhotoIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo", // Assuming you have a Photo model for storing photo details
    },
  ],
  numberOfImagesPosted: {
    type: Number,
    default: 0,
  },
  biggestTransaction: {
    value: {
      type: Number,
      default: 0,
    },
    tDate: {
      type: Date,
      default: null, // You can set a default date or leave it as null
    },
  },
});

const Count = mongoose.model("Count", CountSchema);

module.exports = Count;
