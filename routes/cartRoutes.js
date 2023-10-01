const express = require("express");
const CartController = require("../controllers/cartController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.route("/:id").get(CartController.getCart);
router.route("/:id").patch(CartController.addToCart);
router.route("/remove/:id").patch(CartController.removeFromCart);

module.exports = router;
