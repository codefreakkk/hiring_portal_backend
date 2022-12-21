const express = require("express");
const app = express();


const jobs = require("./controller/Jobs");
app.use(jobs);

const organization = require("./controller/Organization");
app.use(organization);

const user = require("./controller/User");
app.use(user);

const applicants = require("./controller/Applicants");
app.use(applicants);

module.exports = app;