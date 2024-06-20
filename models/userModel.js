// models/patientModel.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  medicalHistory: { type: String }, // Example field
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
 