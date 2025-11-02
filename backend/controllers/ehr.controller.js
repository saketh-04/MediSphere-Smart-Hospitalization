import Ehr from "../models/ehr.model.js";


export const createEhr = async (req, res) => {
    try {
        const ehr = req.body;

        // Validate required fields
        if (
            !ehr.medID ||
            ehr.numberOfPastDiagnoses === undefined ||
            !Array.isArray(ehr.pastDiagnoses) ||
            ehr.numberOfPastDiagnoses !== ehr.pastDiagnoses.length ||
            ehr.numberOfSurgicalHistory === undefined ||
            !Array.isArray(ehr.surgicalHistory) ||
            ehr.numberOfSurgicalHistory !== ehr.surgicalHistory.length ||
            ehr.numberOfVaccinations === undefined ||
            !Array.isArray(ehr.vaccinations) ||
            ehr.numberOfVaccinations !== ehr.vaccinations.length
        ) {
            return res.status(400).json({ error: "Invalid input. Ensure array lengths match their respective count fields." });
        }

        // Create a new document
        const newEhr = new Ehr(ehr);
        await newEhr.save();

        res.status(201).json({ message: "EHR created successfully", ehr: newEhr });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

export const getEhrByMedID = async (req, res) => {
    try {
        const { medID } = req.body;

        // Validate medID
        if (!medID) {
            return res.status(400).json({ success: false, message: "Please enter medID" });
        }

        // Fetch EHR data
        const data = await Ehr.findOne({ medID });

        // If no record found
        if (!data) {
            return res.status(404).json({ success: false, message: "EHR not found for the given medID" });
        }

        // Return EHR data
        res.status(200).json({ success: true, ehr: data });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", details: error.message });
    }
};


export const updateEhrByMedID = async (req, res) => {
    try {
        const info = req.body;

        if (!info.medID) {
            return res.status(400).json({ success: false, message: "Please enter the medID" });
        }

        // Check if EHR record exists
        const checkIfExists = await Ehr.findOne({ medID: info.medID });
        if (!checkIfExists) {
            return res.status(404).json({ success: false, message: "EHR not found for the given medID" });
        }

        // Update the EHR record
        const updatedEhr = await Ehr.findOneAndUpdate(
            { medID: info.medID },
            info,
            { new: true, runValidators: true }
        );

        return res.status(200).json({ success: true, message: "EHR updated successfully", ehr: updatedEhr });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const getAllEHR = async (req, res) => {
    try {
        const allinfo = await Ehr.find();
        return res.status(200).json({ success: true, data: allinfo });
    } catch (error) {
        console.error("Error fetching EHR data:", error); // Logs the actual error
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
