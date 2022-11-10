const express = require("express");
const app = express();

const organization = require("./controller/Organization");
app.use(organization);

module.exports = app;