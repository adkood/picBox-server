const fs = require("fs");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const multer = require("multer");
const sharp = require("sharp");
const Cart = require("../models/CartModel");

const factory = require("../controllers/handlerFactory");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

// const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("img");

// exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `${req.protocol}://${req.hostname}/public/img/users/${req.file.originalname}`;

//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat("jpeg")
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/users/${req.file.filename}`);

//   next();
// });

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {

  console.log("***");
  //Create error if user wants to change password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password change, please use /updateMyPassword",
        400
      )
    );
  }

  // filter out the fields which you dont want to be updated
  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "profession",
    "boughtImages",
    "planActive",
    "planCount",
    "role"
  );

  //for adding profile picture
  if (req.file) {
    filteredBody.img = {
      data: fs.readFileSync("uploads/" + req.file.filename),
      // contentType: "image/png",
    };
  }

  // filteredBody.photo = req.file.filename;

  //update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  // console.log(">"+updatedUser+"<");
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "succes",
    data: null,
  });
});

// exports.updateRole = async (req, res) => {
//   const { userId } = req.body;
//   console.log(userId);

//   try {
//     const data = await User.findById(userId);
//     if (!data) {
//       return res.status(404).json({ error: "Data not found" });
//     }
//     console.log(data);
//     data.role = "admin";
//     await data.save();

//     return res.status(200).json(data);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };

exports.updateUser = catchAsync(async (req, res, next) => {
  const newBody = await User.findById(req.params.id);
  newBody.role = "admin";
  const doc = await User.findByIdAndUpdate(req.params.id, newBody, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
// exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
