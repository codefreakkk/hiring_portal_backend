const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const Jobs = require("../model/Jobs");
const fileUpload = require("express-fileupload");
const path = require("path");
const applicants = require("../model/Applicants");

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
    // changes to be done -
    // do not delete job instead update status to false
    const id = req.params.id;
    Jobs.findOneAndUpdate(
      { _id: id },
      { $set: { status: "false" } },
      (err, data) => {
        if (!err) res.status(200).send({ status: true });
        else req.status(500).send({ status: false });
      }
    );
  } catch (e) {
    res.status(500).send({ status: false });
  }
});

// route for fetching all jobs for admin which are active
router.post("/api/getalljobs", (req, res) => {
  Jobs.find(
    { $and: [{ oid: req.body.oid }, { status: "true" }] },
    (err, data) => {
      if (!err) res.status(200).send(data);
      else res.status(500).send({ status: false });
    }
  );
});

// route for fetching one job which is active
router.get("/api/getjob/:id", (req, res) => {
  try {
    const id = req.params.id;
    Jobs.findOne(
      {
        $and: [{ _id: id }, { status: "true" }],
      },
      (err, data) => {
        if (!err) res.status(200).send(data);
        else res.status(500).send({ data: false });
      }
    );
  } catch (e) {
    res.status(500).send({ data: false });
  }
});

// route for handling admin filter
router.post("/api/filterjobs", (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const jobType = data.jtype;
    const closingDate = data.date;
    const status = data.active;
    const jobTitle = data.search;
    const oid = data.oid;

    const regex = new RegExp(jobTitle, "i");
    Jobs.find(
      {
        $and: [
          { oid: oid },
          { jobTitle: regex },
          // posting date
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

// route for counting jobopening
router.post("/api/jobopenings", (req, res) => {
  const { oid } = req.body;
  try {
    Jobs.find({ oid: oid }, (err, data) => {
      if (!err) res.status(200).send({ status: data.length });
      else res.status(500).send({ status: false });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

// route for counting total reg
router.post("/api/totalreg", (req, res) => {
  const { oid } = req.body;
  try {
    applicants.find({ oid: oid }, (err, data) => {
      if (!err) res.status(200).send({ status: data.length });
      else res.status(500).send({ status: false });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

// route for counting total employee
router.post("/api/employeehired", (req, res) => {
  const { oid } = req.body;
  try {
    applicants.find(
      { $and: [{ oid: oid }, { hiringStatus: "true" }] },
      (err, data) => {
        if (!err) res.status(200).send({ status: data.length });
        else res.status(500).send({ status: false });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

// ----routes for user side

// route for fetching all jobs for user which are active
router.get("/api/getalljobsuser", (req, res) => {
  Jobs.find({ status: "true" }, (err, data) => {
    if (!err) res.status(200).send(data);
    else res.status(500).send({ status: false });
  });
});

// route for handling user filter jobs which are active
router.post("/api/filterusersjobs", (req, res) => {
  const {
    fullTime,
    internShip,
    partTime,
    experience,
    jobName,
    location,
    jobCat,
  } = req.body;
  try {
    const jobTitleRegex = new RegExp(jobName, "i");
    const locationRegex = new RegExp(location, "i");
    Jobs.find(
      {
        $and: [
          {
            $or: [
              { jobType: fullTime },
              { jobType: internShip },
              { jobType: partTime },
              { jobCategory: jobCat == "any" ? "" : jobCat },
              { jobexperience: experience },
            ],
          },
          { jobTitle: jobTitleRegex },
          { location: locationRegex },
          { status: "true" },
        ],
      },
      (err, data) => {
        if (!err) {
          console.log(data);
          res.status(200).send(data);
        } else res.status(400).send({ status: false });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(200).send({ status: false });
  }
});

// route for getting 4 jobs for user
router.get("/api/getfourjobs", (req, res) => {
  try {
    Jobs.find({ status: true }, (err, data) => {
      if (!err) res.status(200).send(data);
      else res.status(400).send({ status: false });
    }).limit(4);
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

module.exports = router;
