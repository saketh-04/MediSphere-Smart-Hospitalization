import mongoose from "mongoose";

const ehrSchema = new mongoose.Schema({
    medID: {
        type: String,
        required: true,
    },
    numberOfPastDiagnoses: {
        type: Number,
        required: true,
    },
    pastDiagnoses: {
        type: [String], // Correct array format
        required: true,
    },
    numberOfSurgicalHistory: {
        type: Number,
        required: true,
    },
    surgicalHistory: {
        type: [String], // Correct array format
        required: true,
    },
    numberOfVaccinations: {
        type: Number,
        required: true,
    },
    vaccinations: {
        type: [String], // Correct array format
        required: true,
    },
}, { timestamps: true });

const Ehr = mongoose.model("Patient", ehrSchema);

export default Ehr;
