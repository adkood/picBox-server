const mongoose = require("mongoose");
const validator = require("validator");

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  img: {
    data: Buffer,
  },
  size: {
    type: String,
  },
  width: {
    type: String,
  },
  height: {
    type: String,
  },
  uploadedOn: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  price: {
    type: Number,
    required: [true, "it must have a price"],
  },
  priceDiscount: {
    type: Number,
    // validate: {
    //   validator: function (val) {
    //     // this only points to current doc on NEW document creation
    //     return val < this.price;
    //   },
    //   message: "Discount price ({VALUE}) should be below regular price",
    // },
  },
  premium: {
    type: Boolean,
    default: false,
  },
  author: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
});

photoSchema.pre(/^find/, function (next) {
  this.populate({ path: "author", select: "-__v -changedPasswordAt" });
  next();
});

const Photo = mongoose.model("Photo", photoSchema);
module.exports = Photo;
