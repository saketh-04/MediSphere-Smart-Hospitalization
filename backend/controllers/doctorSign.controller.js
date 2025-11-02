import DoctorSign from "../models/doctor.sign.model.js";

export const createDoctorSign = async (req, res) => {
    const newinfo = req.body;
    
    if (!newinfo.fname || !newinfo.lname || !newinfo.phNo || !newinfo.DOB || !newinfo.MLN || !newinfo.Specilzation || !newinfo.email || !newinfo.password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const checkIfEmailExists = await DoctorSign.findOne({ email: newinfo.email });
    if (checkIfEmailExists) {
        return res.status(400).json({ success: false, message: "Email already exists" });
    }
    try {
        // Create the new doctor record
        const doctor = await DoctorSign.create(newinfo);
        return res.status(201).json({ success: true, data: doctor });
    } catch (error) {
        console.error("Error creating doctor:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const checkDoctorSign = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    try {
        const doctor = await DoctorSign.findOne({ email: email });
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }
        if (doctor.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }
        return res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        console.error("Error checking doctor:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getByEmail = async (req, res) => {
    const info = req.body;
    if (!info.email) {
        return res.status(400).json({ success: false, message: "Enter the Email" });
    }

    try {
        const allDetails = await DoctorSign.findOne({ email: info.email }).select("-password");
        if (!allDetails) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        return res.status(200).json({ success: true, data: allDetails });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getAll = async (req, res) => {
    try {
        const alldet = await DoctorSign.find().select("-password");
        return res.status(200).json({ success: true, data: alldet });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

