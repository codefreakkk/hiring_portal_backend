const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const applicants = require("../model/Applicants");
const orgDetails = require("../model/Organization");
const Interview = require("../model/interview");
const user = require("../model/User");
const Job = require("../model/Jobs");
const Applicants = require("../model/Applicants");

// ---- admin side

// route for fetching all applicants
router.post("/api/getjoballapplicants", (req, res) => {
  const { cid } = req.body;
  try {
    Applicants.find(
      { $and: [{ oid: cid }, { interviewStatus: "false" }] },
      (err, data) => {
        if (!err) res.status(200).send(data);
        else res.status(500).send({ status: false });
      }
    );
  } catch (e) {
    res.status(500).send({ status: false });
  }
});

// route for filtering admin candidate-interview jobs
router.post("/api/filterjobcandidate", (req, res) => {
  const { oid, date, filter } = req.body;
  console.log(date);
  const search = new RegExp(filter, "i");
  try {
    applicants.find(
      {
        oid: oid,
        $and: [
          { jobTitle: search },
          { appliedOn: date },
          { interviewStatus: "true" },
          { hiringStatus: "false" },
        ],
      },
      (err, data) => {
        if (!err) res.status(200).send(data);
        else res.status(500).send({ status: false });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send({ data: false });
  }
});

// route for filtering admin candidate-applicant jobs
router.post("/api/filterjobapplicant", (req, res) => {
  const { oid, date, filter } = req.body;
  console.log(date);
  const search = new RegExp(filter, "i");
  try {
    applicants.find(
      {
        oid: oid,
        $and: [{ jobTitle: search }, { appliedOn: date }],
      },
      (err, data) => {
        if (!err) res.status(200).send(data);
        else res.status(500).send({ status: false });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send({ data: false });
  }
});

// route for fetching by interview
router.post("/api/interview", (req, res) => {
  const { cid } = req.body;
  try {
    Applicants.find(
      {
        $and: [
          { oid: cid },
          { interviewStatus: "true", hiringStatus: "false" },
        ],
      },
      (err, data) => {
        if (!err) res.status(200).send(data);
        else res.status(500).send({ status: false });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

// rout for updating interview status
router.put("/api/updateinterview", (req, res) => {
  const { cid, uid, jid } = req.body;
  try {
    Applicants.findOneAndUpdate(
      {
        $and: [{ oid: cid }, { uid: uid }, { jid: jid }],
      },
      {
        $set: {
          interviewStatus: "true",
        },
      },
      (err, data) => {
        if (!err) res.status(200).send({ status: true });
        else res.status(500).send({ status: false });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

// route for rejecting applicant
router.post("/api/rejectapplicant", (req, res) => {
  const { cid, uid, jid } = req.body;
  try {
    Applicants.deleteOne(
      {
        $and: [{ oid: cid }, { uid: uid }, { jid: jid }],
      },
      (err, data) => {
        if (!err) {
          // delete interview details too
          Interview.deleteOne({ $and: [{ uid: uid }, { jid: jid }] }, () => {});
          res.status(200).send({ status: data });
        } else res.status(500).send({ status: false });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

// route for updating hire
router.put("/api/hireapplicant", (req, res) => {
  const { cid, uid, jid } = req.body;
  try {
    Applicants.findOneAndUpdate(
      {
        $and: [{ oid: cid }, { uid: uid }, { jid: jid }],
      },
      {
        $set: {
          hiringStatus: "true",
        },
      },
      (err, data) => {
        if (!err) {
          Interview.deleteOne({ $and: [{ uid: uid }, { jid: jid }] }, () => {});
          res.status(200).send({ status: true });
        } else res.status(500).send({ status: false });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

// route for fetching hired applicants
router.get("/api/hiredapplicants", (req, res) => {
  try {
    applicants.find({ hiringStatus: "true" }, (err, data) => {
      console.log(data);
      if (!err) res.status(200).send(data);
      else res.status(500).send({ status: false });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

// schedule interview
router.post("/api/scheduleinterview", (req, res) => {
  try {
    const { id, jid, iname, date, oname } = req.body;
    const data = new Interview({
      uid: id,
      interviewDetails: iname,
      sheduleDate: date,
      jid: jid,
      oname: oname,
    });
    data.save((err, data) => {
      if (!err) res.status(200).send({ status: true });
      else res.status(500).send({ status: false });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

// ----- user side

// route for checking job apply
router.get("/api/checkjobapply", auth, async (req, res) => {
  const uid = req.user.id;
  try {
    const data = await applicants.findOne({ uid });
    if (data != null) res.status(200).send({ status: true });
    else res.status(200).send({ status: false });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

// route for applying for job
router.post("/api/apply", auth, async (req, res) => {
  const uid = req.user.id;
  const { jid, oid, jobTitle, userName, userEmail } = req.body;
  try {
    // check if resume is uploaded
    const checkResume = await user.findOne({ _id: uid });
    if (checkResume == null) {
      res.status(200).send({ status: false });
      return;
    } else {
      const cvCount = checkResume.cvUrl.length;
      if (cvCount == 0) {
        res.status(200).send({ status: false });
        return;
      }
    }

    // save data into db
    const date = new Date(Date.now()).toLocaleDateString().split("/");
    const data = new applicants({
      oid,
      jid,
      uid,
      jobTitle,
      userName: userName,
      userEmail: userEmail,
      appliedOn: `${date[2]}-${date[1]}-${date[0]}`,
    });
    data.save((err) => {
      if (!err) res.status(200).send({ status: true });
      else res.status(500).send({ status: false });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

// route for getting jobs for which user has applied
router.get("/api/getappliedjobs", auth, (req, res) => {
  const uid = req.user.id;
  try {
    applicants.find({ uid: uid }, (err, data) => {
      if (!err) {
        res.status(200).send(data);
        // console.log(job);
      } else res.status(500).send({ status: false });
    });
  } catch (e) {
    res.status(500).send({ status: false });
  }
});

// route for getting interview details
router.get("/api/getinterview/:id/job/:jid", (req, res) => {
  const id = req.params.id;
  const jid = req.params.jid;
  try {
    Interview.find({ $and: [{ jid: jid }, { uid: id }] }, (err, data) => {
      if (!err) res.status(200).send(data);
      else res.status(500).send({ status: false });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

// route for getting interview details for user
router.get("/api/getallinterviews/", auth, (req, res) => {
  const id = req.user.id;
  try {
    Interview.find(
      { $and: [{ uid: id }, { hiringStatus: "false" }] },
      (err, data) => {
        if (!err) res.status(200).send(data);
        else res.status(500).send({ status: false });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

module.exports = router;
