const mongoose = require("mongoose");

const organization = mongoose.Schema({
    organizationName: String,
    organizationEmail: String,
    organizationContact: String,
    organizationType: String,
    organizationCount: String,
    organizationLocation: String,
    fileUrl: String,
    joiningDate: String,
});

const orgDetails = new mongoose.model("orgDetails", organization);
module.exports = orgDetails;