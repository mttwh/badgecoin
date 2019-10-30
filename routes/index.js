const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

//Welcome page
router.get("/", (req, res) => res.render("welcome"));

//Dashboard page
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    name: req.user.name
  });
  console.log("dashboard function");
});

module.exports = router;
