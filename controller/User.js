const express = require("express");
const router = express.Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const generateToken = (id) => {
  return jwt.sign({ id }, "codefreak.co.in", {
    expiresIn: "1d",
  });
};

router.post("/api/registeruser", (req, res) => {
  try {
    const userData = req.body;
    // check if email already exist in db
    User.findOne({ userEmail: userData.userEmail }, (err, emailData) => {
      if (!err) {
        console.log(emailData);
        if (emailData == null) {
          const data = new User({
            userName: userData.userName,
            userEmail: userData.userEmail.toLowerCase(),
            userPassword: userData.userPassword,
            token: "",
          });

          data.save((err) => {
            if (!err) res.status(200).send({ status: true });
            else res.status(400).send({ status: false });
          });
        } else res.status(200).send({ status: "email" });
      } else res.status(500).send({ status: false });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

// route for login
router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await User.findOne({
      userEmail: email,
      userPassword: password,
    });

    if (data != null) {
      const id = data._id.toString();
      const token = "Bearear " + generateToken(id);
      User.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            token: token,
          },
        },
        (err, data) => console.log(err)
      );
      res.status(200).send({ status: true, token: token });
    } else res.status(400).send({ status: false });
  } catch (e) {
    res.status(500).send({ status: false });
  }
});

router.post("/verify", auth, (req, res) => {
  res.status(200).send({status: true})
})

module.exports = router;
