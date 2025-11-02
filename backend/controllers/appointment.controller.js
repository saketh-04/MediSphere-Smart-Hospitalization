// appointment.controller.js

import Appointment from "../models/appointment.model.js";

export const createnewAppointment = async (req, res) => {
  const appointment = req.body;
  // Validate required fields
  if (
    !appointment.doctorID ||
    !appointment.email ||
    !appointment.date ||
    !appointment.time ||
    !appointment.patientName ||
    !appointment.phoneNO ||
    !appointment.reasonVisit
  ) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  appointment.isemailSend = 'False'
  appointment.isComplete = 'False'
  try {
    // Generate appointmentID based on the count for this email
    appointment.appointmentID = await Appointment.countDocuments({ email: appointment.email }) + 1;
    const newAppointment = await Appointment.create(appointment);
    return res.status(201).json({ success: true, message: "Appointment created successfully", data: newAppointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAppointmentsbydoctorID = async (req, res) => {
  const dID = req.body;
  if (!dID.doctorID) {
    return res.status(400).json({ success: false, message: "Doctor ID is required" });
  }
  const doctorID = dID.doctorID;
  try {
    // Use "False" as a string to match the schema
    const appointments = await Appointment.find({ doctorID: doctorID, isComplete: "False" });
    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const getAppointmentsbydoctor = async (req, res) => {
    const dID = req.body;
    if (!dID.doctorID) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }
    const doctorID = dID.doctorID;
    try {
      // Use "False" as a string to match the schema
      const appointments = await Appointment.find({ doctorID: doctorID, isComplete: "True" });
      return res.status(200).json({ success: true, data: appointments });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  export const updatebydoctorID = async (req, res) => {
    try {
      const { doctorID, patientID, ...updateFields } = req.body;
  
      // Validate required fields
      if (!doctorID) {
        return res.status(400).json({ success: false, message: "Doctor ID is required" });
      }
      if (!patientID) {
        return res.status(400).json({ success: false, message: "Patient ID is required" });
      }
  
      // Example: Force isComplete to "True" if you want
      // updateFields.isComplete = "True";
  
      // Find and update the appointment by (doctorID, patientID),
      // returning the updated doc. 'new: true' => returns updated doc
      // 'upsert: false' => do NOT create new doc if not found
      const updatedAppointment = await Appointment.findOneAndUpdate(
        { doctorID, patientID },
        { $set: updateFields },
        { new: true, upsert: false }
      );
  
      if (!updatedAppointment) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
      }
  
      return res.status(200).json({ success: true, data: updatedAppointment });
    } catch (error) {
      console.error("Error updating appointment:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  

  export const getAppointmentsbypatientID = async (req, res) => {
    const info = req.body;
    
    if (!info.patientID) {
      return res.status(400).json({ success: false, message: "Enter the PatientID" });
    }
    
    try {
      // Query the database for appointments with the given patientID
      const appointments = await Appointment.find({ patientID: info.patientID , isComplete:'False' , isemailSend:'False'});
      
      if (!appointments || appointments.length === 0) {
        return res.status(404).json({ success: false, message: "No appointments found for this patient" });
      }
      
      return res.status(200).json({ success: true, data: appointments });
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  export const deleteAppBypatIDDateAndTime = async (req, res) => {
    const info = req.body;
    
    if (!info.patientID || !info.date || !info.time) {
      return res.status(400).json({ success: false, message: "Please enter all the fields" });
    }
    
    try {
      const result = await Appointment.deleteOne({ 
        patientID: info.patientID, 
        date: info.date, 
        time: info.time 
      });
      
      if (result.deletedCount > 0) {
        return res.status(200).json({ success: true, message: "Appointment deleted successfully" });
      } else {
        return res.status(404).json({ success: false, message: "Appointment not found" });
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  