import LabTest from "../models/LabTestModel.js";

// @desc Submit Lab Test Data
// @route POST /api/submit
export const submitLabTest = async (req, res) => {
  try {
    const { patientID, patientName, email, age, price, labName, phone } = req.body;
    const newTest = new LabTest({ 
      patientID, 
      patientName, 
      email, 
      age, 
      price, 
      labName, 
      phone,
      isComplete: false, // ✅ Default to false when a test is created
    });

    await newTest.save();
    res.status(201).json({ message: "Lab Test submitted successfully", data: newTest });
  } catch (error) {
    res.status(500).json({ message: "Error submitting lab test", error: error.message });
  }
};

// @desc Get All Lab Test Data
// @route GET /api/dashboard
export const getLabTests = async (req, res) => {
  try {
    const tests = await LabTest.find();
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lab tests", error: error.message });
  }
};

// @desc Update Lab Test Data
// @route PUT /api/update/:id
export const updateLabTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { isComplete } = req.body;  // ✅ Allow updating the isComplete field

    const updatedTest = await LabTest.findByIdAndUpdate(
      id, 
      { ...req.body, isComplete }, 
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: "Lab Test not found" });
    }

    res.status(200).json({ message: "Lab Test updated successfully", data: updatedTest });
  } catch (error) {
    res.status(500).json({ message: "Error updating lab test", error: error.message });
  }
};
