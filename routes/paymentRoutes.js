const express = require("express");
const paymentController = require("./../controllers/paymentController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router
  .get("/checkout-session/:photoId", paymentController.getCheckoutSession)
  .get("/checkout-session-basic", paymentController.getCheckoutSession_basic)
  .get("/checkout-session-pro", paymentController.getCheckoutSession_pro)
  .get("/checkout-session-premium", paymentController.getCheckoutSession_premium);

module.exports = router;
