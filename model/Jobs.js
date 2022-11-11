const mongoose = require("mongoose");

const jobs = mongoose.Schema({
    jobTitle: String, 
    jobDescription: String,
    jobType: String,
    jobCategory: String,
    vacancy: String,
    experience: String,
    closingDate: String,
    location: String,
    email: String,
    website: String,
    responsibilities: [{}],
    requirements: [{}],
    qualification: [{}],
    skills: [{}],
    keywords: [{}],
})

const postJobs = new mongoose.model("postJobs", jobs);
module.exports = postJobs;