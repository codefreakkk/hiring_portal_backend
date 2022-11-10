const express = require("express");
const router = express.Router();

const Organization = require("../model/Organization");

// route for getting organization data
router.post("/api/organization", (req, res) => {
  const oid = req.body.oid;
  Organization.findOne({ oid: oid }, (err, data) => {
    if (!err) res.status(200).send(data);
    else res.status(500).send({ status: false });
  });
});

// route for storing orginzation data in db
router.post("/api/registerorganization", (req, res) => {
  const org = req.body;
  if (
    org.oid.length != 0 &&
    org.oname.length != 0 &&
    org.oemail.length != 0 &&
    org.ocontact.length != 0 &&
    org.otype.length != 0 &&
    org.ocount.length != 0 &&
    org.olocation.length != 0
  ) {
    const data = new Organization({
      oid: org.oid,
      organizationName: org.oname,
      organizationEmail: org.oemail,
      organizationContact: org.ocontact,
      organizationType: org.otype,
      organizationCount: org.ocount,
      organizationLocation: org.olocation,
      fileUrl: "http://www.cloud.com",
      joiningDate: new Date(Date.now()).toLocaleDateString(),
    });

    data.save((err) => {
      if (!err) res.status(200).send({ status: true });
      else res.status(500).send({ status: false });
    });
  } else {
    res.status(500).send({ status: false });
  }
});

module.exports = router;
