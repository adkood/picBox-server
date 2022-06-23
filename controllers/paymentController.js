const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Photo = require("../models/photoModel");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the image to purchase
  const photo = await Photo.findById(req.params.photoId);

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
