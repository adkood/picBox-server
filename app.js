const path = require("path");
const fs = require("fs");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const compression = require('compression');

const AppError = require("./utils/appError");
const GlobalErrorHandler = require("./controllers/errController");
const userRouter = require("./routes/userRoutes");
const photoRouter = require("./routes/photoRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const bodyParser = require("body-parser");
const { mongo } = require("mongoose");
const cors = require("cors");
const { pathToFileURL } = require("url");
const { Router } = require("express");

const app = express();

// const pathToFile = path.resolve(__dirname, '../public');
// app.use(express.static("public"));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//set http headers for security
// app.use(helmet());

//limit request
// used to prevent brute force attack by hacker
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(bodyParser.json());

// data sanitization against noSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["price"],
  })
);

app.use(compression());

app.get("/", (req, res) => {
  res.status(200).send("hello from form server side!");
});

//Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/photo", photoRouter);
app.use("/api/v1/payment" , paymentRouter);

//handling unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//error handling middleware
app.use(GlobalErrorHandler);

module.exports = app;
