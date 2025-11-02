import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, FileText, X, Save, Mail, FileSpreadsheet } from 'lucide-react';
import emailjs from '@emailjs/browser';

const AppointmentsWithPrescription = () => {
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCompleted, setLoadingCompleted] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showEHRModal, setShowEHRModal] = useState(false);
  const [addressDetails, setAddressDetails] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [ehrData, setEHRData] = useState(null);
  const [loadingEHR, setLoadingEHR] = useState(false);

  // Form states for prescription
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

  useEffect(() => {
    // Retrieve the doctor ID from local storage
    const doctorID = localStorage.getItem("MLN") || "MLN123456"; // fallback value

    // Fetch regular appointments
    setLoading(true);
    fetch("http://localhost:5000/appointment/getappdoctor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ doctorID })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setAppointments(data.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      });

    // Fetch completed appointments
    setLoadingCompleted(true);
    fetch("http://localhost:5000/appointment/getappdoc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ doctorID })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Filter only completed appointments
          const completed = data.data.filter(app => app.isComplete === "True");
          setCompletedAppointments(completed);
        }
        setLoadingCompleted(false);
      })
      .catch(error => {
        console.error("Error fetching completed appointments:", error);
        setLoadingCompleted(false);
      });
  }, []);

  // Helper function to format dates nicely
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get today's date for the header
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  // Prescription form handlers
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

  // Handle starting an appointment
  const handleStartAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    
    // Check if email has already been sent
    if (appointment.isSendEmail === "True") {
      // Email already sent, proceed to prescription form
      setShowPrescriptionForm(true);
      // Reset form fields for a new prescription
      setMedications([{ name: '', dosage: '', frequency: '', duration: '', instructions: '', route: '' }]);
      setLabTests([{ name: '', instructions: '', urgent: false }]);
      setDiagnosis('');
      setInstructions('');
    } else {
      // Email not sent yet, show email form
      setShowEmailForm(true);
      setAddressDetails('');
    }
  };

  // View EHR functionality
  const handleViewEHR = async (appointment) => {
    setSelectedAppointment(appointment);
    setLoadingEHR(true);
    setShowEHRModal(true);

    try {
        const medID = appointment.patientID || "MED20253"; // Fallback to example ID if not available

        const response = await fetch("http://localhost:5000/ehr/getehr", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ medID })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.ehr) {
            setEHRData(data.ehr);
        } else {
            alert("Error fetching EHR data: " + (data.message || "Unknown error"));
            setEHRData(null);
        }
    } catch (error) {
        console.error("Error fetching EHR:", error);
        alert("Failed to fetch EHR data. Please try again.");
        setEHRData(null);
    } finally {
        setLoadingEHR(false);
    }
};

  // Close EHR modal
  const handleCloseEHR = () => {
    setShowEHRModal(false);
    setSelectedAppointment(null);
    setEHRData(null);
  };

  // Close email form
  const handleCloseEmail = () => {
    setShowEmailForm(false);
    setSelectedAppointment(null);
  };

  // Send address via email
  const handleSendEmail = async () => {
    // Check for required data
    if (!selectedAppointment || !addressDetails) {
      alert("Please fill in the address details");
      return;
    }
    if (!selectedAppointment.email) {
      alert("No email address found for this patient");
      return;
    }
    if (!selectedAppointment.appointmentID) {
      alert("Appointment ID is missing. Cannot update appointment.");
      return;
    }
  
    setSendingEmail(true);
  
    try {
      // Email sending logic (e.g., using EmailJS)
      const templateParams = {
        to_email: selectedAppointment.email,
        to_name: selectedAppointment.patientName,
        from_name: 'Dr. ' + (localStorage.getItem("doctorName") || 'MediSphere Doctor'),
        address: addressDetails,
        appointment_date: formatDate(selectedAppointment.date),
        appointment_time: selectedAppointment.time,
      };
  
      const emailResponse = await emailjs.send(
        'service_7i3k6vf', // Replace with your EmailJS service ID
        'template_pmfnv0a', // Replace with your EmailJS template ID
        templateParams,
        'zvtAPjz7EodUuK-rK' // Replace with your EmailJS public key
      );
  
      if (emailResponse.status === 200) {
        // Email sent successfully, now update the appointment
        const updatedAppointment = { ...selectedAppointment, isemailSend: "True" };
  
        const updateResponse = await fetch("http://localhost:5000/appointment/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointmentID: selectedAppointment.appointmentID, // Ensure this is included
            doctorID: selectedAppointment.doctorID,
            patientID: selectedAppointment.patientID,
            isemailSend: "True",
            isComplete: selectedAppointment.isComplete || "False",
            email: selectedAppointment.email,
            date: selectedAppointment.date,
            time: selectedAppointment.time,
            patientName: selectedAppointment.patientName,
            phoneNO: selectedAppointment.phoneNO,
            reasonVisit: selectedAppointment.reasonVisit
          })
        });
  
        const updateData = await updateResponse.json();
  
        if (updateData.success) {
          // Update local state with the new appointment data
          setAppointments(prevAppointments =>
            prevAppointments.map(app =>
              app._id === selectedAppointment._id ? updatedAppointment : app
            )
          );
          alert("Address has been sent successfully!");
          setShowEmailForm(false);
          setShowPrescriptionForm(true);
          // Reset prescription form fields if needed
        } else {
          alert("Error updating appointment: " + updateData.message);
        }
      } else {
        alert("Error sending email. Please try again.");
      }
    } catch (error) {
      console.error("Error in email process:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  // Close prescription form and go back to appointments
  // ... other code ...

const handleClosePrescription = () => {
  setShowPrescriptionForm(false);
  setSelectedAppointment(null);
};

const handleSavePrescription = async () => {
  if (!selectedAppointment) {
    alert("No patient selected. Please select an appointment first.");
    return;
  }

  // Retrieve doctor MLN from localStorage
  const MLN = localStorage.getItem("MLN") || "MLN123456"; 
  const patientID = selectedAppointment.patientID || "PATIENT_ID"; 

  // Transform medications & labTests to match required schema
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
    commonTests: [],
    specialInstructions: test.instructions,
    urgent: test.urgent
  }));

  // Construct prescription data
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
    // 1) Save prescription
    const response = await fetch("http://localhost:5000/prescription/addPrescription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prescriptionData)
    });
    const data = await response.json();

    if (!response.ok) {
      alert("Error saving prescription: " + data.message);
      return;
    }

    // 2) Mark appointment as complete
    const updatedAppointment = { ...selectedAppointment, isComplete: "True" };

    // 3) Update the appointment in the database (PUT request)
    const updateResponse = await fetch("http://localhost:5000/appointment/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorID: selectedAppointment.doctorID,
        patientID: selectedAppointment.patientID,
        isComplete: "True",
        // isemailSend: "True", // Optional if you want to also mark isemailSend
      })
    });
    const updateData = await updateResponse.json();
    if (!updateResponse.ok) {
      alert("Error updating appointment: " + updateData.message);
      return;
    }

    // 4) Update local state
    setAppointments(prevAppointments =>
      prevAppointments.filter(app => app.patientID !== selectedAppointment.patientID)
    );
    setCompletedAppointments(prev => [...prev, updatedAppointment]);

    alert("Prescription saved successfully!");
    handleClosePrescription();
  } catch (error) {
    console.error("Error saving prescription:", error);
    alert("Error saving prescription. Please try again.");
  }
};

  return (
    <div className="flex justify-center w-full bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl px-6 py-8">
        {/* Header with date and welcome message - Always visible */}
        <div className="mb-8">
          <h2 className="text-gray-500">{today}</h2>
          <h1 className="text-3xl font-bold text-gray-800">Welcome, Doctor</h1>
        </div>

        {/* Conditional rendering based on form state */}
        {showEHRModal ? (
          // EHR Modal View
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="flex justify-between items-center bg-blue-600 text-white p-6">
              <div>
                <button 
                  onClick={handleCloseEHR}
                  className="flex items-center text-white bg-blue-700 px-3 py-1 rounded-lg hover:bg-blue-800 transition-colors mb-2"
                >
                  <X size={16} className="mr-1" /> Back to Appointments
                </button>
                <h1 className="text-2xl font-bold">Patient EHR</h1>
              </div>
              <div className="text-right">
                {selectedAppointment && (
                  <div className="bg-blue-700 p-2 rounded-lg">
                    <p>Patient: {selectedAppointment.patientName}</p>
                    <p>ID: {selectedAppointment.patientID}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
  {loadingEHR ? (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg font-semibold animate-pulse">Loading patient records...</p>
    </div>
  ) : ehrData ? (
    <div className="space-y-6 bg-gray-100 p-6 rounded-lg shadow-md">
      
      {/* Patient Information */}
      <div className="border-b pb-4 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-blue-700 mb-3">Patient Information</h2>
        <p className="text-lg"><span className="font-medium text-gray-800">Medical ID:</span> {ehrData.medID}</p>
      </div>

      {/* Medical History */}
      <div className="border-b pb-4 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-blue-700 mb-3">Medical History</h2>

        <div className="mb-4">
          <h3 className="font-medium text-gray-700 text-lg">Past Diagnoses:</h3>
          <p className="text-gray-600 bg-gray-200 p-2 rounded-lg">{ehrData.pastDiagnoses?.length ? ehrData.pastDiagnoses.join(', ') : 'None recorded'}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-700 text-lg">Surgical History:</h3>
          <p className="text-gray-600 bg-gray-200 p-2 rounded-lg">{ehrData.surgicalHistory?.length ? ehrData.surgicalHistory.join(', ') : 'None recorded'}</p>
        </div>

        <div>
          <h3 className="font-medium text-gray-700 text-lg">Vaccinations:</h3>
          <p className="text-gray-600 bg-gray-200 p-2 rounded-lg">{ehrData.vaccinations?.length ? ehrData.vaccinations.join(', ') : 'None recorded'}</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center py-12">
      <p className="text-red-500 text-lg font-semibold">No EHR data available for this patient</p>
    </div>
  )}
</div>
</div>
        ) : showEmailForm ? (
          // Email Form View
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="flex justify-between items-center bg-blue-600 text-white p-6">
              <div>
                <button 
                  onClick={handleCloseEmail}
                  className="flex items-center text-white bg-blue-700 px-3 py-1 rounded-lg hover:bg-blue-800 transition-colors mb-2"
                >
                  <X size={16} className="mr-1" /> Back to Appointments
                </button>
                <h1 className="text-2xl font-bold">Send Address Details</h1>
              </div>
              <div className="text-right">
                {selectedAppointment && (
                  <div className="bg-blue-700 p-2 rounded-lg">
                    <p>Patient: {selectedAppointment.patientName}</p>
                    <p>Email: {selectedAppointment.email || 'N/A'}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Enter Address Details for Virtual Appointment
                </label>
                <textarea
                  className="w-full border rounded-lg p-3 h-32"
                  placeholder="Enter the meeting link or address details here..."
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                >
                  {sendingEmail ? 'Sending...' : (
                    <>
                      <Mail size={18} className="mr-2" /> Send to Patient
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : showPrescriptionForm ? (
          // Prescription Form View
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="flex justify-between items-center bg-blue-600 text-white p-6">
              <div>
                <button 
                  onClick={handleClosePrescription}
                  className="flex items-center text-white bg-blue-700 px-3 py-1 rounded-lg hover:bg-blue-800 transition-colors mb-2"
                >
                  <X size={16} className="mr-1" /> Back to Appointments
                </button>
                <h1 className="text-2xl font-bold">Create Prescription</h1>
              </div>
              <div className="text-right">
                {selectedAppointment && (
                  <div className="bg-blue-700 p-2 rounded-lg">
                    <p>Patient: {selectedAppointment.patientName}</p>
                    <p>ID: {selectedAppointment.patientID}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Diagnosis */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Diagnosis
                </label>
                <textarea
                  className="w-full border rounded-lg p-3"
                  placeholder="Enter diagnosis details..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>
              
              {/* Medications Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Medications</h2>
                  <button 
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    onClick={addMedication}
                  >
                    + Add Medication
                  </button>
                </div>
                
                {medications.map((med, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4">
                    <div className="flex justify-between mb-3">
                      <h3 className="font-medium">Medication #{index + 1}</h3>
                      {medications.length > 1 && (
                        <button 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeMedication(index)}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-gray-700 text-sm mb-1">Medication Name</label>
                        <input
                          type="text"
                          className="w-full border rounded p-2"
                          value={med.name}
                          onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm mb-1">Dosage</label>
                        <input
                          type="text"
                          className="w-full border rounded p-2"
                          value={med.dosage}
                          onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                          placeholder="e.g. 500mg"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <label className="block text-gray-700 text-sm mb-1">Frequency</label>
                        <input
                          type="text"
                          className="w-full border rounded p-2"
                          value={med.frequency}
                          onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          placeholder="e.g. twice daily"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm mb-1">Duration</label>
                        <input
                          type="text"
                          className="w-full border rounded p-2"
                          value={med.duration}
                          onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                          placeholder="e.g. 7 days"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm mb-1">Route</label>
                        <select
                          className="w-full border rounded p-2"
                          value={med.route}
                          onChange={(e) => updateMedication(index, 'route', e.target.value)}
                        >
                          <option value="">Select Route</option>
                          <option value="Oral">Oral</option>
                          <option value="Topical">Topical</option>
                          <option value="Intravenous">Intravenous</option>
                          <option value="Intramuscular">Intramuscular</option>
                          <option value="Subcutaneous">Subcutaneous</option>
                          <option value="Inhalation">Inhalation</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Special Instructions</label>
                      <textarea
                        className="w-full border rounded p-2"
                        value={med.instructions}
                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                        placeholder="e.g. Take with food"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Lab Tests Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Lab Tests</h2>
                  <button 
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    onClick={addLabTest}
                  >
                    + Add Lab Test
                  </button>
                </div>
                
                {labTests.map((test, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4">
                    <div className="flex justify-between mb-3">
                      <h3 className="font-medium">Lab Test #{index + 1}</h3>
                      {labTests.length > 1 && (
                        <button 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeLabTest(index)}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-gray-700 text-sm mb-1">Test Name</label>
                      <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={test.name}
                        onChange={(e) => updateLabTest(index, 'name', e.target.value)}
                      />
                    </div>
                    
                    {/* Common tests quick selection */}
                    <div className="mb-3">
                      <label className="block text-gray-700 text-sm mb-1">Quick Select</label>
                      <div className="flex flex-wrap gap-2">
                        {commonLabTests.slice(0, 5).map((testName) => (
                          <button
                            key={testName}
                            className="bg-gray-100 px-2 py-1 rounded text-sm hover:bg-gray-200"
                            onClick={() => selectCommonTest(index, testName)}
                          >
                            {testName}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-gray-700 text-sm mb-1">Instructions</label>
                      <textarea
                        className="w-full border rounded p-2"
                        value={test.instructions}
                        onChange={(e) => updateLabTest(index, 'instructions', e.target.value)}
                        placeholder="Special instructions for this test..."
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
                      <label htmlFor={`urgent-${index}`} className="text-gray-700 text-sm">
                        Mark as Urgent
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Additional Instructions */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Additional Instructions
                </label>
                <textarea
                  className="w-full border rounded-lg p-3"
                  placeholder="Enter any additional instructions or notes..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>
              
              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handleSavePrescription}
                >
                  <Save size={18} className="mr-2" /> Save Prescription
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Main Dashboard View
          <div className="space-y-8">
            {/* Upcoming Appointments Section */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <Calendar size={24} className="mr-2" /> Today's Appointments
                </h2>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading appointments...</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No upcoming appointments for today</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((app) => (
                      <div key={app._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between flex-wrap">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                              <User size={24} className="text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{app.patientName}</h3>
                              <p className="text-gray-600">
                                <span className="flex items-center">
                                  <Calendar size={14} className="mr-1" /> {formatDate(app.date)}
                                </span>
                              </p>
                              <p className="text-gray-600">
                                <span className="flex items-center">
                                  <Clock size={14} className="mr-1" /> {app.time}
                                </span>
                              </p>
                              <p className="text-gray-600 mt-2">
                                <span className="font-medium">Reason:</span> {app.reasonVisit || 'Not specified'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                            <button
                              onClick={() => handleStartAppointment(app)}
                              className="flex items-center bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                              {app.isSendEmail === "True" ? 'Continue Appointment' : 'Start Appointment'}
                            </button>
                            <button
                              onClick={() => handleViewEHR(app)}
                              className="flex items-center bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300 transition-colors"
                            >
                              <FileText size={16} className="mr-2" /> View EHR
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Completed Appointments Section */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-green-600 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <FileSpreadsheet size={24} className="mr-2" /> Completed Appointments
                </h2>
              </div>
              
              <div className="p-6">
                {loadingCompleted ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading completed appointments...</p>
                  </div>
                ) : completedAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No completed appointments found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedAppointments.map((app) => (
                      <div key={app._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between flex-wrap">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-green-100 rounded-full">
                              <User size={24} className="text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{app.patientName}</h3>
                              <p className="text-gray-600">
                                <span className="flex items-center">
                                  <Calendar size={14} className="mr-1" /> {formatDate(app.date)}
                                </span>
                              </p>
                              <p className="text-gray-600">
                                <span className="flex items-center">
                                  <Clock size={14} className="mr-1" /> {app.time}
                                </span>
                              </p>
                              <p className="text-gray-600 mt-2">
                                <span className="font-medium">Reason:</span> {app.reasonVisit || 'Not specified'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                            <button
                              onClick={() => handleViewEHR(app)}
                              className="flex items-center bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300 transition-colors"
                            >
                              <FileText size={16} className="mr-2" /> View EHR
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsWithPrescription;