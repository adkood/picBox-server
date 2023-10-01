const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
//name email photo password passwordconfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  profession: {
    type: String,
    default: "not mentioned",
  },
  img: {
    data: Buffer,
  },
  boughtImages: [
    {
      photoId: {
        type: String,
      },
      boughtOn: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  role: {
    type: String,
    required: [true, "please specify your role"],
    // enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //this only works on create and save
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not same!",
    },
  },
  planActive: Boolean,
  planCount: {
    type: Number,
    default: 0,
  },

  changedPasswordAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  cart: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Photo",
      },
      title: {
        type: String,
      },
      size: {
        type: Number,
      },
      name: {
        type: String,
      },
      price: {
        type: Number,
      },
      dicount: {
        type: Number,
      },
      finalPrice: {
        type: Number,
      },
    },
  ],
  cartAmount: {
    type: Number,
  },
  createdAt: {
    type: String,
    default: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.changedPasswordAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// instance method ( can be accessed by any document)
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordOn = function (created_on) {
  if (this.changedPasswordAt) {
    const password_changed_on = parseInt(
      this.changedPasswordAt.getTime() / 1000,
      10
    );
    console.log(created_on, password_changed_on);
    return created_on < password_changed_on;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
