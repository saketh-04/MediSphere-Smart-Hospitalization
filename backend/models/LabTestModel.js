import { Schema, model } from "mongoose";

const labTestSchema = new Schema({
  patientID: {
    type: String,
    required: true,
  },
  patientName: {  
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  labName: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  isComplete: {
    type: Boolean,  // ✅ Changed to Boolean (True/False)
    required: true,
    default: false,  // ✅ Default to false when creating a new lab test
  },
});

const LabTest = model("LabTest", labTestSchema);

export default LabTest;
