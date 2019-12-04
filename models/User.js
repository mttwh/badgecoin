/*
This model class represents a user within the application
Class is used to map a user of the app to/from a database object
Mongoose is an ORM (Object Relational Mapper)
*/
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  credentials: {
    type: Array
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  adminOrg: {
    type: String,
    required: false,
    default: null
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
