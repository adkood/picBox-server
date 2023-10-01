const Cart = require("../models/CartModel");

exports.addToCart = async (req, res) => {
  try {
    const { photoId, title, size, price, discount, newPrice } = req.body;
    console.log(req.body);
    const userId = req.params.id;
    var data = await Cart.findOne({ userId });

    // const validUserId = mongoose.Types.ObjectId(userId);

    if (!data) {
      data = new Cart({ userId, cartData: [], cartAmount: 0 });
    }

    data.cartData.push({
      _id: photoId,
      title,
      size,
      price,
      discount,
      finalPrice: newPrice,
    });
    data.cartAmount += newPrice;

    await data.save();
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    console.log(">>>");
    const { photoId, finalPrice } = req.body;
    const userId = req.params.id;
    var userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const newCartData = userCart.cartData.filter(
      (obj) => obj._id.toString() !== photoId
    );

    userCart.cartData = newCartData;
    userCart.cartAmount -= finalPrice;

    await userCart.save();
    return res.status(200).json(userCart);
  } catch (error) {
    return res.status(500).json({ error: "Could not remove from cart !!!" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.params.id;
    var userCart = await Cart.findOne({ userId });

    return res.status(200).json(userCart);
  } catch (error) {
    return res.status(500).json({ error: "Could not fetch cart" });
  }
};
