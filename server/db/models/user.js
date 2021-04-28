const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid.");
      }
    },
  },
  password: {
    type: String,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password can't be password.");
      }
      if (value.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }
    },
  },
  socketId: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
