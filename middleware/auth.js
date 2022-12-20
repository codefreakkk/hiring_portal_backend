const jwt = require("jsonwebtoken");
const user = require("../model/User");

const authenctication = async (req, res, next) => {
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearear")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const verify = jwt.verify(token, "codefreak.co.in");
      const userId = verify.id;
      req.user = await user.findById(userId);
      next();
    } catch (e) {
      console.log("User not autencticated");
      res.status(401).send({ status: false });
    }
  }

  if (!token) {
    console.log("User not autencticated");
    res.status(401).send({ status: false });
  }
};

module.exports = authenctication;
