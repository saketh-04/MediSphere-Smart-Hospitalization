import Ehr from "../models/ehr.model.js";
import Prescription from "../models/prescription.model.js"

export const addPrescription = async (req, res) => {
    const newinfo = req.body;
  
    // Validate required fields
    if (
      !newinfo.MLN ||
      !newinfo.patientID ||
      !newinfo.diagnosis ||
      newinfo.numberOfMedications === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    newinfo.isComplete = 'False'
    try {
      // Create the new prescription
      const prescription = await Prescription.create(newinfo);
      return res.status(201).json({
        success: true,
        data: prescription,
      });
    } catch (error) {
      console.error("Error creating prescription:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  export const getPrescriptionByPatientIDAndMLN = async (req, res) => {
    const { patientID, MLN } = req.body;
  
    // Validate required fields
    if (!patientID || !MLN) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
  
    try {
      // Find all prescriptions matching the patientID and MLN
      const prescriptions = await Prescription.find({ patientID, MLN ,isComplete:'False'});
      return res.status(200).json({
        success: true,
        data: prescriptions,
      });
    } catch (error) {
      console.error("Error retrieving prescriptions:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

export const getPrescriptionByMedID = async (req, res) => {
  const info = req.body;
  if (!info.patientID) {
    return res.status(400).json({ success: false, message: "Please enter medID" });
  }

  try {
    // Find the prescription using the provided medID
    const prescription = await Prescription.findOne({ patientID: info.patientID });
    
    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    return res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    console.error("Error retrieving prescription by medID:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
