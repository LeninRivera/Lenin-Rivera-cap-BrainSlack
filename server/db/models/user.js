const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Need below if i'm going to make a relation between my user and messages
const Messages = require("./message");
const { validate } = require("./message");

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid.");
        }
      },
    },
    password: {
      type: string,
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
    tokens: [
      {
        tokens: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

/*
  By using toJson on this instance method we don't need to 
  call it for it to run because our express res.send or 
  res.json methods calls it for us.
  @return {name, email, admin, timestamps}
*/
userSchema.methods.toJson = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

/*
this instance method will generate a user token and append it to the user.tokens array in the DB @return {token}
*/
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user.id.toString(), name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

/*
This static method will first find a user by email and then compare that users password with the submitted password. Static methods are run on the actual Model (User), instead of an instance of model. @return {user}
*/
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to log in.");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login.");
  return user;
};

/*
This mongoose middleware will hash our user's passwords
whenever a user is created or a user password is updated.
it doesn't return anything, but calls next instead. This next
servers the same purpose as the next we have been calling in
express, but ut us not the same next. this one is provided by mongoose, and the other by express
*/
