/*
This routes class handles all routes that start with "/users"
For example, the route "router.get("/register")" handles GET requests to the 
  URL "/users/register".
*/
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//User model
const User = require("../models/User");

//Login page
router.get("/login", (req, res) => res.render("login"));

//Register page
router.get("/register", (req, res) => res.render("register"));

//Register POST
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  //Check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  //Check password length
  if (password.length < 8) {
    errors.push({ msg: "Password should be at least 8 characters." });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //Validation passes
    User.findOne({ email: email }).then(user => {
      if (user) {
        //User exists
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        //User does not exist
        const newUser = new User({
          name,
          email,
          password
        });
        console.log(newUser);
        //Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //Set password to hashed
            newUser.password = hash;
            //Save user
            newUser
              .save()
              .then(user => {
                req.flash("success_msg", "You are now registered");
                res.redirect("/users/login");
              })
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});

//Login POST
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);

  User.findOne({ email: req.body.email }).then(user => {
    req.session.user = user;
    req.session.save();
  });
});

//Logout GET
router.get("/logout", (req, res) => {
  req.logout();

  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

//Credential Model
const Credential = require("../models/Credential");

//New Credentials GET
router.get("/new-credentials", (req, res) => {
  res.render("new-credentials");
});

//New Credentials POST
router.post("/new-credentials", (req, res, next) => {
  let currentUserId = req.session.passport.user;
  const { name, issuingOrg, jobCategory, credentialName } = req.body;
  let newCredential = new Credential({
    name,
    issuingOrg,
    jobCategory,
    credentialName
  });

  User.findOne({ _id: currentUserId }).then(user => {
    console.log(user);
    user.credentials.push(newCredential);
    user.save((err, result) => {
      if (err) res.sendStatus(500);
      console.log("Credential written");
    });
  });

  res.redirect("/dashboard");
});

module.exports = router;
