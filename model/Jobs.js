const mongoose = require("mongoose");

const jobs = mongoose.Schema({
    oid: {
        type: mongoose.Schema.ObjectId,
        ref: "orgDetails",
    },
    oname: "String",
    jobTitle: String, 
    jobDescription: String,
    jobType: String,
    jobCategory: String,
    vacancy: String,
    jobexperience: String,
    closingDate: String,
    location: String,
    email: String,
    website: String,
    responsibilities: [{}],
    requirements: [{}],
    qualification: [{}],
    skills: [{}],
    keywords: [{}],
    imageUrl: String,
    status: String,
})

const postJobs = new mongoose.model("jobs", jobs);
module.exports = postJobs;