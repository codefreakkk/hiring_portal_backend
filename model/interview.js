const mongoose = require("mongoose");

const interiew = mongoose.Schema({
  jid: {
    type: mongoose.Schema.ObjectId,
    ref: "jobs",
  },
  uid: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  interviewDetails: String,
  sheduleDate: String,
  oname: String,
});

const int = new mongoose.model("interview", interiew);
module.exports = int;