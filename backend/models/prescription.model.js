import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
    MLN: {
      type: String,
      required: true,
    },
    patientID: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    numberOfMedications: {
      type: Number,
      required: true,
    },
    // Medications Array
    medications: [
      {
        medicationName: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
        frequency: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        route: {
          type: String,
          required: true,
        },
        specialInstructions: {
          type: String,
          default: '',
        },
      },
    ],
    // Laboratory Tests Array
    labTests: [
      {
        testName: {
          type: String,
          required: true,
        },
        // If you want to allow multiple "common tests" selected, store them as an array of strings.
        commonTests: [
          {
            type: String,
          },
        ],
        specialInstructions: {
          type: String,
          default: '',
        },
        urgent: {
          type: Boolean,
          default: false,
        },
      },
    ],
    // Additional Instructions
    additionalInstructions: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Prescription', prescriptionSchema);
