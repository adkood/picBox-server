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
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photo',
      },
      title: {
        type: String,
        default: 'Default Title',
      },
      size: {
        type: String,
        default: 'Default Size',
      },
      date: {
        type: String,
        default: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      },
    }
  ],
  transactionPhotoIds: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photo',
      },
      title: {
        type: String,
        default: 'Default Title',
      },
      size: {
        type: String,
        default: 'Default Size',
      },
      name: {
        type: String,
        default: 'Default Name',
      },
      price: {
        type: Number,
      },
      date: {
        type: String,
        default: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      },
    }
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
