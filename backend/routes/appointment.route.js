import express from 'express';
import { createnewAppointment,deleteAppBypatIDDateAndTime,getAppointmentsbydoctor,getAppointmentsbydoctorID, getAppointmentsbypatientID, updatebydoctorID } from '../controllers/appointment.controller.js';
const router = express.Router();

router.post("/createappointment", createnewAppointment);
router.post("/getappdoctor", getAppointmentsbydoctorID);
router.post("/getappdoc",getAppointmentsbydoctor);
router.put("/update",updatebydoctorID);
router.post("/getappPat",getAppointmentsbypatientID);
router.post("/deleteapp",deleteAppBypatIDDateAndTime);

export default router;
