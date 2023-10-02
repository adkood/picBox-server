const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Photo = require("../models/photoModel");
const Count = require("../models/CountModel");
const Cart = require("../models/CartModel");

exports.getCartCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the image to purchase
  const userId = req.params.id;
  var userCart = await Cart.findOne({ userId });

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `http://localhost:3000/cartSuccess?userId=${userId}`,
    cancel_url: `${req.protocol}://${req.get("host")}`,
    client_reference_id: req.params.userId,
    line_items: [
      {
        name: "Cart Items",
        amount: userCart.cartAmount * 100,        
        currency: "inr",
        quantity: 1,
      },
    ],
  });
  
  res.status(200).json({
    status: "success",
    session,
  });
});


exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the image to purchase
  const photo = await Photo.findById(req.params.photoId);

  const _id = req.params.photoId;
  const price = photo.price;
  const title = photo.title;
  const size = photo.size;
  const name = photo.author[0].name;

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `http://localhost:3000/success?userId=${req.user.id}&photoId=${req.params.photoId}`,
    cancel_url: `${req.protocol}://${req.get("host")}/photo/${photo.title}`,
    customer_email: req.user.email,
    client_reference_id: req.params.photoId,
    line_items: [
      {
        name: `${photo.title}`,
        amount: photo.price * 100,        
        currency: "inr",
        quantity: 1,
      },
    ],
  });
  
  //----------------------Setting up transaction count things
  const countData = await Count.findOne({});
  countData.transactionPhotoIds.push({_id,title,size,name,price});
  countData.transactionCount += 1;
  await countData.save();

  //---------------------------------------------------

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

exports.getCheckoutSession_basic = catchAsync(async (req, res, next) => {
  // 1) Get the image to purchase
  const photo = await Photo.findById(req.params.photoId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `http://localhost:3000/planSuccess?plan=1`,
    cancel_url: `${req.protocol}://${req.get("host")}`,
    customer_email: req.user.email,
    client_reference_id: req.params.photoId,
    line_items: [
      {
        name: "Basic",
        amount: 199 * 100,        
        currency: "inr",
        quantity: 1,
      },
    ],
  });
  
  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

exports.getCheckoutSession_pro = catchAsync(async (req, res, next) => {
  // 1) Get the image to purchase
  const photo = await Photo.findById(req.params.photoId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `http://localhost:3000/success?plan=2`,
    cancel_url: `${req.protocol}://${req.get("host")}`,
    customer_email: req.user.email,
    // client_reference_id: req.params.photoId,
    line_items: [
      {
        name: "Pro",
        amount: 599 * 100,        
        currency: "inr",
        quantity: 1,
      },
    ],
  });
  
  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

exports.getCheckoutSession_premium = catchAsync(async (req, res, next) => {
  // 1) Get the image to purchase
  const photo = await Photo.findById(req.params.photoId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `http://localhost:3000/success?plan=3`,
    cancel_url: `${req.protocol}://${req.get("host")}`,
    customer_email: req.user.email,
    // client_reference_id: req.params.photoId,
    line_items: [
      {
        name: "Premium",
        amount: 1099 * 100,        
        currency: "inr",
        quantity: 1,
      },
    ],
  });
  
  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

// exports.onSuccessChanges = catchAsync(async (req, res, next) => {
//   const url = window.location.href;
//   console.log(url);
//   let userI = req.query.userI;
//   let photoI = req.query.photoI;
//   if (!userI && !photoI) {
//     return next();
//   }

//   const doc = await User.findById(userId);
//   console.log("on Success ->", doc);

//   // res.redirect(req.originalUrl.split('?')[0]);
// });
