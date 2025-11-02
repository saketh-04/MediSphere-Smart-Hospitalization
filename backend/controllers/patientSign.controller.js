import PatientSign from "../models/patientsign.model.js";


export const createPatientSign = async (req, res) => {
    const newinfo = req.body;
    
    // Validate required fields
    if (!newinfo.fname || !newinfo.lname || !newinfo.phNo || !newinfo.DOB || !newinfo.email || !newinfo.password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    
    // Check if the email already exists
    const checkIfEmailExists = await PatientSign.findOne({ email: newinfo.email });
    if (checkIfEmailExists) {
        return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Generate medID using current year and count of documents
    const year = new Date().getFullYear();
    const count = await PatientSign.countDocuments();
    newinfo.medID = "MED" + year + (count + 1);

    try {
        // Create the new patient record
        const patient = await PatientSign.create(newinfo);
        return res.status(201).json({ success: true, data: patient });
    } catch (error) {
        console.error("Error creating patient:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const checkPatientSign = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    try {
        const patient = await PatientSign.findOne({ email: email });
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }
        if (patient.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }
        return res.status(200).json({ success: true, data: patient });
    } catch (error) {
        console.error("Error checking patient:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
export const getByEmail = async (req, res) => {
    const info = req.body;
    if (!info.email) {
        return res.status(400).json({ success: false, message: "Enter the Email" });
    }

    try {
        const allDetails = await PatientSign.findOne({ email: info.email }).select("-password");
        if (!allDetails) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        return res.status(200).json({ success: true, data: allDetails });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};