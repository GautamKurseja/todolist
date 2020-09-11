const path = require("path")
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PostRoutes = require("../backend/routes/posts")
const userRoutes = require("../backend/routes/users")


mongoose
  .connect(

    "mongodb://localhost:27017/Chirpn"
  )
  .then(() => {
    console.log("Connected to  DataBase");
  })
  .catch((err) => console.log("Caught", err.stack));
// .catch(() => {
//   console.log("Connection Failed");
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use("/api/posts",PostRoutes)
app.use("/api/user", userRoutes);


module.exports = app;
