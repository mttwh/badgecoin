/*
This routes class handles all the routes to the root "/" of the application
For example, the route "router.get("/dashboard")" handles any GET requests
  to the route "/dashboard"
*/
const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const passport = require("passport");

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
        //console.log(e);
      });
      //------------------------------------------------------^^user dashboard function
    } else {
      console.log("USER NOT FOUND");
    }
  });
});

//Admin Login GET
router.get("/admin-login", (req, res) => {
  res.render("admin-login");
});

//Admin Login POST
router.post("/admin-login", (req, res, next) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user.isAdmin) {
      passport.authenticate("local", {
        successRedirect: "/admin-dashboard",
        failureRedirect: "/admin-login",
        failureFlash: true
      })(req, res, next);
    } else {
      console.log(user.isAdmin);
      res.render("admin-login");
    }
  });
});

//Admin Dashboard GET
router.get("/admin-dashboard", ensureAuthenticated, (req, res) => {
  console.log("admin dashboard function");
  User.findOne({ _id: req.session.passport.user }).then(user => {
    User.find({ "credentials.issuingOrg": user.adminOrg })
      .then(doc => {
        let numUsersWithCredentials = doc.length;
        res.render("admin-dashboard", {
          name: req.user.name,
          adminOrg: user.adminOrg,
          numUsersWithCredentials: numUsersWithCredentials
        });
      })
      .catch(err => console.log(err));
  });
});

//Admin Dashboard - Users with credentials page GET
router.get("/user-credentials", ensureAuthenticated, (req, res) => {
  console.log("user credentials function");
  User.findOne({ _id: req.session.passport.user }).then(admin => {
    User.find({ "credentials.issuingOrg": admin.adminOrg })
      .then(doc => {
        let userArray = [];
        let tempUserObject = {};
        let tempCredObject = {};
        console.log(doc.length);
        //iterating over all users with credentials at adminOrg
        doc.forEach(user => {
          console.log(user);
          tempUserObject["email"] = user.email;
          let currentUserCreds = user.credentials;
          let relevantCredNum = 0;
          let credentials = [];
          //iterating over credentials for each user
          for (i = 0; i < currentUserCreds.length; i++) {
            let cred = currentUserCreds[i];
            //check if credential is with adminorg

            if (cred.issuingOrg == admin.adminOrg) {
              relevantCredNum++;
              let relevantCred = "Credential # " + relevantCredNum;
              tempCredObject["credentialName"] = cred.credentialName;
              tempCredObject["issuingOrg"] = cred.issuingOrg;
              credentials.push(tempCredObject);
              tempCredObject = {};
            }
          }
          tempUserObject["credentials"] = credentials;
          userArray.push(tempUserObject);
        });

        res.render("users-with-creds", {
          usersWithCreds: userArray,
          adminOrg: admin.adminOrg
        });
      })
      .catch(err => console.log(err));
  });
});

module.exports = router;
