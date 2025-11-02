import React, { useState, useEffect } from 'react';
import { Search, Edit, Save, X, Eye, FileText } from 'lucide-react';

const EHRDoc = () => {
  const [ehrRecords, setEhrRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [formData, setFormData] = useState({
    pastDiagnoses: [],
    surgicalHistory: [],
    vaccinations: []
  });
  const [prescriptionData, setPrescriptionData] = useState({});

  useEffect(() => {
    // Fetch EHR data
    fetchEhrRecords();
  }, []);

  const fetchEhrRecords = async () => {
    try {
      setLoading(true);
      // Using POST to fetch all EHR records
      const response = await fetch('http://localhost:5000/ehr/getallEHR', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Empty body for GET-like POST request
      });
      
      const result = await response.json();
      
      if (result.success) {
        setEhrRecords(result.data);
      } else {
        console.error('Failed to fetch EHR data');
      }
    } catch (error) {
      console.error('Error fetching EHR data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setViewingRecord(null);
    setEditingRecord(record._id);
    setFormData({
      pastDiagnoses: [...record.pastDiagnoses],
      surgicalHistory: [...record.surgicalHistory],
      vaccinations: [...record.vaccinations]
    });
  };

  const handleView = (recordId) => {
    setEditingRecord(null);
    setViewingRecord(recordId === viewingRecord ? null : recordId);
  };

  const handleCancel = () => {
    setEditingRecord(null);
    setFormData({
      pastDiagnoses: [],
      surgicalHistory: [],
      vaccinations: []
    });
  };

  const handleChange = (e, field, index) => {
    const newValue = e.target.value;
    setFormData(prev => {
      const newFieldData = [...prev[field]];
      newFieldData[index] = newValue;
      return { ...prev, [field]: newFieldData };
    });
  };

  const handleAdd = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const handleRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (recordId) => {
    try {
      // Find the record being edited
      const record = ehrRecords.find(r => r._id === recordId);
      
      if (!record) return;

      const updatedData = {
        medID: record.medID,
        numberOfPastDiagnoses: formData.pastDiagnoses.filter(item => item.trim() !== "").length,
        pastDiagnoses: formData.pastDiagnoses.filter(item => item.trim() !== ""),
        numberOfSurgicalHistory: formData.surgicalHistory.filter(item => item.trim() !== "").length,
        surgicalHistory: formData.surgicalHistory.filter(item => item.trim() !== ""),
        numberOfVaccinations: formData.vaccinations.filter(item => item.trim() !== "").length,
        vaccinations: formData.vaccinations.filter(item => item.trim() !== "")
      };
      
      // Send POST request to update the record
      const response = await fetch('http://localhost:5000/ehr/updateEHR', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: recordId,
          ...updatedData
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update the local state with the updated record
        setEhrRecords(prevRecords => 
          prevRecords.map(rec => 
            rec._id === recordId ? { ...rec, ...updatedData, updatedAt: new Date().toISOString() } : rec
          )
        );
        setEditingRecord(null);
      } else {
        console.error('Failed to update EHR record');
      }
    } catch (error) {
      console.error('Error updating EHR record:', error);
    }
  };

  const handleGetPrescription = async (record) => {
    // Toggle functionality: if prescription details already exist, remove them.
    if (prescriptionData[record._id]) {
      setPrescriptionData(prev => {
        const newData = { ...prev };
        delete newData[record._id];
        return newData;
      });
      return;
    }
    
    try {
      // Using record.medID as patientID to get the prescription
      const response = await fetch('http://localhost:5000/prescription/getpresBymedID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientID: record.medID }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Save prescription details in state using record._id as key
        setPrescriptionData(prev => ({ ...prev, [record._id]: result.data }));
      } else {
        console.error('Failed to fetch prescription');
      }
    } catch (error) {
      console.error('Error fetching prescription:', error);
    }
  };

  // Filter out any records that start with "MLN"
  // Then apply the existing search filter.
  const filteredRecords = ehrRecords
    .filter(record => !record.medID.toLowerCase().startsWith("mln"))
    .filter(record => 
      record.medID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.pastDiagnoses.some(diagnosis => 
        diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Electronic Health Records</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search records by ID or diagnosis..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading EHR records...</div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <div key={record._id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <Eye size={24} />
                      </div>
                      <div>
                        <p className="font-medium">Medical ID: {record.medID}</p>
                        <p className="text-sm text-gray-600">
                          Last updated: {new Date(record.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {editingRecord === record._id ? (
                        <>
                          <button 
                            className="btn-secondary flex items-center space-x-2"
                            onClick={handleCancel}
                          >
                            <X size={20} />
                            <span>Cancel</span>
                          </button>
                          <button 
                            className="btn-primary flex items-center space-x-2"
                            onClick={() => handleSubmit(record._id)}
                          >
                            <Save size={20} />
                            <span>Save</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="btn-secondary flex items-center space-x-2"
                            onClick={() => handleView(record._id)}
                          >
                            <Eye size={20} />
                            <span>View</span>
                          </button>
                          <button 
                            className="btn-secondary flex items-center space-x-2"
                            onClick={() => handleGetPrescription(record)}
                          >
                            <FileText size={20} />
                            <span>Prescription</span>
                          </button>
                          <button 
                            className="btn-primary flex items-center space-x-2"
                            onClick={() => handleEdit(record)}
                          >
                            <Edit size={20} />
                            <span>Edit</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {editingRecord === record._id ? (
                    <div className="mt-4 space-y-4">
                      {/* Past Diagnoses */}
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Past Diagnoses</h3>
                          <button 
                            className="text-blue-600 text-sm"
                            onClick={() => handleAdd('pastDiagnoses')}
                          >
                            + Add Diagnosis
                          </button>
                        </div>
                        <div className="space-y-2 mt-2">
                          {formData.pastDiagnoses.map((diagnosis, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                className="flex-1 p-2 border rounded-md"
                                value={diagnosis}
                                onChange={(e) => handleChange(e, 'pastDiagnoses', index)}
                              />
                              <button 
                                className="text-red-500"
                                onClick={() => handleRemove('pastDiagnoses', index)}
                              >
                                <X size={20} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Surgical History */}
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Surgical History</h3>
                          <button 
                            className="text-blue-600 text-sm"
                            onClick={() => handleAdd('surgicalHistory')}
                          >
                            + Add Surgery
                          </button>
                        </div>
                        <div className="space-y-2 mt-2">
                          {formData.surgicalHistory.map((surgery, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                className="flex-1 p-2 border rounded-md"
                                value={surgery}
                                onChange={(e) => handleChange(e, 'surgicalHistory', index)}
                              />
                              <button 
                                className="text-red-500"
                                onClick={() => handleRemove('surgicalHistory', index)}
                              >
                                <X size={20} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Vaccinations */}
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Vaccinations</h3>
                          <button 
                            className="text-blue-600 text-sm"
                            onClick={() => handleAdd('vaccinations')}
                          >
                            + Add Vaccination
                          </button>
                        </div>
                        <div className="space-y-2 mt-2">
                          {formData.vaccinations.map((vaccination, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                className="flex-1 p-2 border rounded-md"
                                value={vaccination}
                                onChange={(e) => handleChange(e, 'vaccinations', index)}
                              />
                              <button 
                                className="text-red-500"
                                onClick={() => handleRemove('vaccinations', index)}
                              >
                                <X size={20} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`mt-4 space-y-3 ${viewingRecord === record._id ? 'block' : 'hidden'}`}>
                      <div>
                        <p className="text-sm font-medium">Past Diagnoses ({record.numberOfPastDiagnoses}):</p>
                        <p className="text-sm text-gray-600">{record.pastDiagnoses.join(", ")}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Surgical History ({record.numberOfSurgicalHistory}):</p>
                        <p className="text-sm text-gray-600">{record.surgicalHistory.join(", ")}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Vaccinations ({record.numberOfVaccinations}):</p>
                        <p className="text-sm text-gray-600">{record.vaccinations.join(", ")}</p>
                      </div>
                    </div>
                  )}

                  {/* Display Prescription Details if available */}
                  {prescriptionData[record._id] && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium text-green-800">Prescription Details</h3>
                      <p className="text-sm text-green-700">MLN: {prescriptionData[record._id].MLN}</p>
                      <p className="text-sm text-green-700">Diagnosis: {prescriptionData[record._id].diagnosis}</p>
                      <p className="text-sm text-green-700">
                        Medications ({prescriptionData[record._id].numberOfMedications}):
                      </p>
                      <ul className="list-disc ml-5">
                        {prescriptionData[record._id].medications.map((med, idx) => (
                          <li key={idx} className="text-sm text-green-700">
                            {med.medicationName} - {med.dosage} - {med.frequency} - {med.duration} - {med.route}
                          </li>
                        ))}
                      </ul>
                      {prescriptionData[record._id].labTests && prescriptionData[record._id].labTests.length > 0 && (
                        <>
                          <p className="text-sm text-green-700">Lab Tests:</p>
                          <ul className="list-disc ml-5">
                            {prescriptionData[record._id].labTests.map((test, idx) => (
                              <li key={idx} className="text-sm text-green-700">
                                {test.testName} {test.urgent ? '(Urgent)' : ''}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      {prescriptionData[record._id].additionalInstructions && (
                        <p className="text-sm text-green-700">
                          Additional Instructions: {prescriptionData[record._id].additionalInstructions}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No records found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EHRDoc;
