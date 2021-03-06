/*
This model class represents a credential to be used in the application
Class is used to map a credential in the app to/from a database object
Mongoose is an ORM (Object Relational Mapper)
*/
const mongoose = require("mongoose");
const CredentialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  jobCategory: {
    type: String,
    required: true
  },
  credentialName: {
    type: String,
    required: true
  },
  issuingOrg: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Credential = mongoose.model("Credential", CredentialSchema);

module.exports = Credential;
