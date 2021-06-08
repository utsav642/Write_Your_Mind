const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

const {storySchema} = require("../models/story");

const userSchema = new mongoose.Schema ({
  email: String,
  user: String,
  password: String,
  googleId: String,
  stories: [storySchema]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
module.exports = User;