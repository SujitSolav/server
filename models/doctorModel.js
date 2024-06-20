// models/doctorModel.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true }, // Example field
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
