const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Organization = require("../model/Organization");

const generateToken = (id) => {
  return jwt.sign({ id }, "companylogin", {
    expiresIn: "1d",
  });
};

// fetch one record of organization route
router.post("/api/organization", (req, res) => {
  const _id = req.body.oid;
  Organization.findOne({ _id: _id }, (err, data) => {
    if (!err) res.status(200).send(data);
    else res.status(500).send(data);
  });
});

// register organization route
router.post("/api/registerorganization", (req, res) => {
  const org = req.body;
  if (
    org.oname.length != 0 &&
    org.oemail.length != 0 &&
    org.ocontact.length != 0 &&
    org.otype.length != 0 &&
    org.ocount.length != 0 &&
    org.olocation.length != 0 &&
    org.password.length != 0
  ) {
    const data = new Organization({
      organizationName: org.oname,
      organizationEmail: org.oemail,
      organizationContact: org.ocontact,
      organizationType: org.otype,
      organizationCount: org.ocount,
      organizationLocation: org.olocation,
      joiningDate: new Date(Date.now()).toLocaleDateString(),
      password: org.password,
    });

    data.save((err) => {
      if (!err) res.status(200).send({ status: true });
      else res.status(500).send({ status: false });
    });
  } else {
    res.status(500).send({ status: false });
  }
});

// update organization details
router.put("/api/updateorganization", (req, res) => {
  try {
    const org = req.body;
    if (
      org.oid.length != 0 &&
      org.oname.length != 0 &&
      org.oemail.length != 0 &&
      org.ocontact.length != 0 &&
      org.otype.length != 0 &&
      org.empCount.length != 0 &&
      org.olocation.length != 0
    ) {
      Organization.findOneAndUpdate(
        { _id: org.oid },
        {
          $set: {
            organizationName: org.oname,
          },
        },
        (err, data) => {
          if (!err) res.status(200).send({ status: true });
          else res.status(500).send({ status: false });
        }
      );
    } else res.status(500).send({ status: false });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

// route for comoany login
router.post("/api/companylogin", async (req, res) => {
  const { name, password } = req.body;
  try {
    const data = await Organization.findOne({
      organizationEmail: name,
      password: password,
    });
    if (data != null) {
      const token = "Bearear " + generateToken(data._id.toString());
      res
        .status(200)
        .send({
          status: true,
          token: token,
          cid: data._id,
          oname: data.organizationName,
        });
    } else res.status(401).send({ status: false });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

module.exports = router;
