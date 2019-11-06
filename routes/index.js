const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

//User model
const User = require("../models/User");

//Welcome page GET
router.get("/", (req, res) => res.render("welcome"));

//Dashboard page GET
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  console.log("dashboard function");
  let currentUserId = req.session.passport.user;
  console.log(currentUserId);

  //mongo query to get current user
  User.findOne({ _id: currentUserId }, function(err, user) {
    if (err) {
      console.log("ERROR");
      console.log(err);
    }
    if (user) {
      console.log("USER FOUND");
      console.log(user.email);
      let userCredentialsArray = user.credentials;
      //render dashboard page if user exists
      res.render("dashboard", {
        credentials: userCredentialsArray,
        name: req.user.name
      });
      //iterating over user credentials array
      userCredentialsArray.forEach(e => {
        console.log(e);
      });
      //------------------------------------------------------^^user dashboard function
    } else {
      console.log("USER NOT FOUND");
    }
  });
});

module.exports = router;
