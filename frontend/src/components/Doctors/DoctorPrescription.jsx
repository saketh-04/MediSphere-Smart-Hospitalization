import React, { useState } from 'react';
import { Calendar, Plus, X, Save } from 'lucide-react';

const PrescriptionForm = ({ patientID }) => {
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '', route: '' }
  ]);
  
  const [labTests, setLabTests] = useState([
    { name: '', instructions: '', urgent: false }
  ]);
  
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // Common lab tests for quick selection
  const commonLabTests = [
    'Complete Blood Count (CBC)',
    'Comprehensive Metabolic Panel (CMP)',
    'Lipid Panel',
    'Thyroid Function Tests (TSH, T3, T4)',
    'Hemoglobin A1C',
    'Urinalysis',
    'Liver Function Tests (LFT)',
    'Blood Glucose',
    'Kidney Function Tests',
    'Electrolyte Panel'
  ];
  
  const addMedication = () => {
    setMedications([
      ...medications,
      { name: '', dosage: '', frequency: '', duration: '', instructions: '', route: '' }
    ]);
  };
  
  const removeMedication = (index) => {
    const updatedMeds = [...medications];
    updatedMeds.splice(index, 1);
    setMedications(updatedMeds);
  };
  
  const updateMedication = (index, field, value) => {
    const updatedMeds = [...medications];
    updatedMeds[index][field] = value;
    setMedications(updatedMeds);
  };
  
  const addLabTest = () => {
    setLabTests([
      ...labTests,
      { name: '', instructions: '', urgent: false }
    ]);
  };
  
  const removeLabTest = (index) => {
    const updatedTests = [...labTests];
    updatedTests.splice(index, 1);
    setLabTests(updatedTests);
  };
  
  const updateLabTest = (index, field, value) => {
    const updatedTests = [...labTests];
    updatedTests[index][field] = value;
    setLabTests(updatedTests);
  };
  
  const selectCommonTest = (index, testName) => {
    const updatedTests = [...labTests];
    updatedTests[index].name = testName;
    setLabTests(updatedTests);
  };
  
  // Get current date for the prescription header
  const currentDate = new Date().toLocaleDateString();

  // Save handler: Gather data and post to the backend
  const handleSave = async () => {
    // Retrieve doctor MLN from localStorage
    const MLN = localStorage.getItem("MLN");

    // patientID is now passed as a prop instead of being read from localStorage.
    if (!MLN || !patientID) {
      alert("Missing doctor or patient ID. Please make sure you are logged in or a patient is selected.");
      return;
    }
    
    // Transform medications & labTests to match the required schema
    const medicationsData = medications.map(med => ({
      medicationName: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      duration: med.duration,
      route: med.route,
      specialInstructions: med.instructions
    }));
    
    const labTestsData = labTests.map(test => ({
      testName: test.name,
      commonTests: [], // No common tests stored separately; leave as empty array
      specialInstructions: test.instructions,
      urgent: test.urgent
    }));
    
    const prescriptionData = {
      MLN,
      patientID,
      diagnosis,
      numberOfMedications: medications.length,
      medications: medicationsData,
      labTests: labTestsData,
      additionalInstructions: instructions
    };
    
    try {
      const response = await fetch("http://localhost:5000/api/prescriptions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescriptionData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert("Prescription saved successfully!");
        // Optionally, reset the form fields here
      } else {
        alert("Error saving prescription: " + data.message);
      }
    } catch (error) {
      console.error("Error saving prescription:", error);
      alert("Error saving prescription. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">MediSphere</h1>
            <p className="text-sm mt-1">123 Medical Center Drive • City, State 12345</p>
            <p className="text-sm">Phone: (555) 123-4567 • Fax: (555) 123-4568</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">Prescription</h2>
            <div className="flex items-center mt-1">
              <Calendar size={16} className="mr-1" />
              <span className="text-sm">{currentDate}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Prescription Form */}
      <div className="p-6">
        {/* Diagnosis */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Diagnosis</h3>
          <textarea
            className="w-full p-2 border rounded-md h-24"
            placeholder="Enter diagnosis details"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          ></textarea>
        </div>
        
        {/* Medications */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h3 className="text-lg font-semibold">Medications</h3>
            <button onClick={addMedication} className="flex items-center text-blue-600 hover:text-blue-800">
              <Plus size={16} className="mr-1" />
              Add Medication
            </button>
          </div>
          
          {medications.map((med, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md mb-3 relative">
              {medications.length > 1 && (
                <button onClick={() => removeMedication(index)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
                  <X size={16} />
                </button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={med.name}
                    onChange={(e) => updateMedication(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., 250mg"
                    value={med.dosage}
                    onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., Twice daily"
                    value={med.frequency}
                    onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., 7 days"
                    value={med.duration}
                    onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={med.route}
                    onChange={(e) => updateMedication(index, 'route', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="oral">Oral</option>
                    <option value="topical">Topical</option>
                    <option value="inhalation">Inhalation</option>
                    <option value="injection">Injection</option>
                    <option value="rectal">Rectal</option>
                    <option value="sublingual">Sublingual</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., Take with food"
                  value={med.instructions}
                  onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Laboratory Tests */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h3 className="text-lg font-semibold">Laboratory Tests</h3>
            <button onClick={addLabTest} className="flex items-center text-blue-600 hover:text-blue-800">
              <Plus size={16} className="mr-1" />
              Add Lab Test
            </button>
          </div>
          
          {labTests.map((test, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md mb-3 relative">
              {labTests.length > 1 && (
                <button onClick={() => removeLabTest(index)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
                  <X size={16} />
                </button>
              )}
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter lab test name"
                  value={test.name}
                  onChange={(e) => updateLabTest(index, 'name', e.target.value)}
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Common Tests</label>
                <div className="flex flex-wrap gap-2">
                  {commonLabTests.slice(0, 5).map((testName) => (
                    <button
                      key={testName}
                      onClick={() => selectCommonTest(index, testName)}
                      className={`text-xs px-2 py-1 rounded-full ${
                        test.name === testName 
                          ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {testName}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {commonLabTests.slice(5).map((testName) => (
                    <button
                      key={testName}
                      onClick={() => selectCommonTest(index, testName)}
                      className={`text-xs px-2 py-1 rounded-full ${
                        test.name === testName 
                          ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {testName}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., Fasting required, Specific time of day, etc."
                  value={test.instructions}
                  onChange={(e) => updateLabTest(index, 'instructions', e.target.value)}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`urgent-${index}`}
                  checked={test.urgent}
                  onChange={(e) => updateLabTest(index, 'urgent', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor={`urgent-${index}`} className="text-sm font-medium text-gray-700">
                  Mark as Urgent
                </label>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Instructions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Additional Instructions</h3>
          <textarea
            className="w-full p-2 border rounded-md h-24"
            placeholder="Enter any additional instructions or notes for the patient"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          ></textarea>
        </div>
      </div>
      
      {/* Footer with Save button */}
      <div className="bg-gray-100 p-4 flex justify-end">
        <button onClick={handleSave} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Save size={16} className="mr-2" />
          Save
        </button>
      </div>
    </div>
  );
};

export default PrescriptionForm;
