const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

//Passport config
require("./config/passport")(passport);

//DB Config
const db = require("./config/keys").MongoURI;

//Connect to Mongo (database)
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

//EJS (for the view engine)
app.use(expressLayouts);
app.set("view engine", "ejs");

//BodyParser
app.use(express.urlencoded({ extended: false }));

//Express session
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

//Passport middleware (for authentication)
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global variables (for use in flash messages)
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Routes (defines the rotues and routing classes used in the application)
app.use("/", require("./routes/index.js"));
app.use("/users", require("./routes/users.js"));

//defines the port
const PORT = process.env.PORT || 5000;

//starts the application listening on the defined port
app.listen(PORT, console.log(`Server started on port ${PORT}`));
