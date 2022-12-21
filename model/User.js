const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: String,
  userEmail: String,
  userPassword: String,
  contact: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  qual: {
    type: String,
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  token: String,
  cvUrl: {
    type: String,
    default: "",
  }
});

const user = new mongoose.model("user", userSchema);
module.exports = user;
