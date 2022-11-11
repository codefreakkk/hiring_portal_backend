const express = require("express");
const app = express();

const organization = require("./controller/Organization");
app.use(organization);

const jobs = require("./controller/Jobs");
app.use(jobs);

module.exports = app;