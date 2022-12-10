const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userName: String,
    userEmail: String,
    userPassword: String,
});

const user = new mongoose.model("user", userSchema);
module.exports = user;