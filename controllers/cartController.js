const Cart = require("../models/CartModel");
const User = require("../models/userModel");

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

exports.makeEmpty = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    userCart.cartData = [];
    userCart.cartAmount = 0;

    await userCart.save();

    return res
      .status(200)
      .json({ message: "Cart data updated to 0 successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.addPhotosToBoughtImages = async (req, res) => {
  try {
    // Find the user by ID
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    const cart = await Cart.findOne({ userId });

    if (!user || !cart) {
      // Handle the case where the user is not found
      return { success: false, message: "User not found / Cart not found" };
    }

    const cartArray = cart.cartData;

    console.log(cartArray);

    // Add the new photoId values to the boughtImages array
    user.boughtImages.push(
      ...cartArray.map((photoId) => ({
        _id: photoId._id,
        boughtOn: new Date(), // You can set the boughtOn date here
      }))
    );

    await User.findByIdAndUpdate(req.params.id, user, {
      new: true,
      runValidators: true,
    });

    await Cart.deleteOne({ userId });

    return res.status(200).json({
      success: true,
      message: "Photos added to boughtImages and cart cleared",
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
};
