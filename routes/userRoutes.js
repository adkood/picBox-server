const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup); //
router.post("/login", authController.login); //

router.post("/forgetPassword", authController.forgetPassword); //
router.patch("/resetPassword/:token", authController.resetPassword); //

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.get(
  "/me",
  authController.protect,
  userController.getMe,
  userController.getUser
);

/////////////////---------------->
router.patch(
  "/updateMe",
  authController.protect,
  userController.uploadUserPhoto,
  // userController.resizeUserPhoto,
  userController.updateMe
); //

router.delete("/deleteMe", authController.protect, userController.deleteMe); //

// router.use(authController.protect, authController.restrictedTo("admin"));
router.use(authController.protect);

// router.put("/updateRole",userController.updateRole);
router.get("/", userController.getAllUsers); //
// .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser) //
  .patch(userController.updateUser) //
  .delete(userController.deleteUser); //

module.exports = router;
