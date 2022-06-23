const express = require("express");

const photoController = require("../controllers/photoController");
const authController = require("../controllers/authController");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.route("/getFivePhotos").get(photoController.getFivePhotos);

router.route("/search/:title").get(photoController.searchPhotos)

router
  .route("/")
  .get(authController.protect, photoController.getPhoto)
  .post(
    authController.protect,
    photoController.uploadPhotoPhoto,
    photoController.uploadPhoto
  );

router.use(authController.protect);

// router.route("/").get(photoController.getPhoto);
router
  .route("/:id")
  .patch(photoController.updatePhoto)
  .delete(authController.restrictedTo("admin"), photoController.deletePhoto);

module.exports = router;
