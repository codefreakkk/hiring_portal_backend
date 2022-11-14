const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const Jobs = require("../model/Jobs");
const fileUpload = require("express-fileupload");
const path = require("path");

// configuration
cloudinary.config({
  cloud_name: "duwbwdwqc",
  api_key: "723896973772636",
  api_secret: "srE4voWKjc8uQ8MnR4BXXqDecgY",
});

router.use(
  fileUpload({
    useTempFiles: true,
  })
);

// route for posting job
router.post("/api/postjob", (req, res) => {
  // check if file is been served to server or not
  if (!req.files) {
    res.status(500).send({ status: 404 });
    console.log("file not received");
    return;
  }
  const file = req.files.image;
  const ext = path.extname(file.name);
  const data = req.body;
  if (ext == ".png" || ext == ".pdf" || ext == ".jpeg" || ext == ".jpg") {
    cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
      // if file uploads then store all data into database
      if (!err) {
        const jonData = new Jobs({
          jobTitle: data.jobTitle.toLowerCase(),
          jobDescription: data.jobDesc,
          jobType: data.jobType,
          jobCategory: data.jobCat,
          vacancy: data.vacancy,
          jobexperience: data.jobexperience,
          closingDate: data.closingDate,
          location: data.location,
          email: data.email,
          website: data.website,
          responsibilities: JSON.parse(data.resp),
          requirements: JSON.parse(data.requirements),
          qualification: JSON.parse(data.qualification),
          skills: JSON.parse(data.experience),
          keywords: JSON.parse(data.keywords),
          imageUrl: result.url,
          status: "true",
        });
        // save data
        jonData.save((err, data) => {
          if (!err) res.status(200).send({ status: true });
          else res.status(500).send({ status: 500 });
        });
      } else res.status(500).send({ status: -1 });
    });
  } else {
    console.log("Error");
    res.status(500).send({ status: -2 });
  }
});

// get jobs route
router.get("/getalljobs", (req, res) => {
  Jobs.find((err, data) => {
    if (!err) res.status(200).send(data);
    else res.status(500).send({ status: false });
  });
});

// handle filter jobs route
router.post("/api/filterjobs", (req, res) => {
  const data = req.body;
  Jobs.find(
    {
      jobTitle: data.search,
      status: data.active,
      jobType: data.jtype,
      closingDate: data.date,
    },
    (err, data) => {
      if (!err) console.log(data);
    }
  );
});

module.exports = router;
