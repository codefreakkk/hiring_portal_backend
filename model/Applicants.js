const mongoose = require("mongoose");

const applicants = mongoose.Schema({
  oid: {
    type: mongoose.Schema.ObjectId,
    ref: "orgDetails",
  },
  jid: {
    type: mongoose.Schema.ObjectId,
    ref: "jobs",
  },
  uid: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  jobTitle: String,
  userName: String,
  userEmail: String,
  interviewStatus: {
    type: String, 
    default: "false"
  },
  hiringStatus: {
    type: String, 
    default: "false"
  },
  appliedOn: String,
});

const Applicants = new mongoose.model("applicants", applicants);
module.exports = Applicants;