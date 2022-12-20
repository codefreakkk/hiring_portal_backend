const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const Jobs = require("../model/Jobs");
const fileUpload = require("express-fileupload");
const path = require("path");

// image upload configuration
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

// route for posting one job
router.post("/api/postjob", (req, res) => {
  // check if file is been served to server or not
  try {
    if (!req.files) {
      res.status(500).send({ status: 404 });
      console.log("file not received");
      return;
    }
    const file = req.files.image;
    const ext = path.extname(file.name);
    const data = req.body;
    if (ext == ".png" || ext == ".jpeg" || ext == ".jpg") {
      cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
        // if file uploads then store all data into database
        if (!err) {
          const jobData = new Jobs({
            oid: data.oid,
            oname: data.oname,
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
          jobData.save((err, data) => {
            if (!err) res.status(200).send({ status: true });
            else res.status(400).send({ status: 500 });
          });
        } else res.status(400).send({ status: -1 });
      });
    } else {
      console.log("Error");
      res.status(400).send({ status: -2 });
    }
  } catch (e) {
    res.status(500).send({ status: -1 });
  }
});

// route for deleting one job
router.delete("/api/deletejob/:id", (req, res) => {
  try {
    const id = req.params.id;
    Jobs.deleteOne({ _id: id }, (err, data) => {
      if (!err) res.status(200).send({ status: true });
      else req.status(500).send({ status: false });
    });
  } catch (e) {
    res.status(500).send({ status: false });
  }
});

// route for fetching all jobs
router.get("/api/getalljobs", (req, res) => {
  Jobs.find((err, data) => {
    if (!err) res.status(200).send(data);
    else res.status(500).send({ status: false });
  });
});

// route for fetching one job
router.get("/api/getjob/:id", (req, res) => {
  try {
    const id = req.params.id;
    Jobs.findOne({ _id: id }, (err, data) => {
      if (!err) res.status(200).send(data);
      else res.status(500).send({ data: false });
    });
  } catch (e) {
    res.status(500).send({ data: false });
  }
});

// route for handling filter
router.post("/api/filterjobs", (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const jobType = data.jtype;
    const closingDate = data.date;
    const status = data.active;
    const jobTitle = data.search;

    const regex = new RegExp("^" + jobTitle, "i");
    Jobs.find(
      {
        $and: [
          { jobTitle: regex },
          { closingDate: closingDate },
          { jobType: jobType },
          { status: status },
        ],
      },
      (err, data) => {
        if (!err) res.status(200).send(data);
        else res.status(500).send({ data: false });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send({ data: false });
  }
});

module.exports = router;
