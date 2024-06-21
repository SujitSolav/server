const express = require("express");
const router = express.Router();
const Patient = require('../models/userModel');
const Doctor= require('../models/doctorModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Appointment =require('../models/appointmentModel')
// const authMiddleWare =require('../middleware/authMiddlwWare')


router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (role === 'doctor') {
      user = new Doctor({ name, email, password: hashedPassword, specialty: req.body.specialty });
    } else if (role === 'patient') {
      user = new Patient({ name, email, password: hashedPassword, medicalHistory: req.body.medicalHistory });
    } else {
      return res.status(400).send({ message: "Invalid role", success: false });
    }

    const existingUser = await (role === 'doctor' ? Doctor : Patient).findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User Already Exists", success: false });
    }

    await user.save();
    res.status(201).send({ message: "User Created Successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server Error", success: false });
  }
});


router.post("/login", async (req, res) => {
    try {
      const { email, password, role } = req.body;
      let user;
      if (role === 'doctor') {
        user = await Doctor.findOne({ email });
      } else if (role === 'patient') {
        user = await Patient.findOne({ email });
      } else {
        return res.status(400).send({ message: "Invalid role", success: false });
      }
      if (!user) {
        return res.status(400).send({ message: "User Does Not Exist", success: false });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send({ message: "Password Incorrect", success: false });
      }
  
      const token = jwt.sign({ userId: user._id, role }, "your_jwt_secret", { expiresIn: "1h" });
      res.status(200).send({ message: "Login Successful", success: true, token, role, UserId:user._id , userName:user.name});
      
      // console.log(name);

    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Error", success: false });
    }
});

router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).send({ success: true, data: doctors });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server Error" });
  }
}); 

router.get('/users', async (req, res) => {
  try {
    const user = await user.find({});
    res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server Error" });
  }
}); 


router.post('/book-appointment', async (req, res) => {
    try {
      const token = req.headers["authorization"].split(" ")[1];
      if (!token) {
        return res.status(401).send({ message: "No token provided", success: false });
      }
      jwt.verify(token, 'your_jwt_secret', async (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "Invalid token", success: false });
        }
        const { doctorId, appointmentDate, userId , status} = req.body;
        const patientId = userId;
        const newAppointment = new Appointment({
          doctor: doctorId,
          patient: patientId,
          date: appointmentDate,
          status : status || 'Pending'
        });
        await newAppointment.save();
        res.status(201).send({ success: true, message: 'Appointment booked successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "Server Error" });
    }
});

router.get('/appointments/', async (req, res) => {
  try {
    const { doctorId } = req.query;
    // console.log(doctorId)
    const appointments = await Appointment.find({ doctor: doctorId });
    // console.log(appointments);
    const appointmentsWithNames = await Promise.all(appointments.map(async appointment => {
      const patient = await Patient.findById(appointment.patient);
      // console.log(patient)
      return {
        _id: appointment._id,
        doctor: appointment.doctor,
        patient: {
          _id: patient._id,
          name: patient.name
        },
        date: appointment.date,
        status: appointment.status 
      };
    }));
    // console.log(appointmentsWithNames)

    res.status(200).send({ success: true, data: appointmentsWithNames });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server Error" });
  }
});

router.get('/getAppointmentsById/', async (req, res) =>{
  try {
    const { userId } = req.query;
    const appointments = await Appointment.find({ patient: userId });
    // console.log(appointments);
    const MyappointmentsWithNames = await Promise.all(appointments.map(async appointment => {
      const doctor = await Doctor.findById(appointment.doctor);
      // console.log(patient)
      return {
        _id: appointment._id,
        doctor: appointment.doctor,
        doctor: {
          _id: doctor._id,
          name: doctor.name
        },
        date: appointment.date,
        status:appointment.status
      };
    }));
    // console.log(MyappointmentsWithNames)

    res.status(200).send({ success: true, data: MyappointmentsWithNames });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server Error" });
  }
} );

router.post('/changeStatus',  async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({ success: false, message: 'Appointment not found' });
    }

    // Update the status
    appointment.status = status;
    await appointment.save();

    res.status(200).send({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Server Error' });
  }
});

module.exports = router;

