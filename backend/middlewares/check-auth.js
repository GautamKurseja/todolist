const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("token",token)
    const decodeToken = jwt.verify(token, "secret_this_should_be_longer");
    console.log("decode",decodeToken)
    req.userData = { email: decodeToken.email, userId: decodeToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};
