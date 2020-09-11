const express = require("express");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user.save().then((result) => {
        res.status(201).json({
          message: "User Created",
          result: result,
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser
  let mypassword = req.body.password
  console.log(mypassword,"myyy")
  User.findOne({ email: req.body.email }).then((user) => {
      console.log("user",user)
      if (!user) {
        res.status(404).json({
          message: "user not exist",
        });
      }
      fetchedUser = user
    return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      console.log("result",result)
      if (!result) {
        return res.status(404).json({
          message: "Password not matched",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn:3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}
