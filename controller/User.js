const express = require("express");
const router = express.Router();
const User = require("../model/User");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const path = require("path");

// image upload configuration
cloudinary.config({
  cloud_name: "duwbwdwqc",
  api_key: "723896973772636",
  api_secret: "srE4voWKjc8uQ8MnR4BXXqDecgY",
});

const generateToken = (id) => {
  return jwt.sign({ id }, "codefreak.co.in", {
    expiresIn: "1d",
  });
};


// route for getting a user data for admin
router.get("/api/getuserbyid/:id", (req, res) => {
  console.log(req.params.id);
  try {
    User.findOne({_id: req.params.id}, (err, data) => {
      if(!err) res.status(200).send(data);
      else res.status(500).send({status: false});
    })
  } catch(e) {
    res.status(500).send({status: false});
  }
})

// route for getting a user data
router.get("/api/getuserbyid", auth, (req, res) => {
  try {
    User.findOne({_id: req.user.id}, (err, data) => {
      if(!err) res.status(200).send(data);
      else res.status(500).send({status: false});
    })
  } catch(e) {
    res.status(500).send({status: false});
  }
})

// route for updating user and uploading cv
router.post("/api/updateuser", auth, (req, res) => {
  try {
    if (!req.files) {
      res.status(400).send({ status: false });
      return;
    }
    const file = req.files.cv;
    const ext = path.extname(file.name);
    const data = req.body;

    if (ext == ".pdf") {
      cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
        if (!err) {
          console.log("CV uploaded");
          const url = result.url;
          User.findOneAndUpdate(
            { _id: data.id },
            {
              $set: {
                userName: data.name,
                userEmail: data.email,
                contact: data.number,
                gender: data.gender,
                address: data.address,
                qual: data.qual,
                state: data.state,
                city: data.city,
                cvUrl: url,
              },
            },
            (err, data) => {
              if (!err) res.status(200).send(data);
              else res.status(500).send({ status: false });
            }
          );
        } else res.status(500).send({ status: false });
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/api/registeruser", (req, res) => {
  try {
    const userData = req.body;
    // check if email already exist in db
    User.findOne({ userEmail: userData.userEmail }, (err, emailData) => {
      if (!err) {
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

// route for fetching username and email
router.get("/api/getuserbyid", auth, (req, res) => {
  const uid = req.user._id.toString();
  try {
    User.findOne({ _id: uid }, (err, data) => {
      if (!err) res.status(200).send(data);
      else res.status(400).send({ status: false });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false });
  }
});

module.exports = router;
