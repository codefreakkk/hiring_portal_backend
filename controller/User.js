const express = require("express");
const router = express.Router();
const User = require("../model/User");

router.post("/api/registeruser", (req, res) => {
  try {
    const userData = req.body;

    // check if email already exist in db
    User.findOne({ userEmail: userData.userEmail }, (err, emailData) => {
      if (!err) {
        console.log(emailData)
        if (emailData == null) {
          const data = new User({
            userName: userData.userName,
            userEmail: userData.userEmail.toLowerCase(),
            userPassword: userData.userPassword,
          });

          data.save((err) => {
            if (!err) res.status(200).send({ status: true });
            else res.status(200).send({ status: false });
          });
        } else res.status(200).send({ status: "email" });
      } else res.status(500).send({ status: false });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

module.exports = router;
