import OwnerLab from "../models/ownerLabTest.model.js";

export const createNewTest = async (req, res) => {
  const info = req.body;
  
  // Check required fields
  if (!info.labName || !info.TestName || !info.TestTime) {
    return res.status(400).json({ success: false, message: "Please enter all details" });
  }

  try {
    // Check if lab already exists
    const checkLabExists = await OwnerLab.findOne({ labName: info.labName });
    if (checkLabExists) {
      return res.status(400).json({ success: false, message: "Lab already exists" });
    }

    // Create new lab record
    await OwnerLab.create(info);
    return res.status(200).json({ success: true, message: "New Lab created Successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteTest = async (req, res) => {
  const info = req.body;

  // Check required field
  if (!info.labName) {
    return res.status(400).json({ success: false, message: "Please enter the Lab Name" });
  }

  try {
    // Use a filter object with deleteOne
    await OwnerLab.deleteOne({ labName: info.labName });
    return res.status(200).json({ success: true, message: "Deleted Successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAll = async (req, res, next) => {
    try {
        const allInfo = await OwnerLab.find();

        if (!allInfo || allInfo.length === 0) {
            return res.status(404).json({ success: false, message: "No data found" });
        }

        return res.status(200).json({ success: true, data: allInfo });
    } catch (error) {
        next(error); // If using Express error-handling middleware
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
