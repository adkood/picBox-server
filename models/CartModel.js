const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cartData: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Photo",
      },
      title: {
        type: String,
      },
      size: {
        type: Number,
      },
      price: {
        type: Number,
      },
      discount: {
        type: Number,
      },
      finalPrice: {
        type: Number,
      },
    },
  ],
  cartAmount: {
    type: Number,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
