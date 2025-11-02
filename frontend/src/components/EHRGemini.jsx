import { useState, useRef, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Calendar from 'react-calendar';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  UserCircleIcon,
  DocumentTextIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import NotificationBox from './Notifications'; // Assuming NotificationBox is in a separate file

// Initialize Gemini API with your API key
const genAI = new GoogleGenerativeAI('AIzaSyCOwa9U5_I5H8ZMT9pgH3TxfgC7-c5DxyA');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

const healthData = [
  { name: 'Jan', glucose: 95, bp: 120 },
  { name: 'Feb', glucose: 100, bp: 125 },
  { name: 'Mar', glucose: 92, bp: 118 },
  { name: 'Apr', glucose: 98, bp: 122 },
];

// Sample Blood Test Report (CBC) HTML as a string
const sampleBloodTestReport = `
<!DOCTYPE html>
<html>
<head>
  <title>Complete Blood Count (CBC) Report</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .patient-info { margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f5f5f5; }
    .footer { margin-top: 40px; text-align: right; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Complete Blood Count (CBC) Report</h1>
    <p>HealthFirst Labs</p>
  </div>
  
  <div class="patient-info">
    <h3>Patient Information</h3>
    <p><strong>Name:</strong> Jane Smith</p>
    <p><strong>Age:</strong> 42</p>
    <p><strong>Date:</strong> April 10, 2024</p>
    <p><strong>Sample ID:</strong> CBC-2024-001</p>
  </div>

  <table>
    <tr>
      <th>Test</th>
      <th>Result</th>
      <th>Reference Range</th>
      <th>Units</th>
    </tr>
    <tr>
      <td>Hemoglobin</td>
      <td>13.5</td>
      <td>12.0 - 16.0</td>
      <td>g/dL</td>
    </tr>
    <tr>
      <td>Red Blood Cells (RBC)</td>
      <td>4.5</td>
      <td>4.0 - 5.5</td>
      <td>million/µL</td>
    </tr>
    <tr>
      <td>White Blood Cells (WBC)</td>
      <td>7.0</td>
      <td>4.0 - 11.0</td>
      <td>thousand/µL</td>
    </tr>
    <tr>
      <td>Platelets</td>
      <td>250</td>
      <td>150 - 450</td>
      <td>thousand/µL</td>
    </tr>
  </table>

  <div class="footer">
    <p>Dr. Michael Brown</p>
    <p>Laboratory Director</p>
    <p>License: LAB-2024-456</p>
  </div>
</body>
</html>
`;

const EHRUsr = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [date, setDate] = useState(null); // Changed to null for deselection
  const [ehrData, setEhrData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editPastDiagnoses, setEditPastDiagnoses] = useState("");
  const [editSurgicalHistory, setEditSurgicalHistory] = useState("");
  const [editVaccinations, setEditVaccinations] = useState("");
  const [medID, setMedID] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const email = localStorage.getItem('userEmail');
  const calendarRef = useRef(null);

  // AI Assistant States
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi! I'm your AI Health Assistant powered by Gemini. I can help you analyze medical reports, set reminders, and more. How can I assist you today?",
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reminders, setReminders] = useState([]); // State for reminders
  const fileInputRef = useRef(null);

  // Handle click outside to deselect date
  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setDate(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // MedID Handling
  useEffect(() => {
    const storedMedID = localStorage.getItem('medID');
    if (storedMedID) setMedID(storedMedID);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const storedMedID = localStorage.getItem('medID');
      if (storedMedID !== medID) setMedID(storedMedID);
    }, 3000);
    return () => clearInterval(interval);
  }, [medID]);

  // EHR Functions
  const createEHR = async (medID) => {
    const payload = {
      medID,
      numberOfPastDiagnoses: 0,
      pastDiagnoses: [],
      numberOfSurgicalHistory: 0,
      surgicalHistory: [],
      numberOfVaccinations: 0,
      vaccinations: [],
    };
    const response = await fetch('http://localhost:5000/ehr/createehr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    return result.ehr;
  };

  const updateEHR = async () => {
    const newPastDiagnoses = editPastDiagnoses.split(',').map(s => s.trim()).filter(Boolean);
    const newSurgicalHistory = editSurgicalHistory.split(',').map(s => s.trim()).filter(Boolean);
    const newVaccinations = editVaccinations.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      medID,
      numberOfPastDiagnoses: newPastDiagnoses.length,
      pastDiagnoses: newPastDiagnoses,
      numberOfSurgicalHistory: newSurgicalHistory.length,
      surgicalHistory: newSurgicalHistory,
      numberOfVaccinations: newVaccinations.length,
      vaccinations: newVaccinations,
    };

    try {
      const response = await fetch('http://localhost:5000/ehr/updateehr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        setEhrData(result.ehr);
        setIsEditing(false);
        alert("EHR updated successfully");
      } else {
        alert("Failed to update EHR");
      }
    } catch (error) {
      console.error("Error updating EHR:", error);
      alert("Error updating EHR");
    }
  };

  const cancelEdit = () => {
    if (ehrData) {
      setEditPastDiagnoses(ehrData.pastDiagnoses.join(', '));
      setEditSurgicalHistory(ehrData.surgicalHistory.join(', '));
      setEditVaccinations(ehrData.vaccinations.join(', '));
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (!medID) return;
    const fetchEHR = async () => {
      try {
        const res = await fetch('http://localhost:5000/ehr/getehr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ medID }),
        });
        const result = await res.json();
        if (result.success) {
          setEhrData(result.ehr);
        } else {
          const createdEhr = await createEHR(medID);
          setEhrData(createdEhr);
        }
      } catch (error) {
        console.error("Error fetching or creating EHR:", error);
      }
    };
    fetchEHR();
  }, [medID]);

  useEffect(() => {
    if (ehrData) {
      setEditPastDiagnoses(ehrData.pastDiagnoses.join(', '));
      setEditSurgicalHistory(ehrData.surgicalHistory.join(', '));
      setEditVaccinations(ehrData.vaccinations.join(', '));
    }
  }, [ehrData]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await fetch('http://localhost:5000/patient/getByEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const result = await res.json();
        if (result.success) {
          setPatientData(result.data);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    if (email) fetchPatientData();
  }, [email]);

  const fetchPrescription = async () => {
    try {
      const response = await fetch('http://localhost:5000/prescription/getpresBymedID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientID: medID }),
      });
      const result = await response.json();
      if (result.success) {
        setPrescription(result.data);
      } else {
        setPrescription({});
      }
    } catch (error) {
      console.error("Error fetching prescription:", error);
      setPrescription({});
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/appointment/getappPat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientID: medID }),
      });
      const result = await response.json();
      if (result.success) {
        setAppointments(result.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    if (selectedTab === 2 && prescription === null) fetchPrescription();
  }, [selectedTab, prescription]);

  useEffect(() => {
    if (selectedTab === 5) fetchAppointments();
  }, [selectedTab]);

  const handleCancelAppointment = async (apt) => {
    try {
      const response = await fetch('http://localhost:5000/appointment/deleteapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientID: medID, date: apt.date, time: apt.time }),
      });
      const result = await response.json();
      if (result.success) {
        setAppointments(prev => prev.filter(a => a._id !== apt._id));
        alert(result.message);
      } else {
        alert(result.message || "Failed to delete appointment");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Error deleting appointment");
    }
  };

  // AI Assistant Functions
  const parseTime = (timeStr) => {
    try {
      const now = new Date();
      const [time, meridian] = timeStr.toLowerCase().split(/\s+/);
      let [hours, minutes = '00'] = time.split(':');
      hours = parseInt(hours);
      if (isNaN(hours)) throw new Error('Invalid hours');
      if (meridian === 'pm' && hours !== 12) hours += 12;
      if (meridian === 'am' && hours === 12) hours = 0;
      now.setHours(hours, parseInt(minutes), 0, 0);
      return now;
    } catch (error) {
      console.error('Error parsing time:', timeStr, error);
      return new Date();
    }
  };

  const extractTimeFromMessage = (message) => {
    const timeRegex = /(\d{1,2}(?::\d{2})?)\s*(am|pm|AM|PM)/i;
    const match = message.match(timeRegex);
    return match ? match[0] : null;
  };

  const extractDoctorFromMessage = (message) => {
    const doctorRegex = /dr\.?\s+([a-z]+)/i;
    const match = message.match(doctorRegex);
    return match ? match[1] : null;
  };

  const classifyReminderType = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('medicine') || lowerMessage.includes('medication') || lowerMessage.includes('pill') || lowerMessage.includes('drug')) {
      return 'medication';
    }
    if (lowerMessage.includes('doctor') || lowerMessage.includes('appointment') || lowerMessage.includes('visit') || lowerMessage.includes('checkup')) {
      return 'appointment';
    }
    return 'general';
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target?.result;
        setMessages(prev => [...prev, {
          sender: 'user',
          text: `Uploaded file: ${file.name}`,
          isFile: true,
        }]);

        const briefPrompt = `
          You are a medical AI assistant analyzing a medical report.
          Provide a brief overview of the key findings in plain text.
        `;

        const detailedPrompt = `
          You are a medical AI assistant analyzing a medical report.
          Provide a detailed analysis including:
          1. Key findings and abnormalities
          2. Critical values that need attention
          3. Recommendations based on the results
          4. Any concerning trends or patterns
          5. Suggested follow-up actions
          Format the response in clear sections without using any special characters or symbols.
        `;

        const briefResult = await model.generateContent({
          contents: [{
            role: 'user',
            parts: [
              { text: briefPrompt },
              { inlineData: { data: fileContent.split(',')[1], mimeType: file.type } },
            ],
          }],
        });

        const briefResponse = await briefResult.response;
        const briefText = briefResponse.text()
          .replace(/[*#]/g, '')
          .replace(/\n\s*\n/g, '\n')
          .trim();

        setMessages(prev => [...prev, {
          sender: 'bot',
          text: `Brief Overview:\n${briefText}\n\nFor a detailed explanation, please ask!`,
          fileAnalysis: { detailedPrompt, fileContent, fileType: file.type },
        }]);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing file:', error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Sorry, I had trouble analyzing that file. Please ensure it\'s a valid medical report in PDF or image format.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const currentMessage = userInput;
    setMessages(prev => [...prev, { sender: 'user', text: currentMessage }]);
    setUserInput('');
    setIsLoading(true);

    try {
      const lowerMessage = currentMessage.toLowerCase();

      if (lowerMessage.includes('remind') || lowerMessage.includes('set')) {
        const type = classifyReminderType(currentMessage);
        const timeStr = extractTimeFromMessage(currentMessage);
        const doctor = extractDoctorFromMessage(currentMessage);

        if (timeStr) {
          const reminderTime = parseTime(timeStr);
          const newReminder = {
            id: Date.now(),
            message: doctor
              ? `Appointment with Dr. ${doctor.charAt(0).toUpperCase() + doctor.slice(1)} at ${timeStr}`
              : currentMessage,
            time: reminderTime.toISOString(),
            type,
            dismissed: false,
          };
          setReminders(prev => [...prev, newReminder]);
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: `I've set a reminder for ${timeStr}: "${newReminder.message}"`,
          }]);
        } else {
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: 'Please specify a time (e.g., "Remind me at 3 PM") for the reminder.',
          }]);
        }
      } else if (lowerMessage.includes('detail') || lowerMessage.includes('explain')) {
        const lastBotMessage = messages.filter(m => m.sender === 'bot' && m.fileAnalysis).slice(-1)[0];
        if (lastBotMessage && lastBotMessage.fileAnalysis) {
          const { detailedPrompt, fileContent, fileType } = lastBotMessage.fileAnalysis;
          const detailedResult = await model.generateContent({
            contents: [{
              role: 'user',
              parts: [
                { text: detailedPrompt },
                { inlineData: { data: fileContent.split(',')[1], mimeType: fileType } },
              ],
            }],
          });
          const detailedResponse = await detailedResult.response;
          const detailedText = detailedResponse.text()
            .replace(/[*#]/g, '')
            .replace(/\n\s*\n/g, '\n')
            .trim();
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: `Detailed Analysis:\n${detailedText}`,
          }]);
        } else {
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: 'Please upload a report first or clarify what you want explained.',
          }]);
        }
      } else {
        const result = await model.generateContent({
          contents: [{
            role: 'user',
            parts: [{
              text: `You are a medical AI assistant. Provide a clear, direct response without using any special formatting or symbols. Current question: ${currentMessage}`
            }],
          }],
        });
        const response = await result.response;
        const cleanResponse = response.text()
          .replace(/[*#]/g, '')
          .replace(/\n\s*\n/g, '\n')
          .trim();
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: cleanResponse,
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Modal Functions
  const handleViewPDF = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <div className="text-center mb-6">
                <UserCircleIcon className="h-20 sm:h-24 w-20 sm:w-24 text-blue-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold">
                  {patientData ? `${patientData.fname} ${patientData.lname}` : 'Loading...'}
                </h2>
                <p className="text-gray-500">ID: {patientData?.medID || 'Loading...'}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                  <p>{patientData ? patientData.phNo : 'Loading...'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Blood Type</h3>
                  <p>{patientData ? patientData.bloodType : 'Loading...'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p>{patientData ? patientData.email : 'Loading...'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className="flex flex-wrap sm:flex-nowrap space-x-0 sm:space-x-2 space-y-2 sm:space-y-0 bg-white rounded-xl p-2 shadow-md mb-4 sm:mb-6">
                {[
                  { name: 'Medical History', icon: DocumentTextIcon },
                  { name: 'Lab Reports', icon: BeakerIcon },
                  { name: 'Prescriptions', icon: ClipboardDocumentListIcon },
                  { name: 'Vaccinations', icon: ShieldCheckIcon },
                  { name: 'AI Assistant', icon: ChatBubbleBottomCenterTextIcon },
                  { name: 'Appointments', icon: CalendarIcon },
                ].map((tab, idx) => (
                  <Tab
                    key={idx}
                    className={({ selected }) =>
                      `flex items-center px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${
                        selected ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    <tab.icon className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                  </Tab>
                ))}
              </Tab.List>

              <Tab.Panels className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <Tab.Panel>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold mb-4">Medical History</h3>
                      {isEditing ? (
                        <>
                          <button onClick={updateEHR} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors mr-2">Save</button>
                          <button onClick={cancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Edit EHR</button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Past Diagnoses</h4>
                        {isEditing ? (
                          <textarea
                            className="w-full border rounded-lg p-2"
                            value={editPastDiagnoses}
                            onChange={(e) => setEditPastDiagnoses(e.target.value)}
                            placeholder="Enter past diagnoses, separated by commas"
                          />
                        ) : (
                          <ul className="space-y-2 text-gray-600">
                            {ehrData ? ehrData.pastDiagnoses.map((diagnosis, idx) => (
                              <li key={idx}>{diagnosis}</li>
                            )) : <li>Loading...</li>}
                          </ul>
                        )}
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Surgical History</h4>
                        {isEditing ? (
                          <textarea
                            className="w-full border rounded-lg p-2"
                            value={editSurgicalHistory}
                            onChange={(e) => setEditSurgicalHistory(e.target.value)}
                            placeholder="Enter surgical history, separated by commas"
                          />
                        ) : (
                          <ul className="space-y-2 text-gray-600">
                            {ehrData ? ehrData.surgicalHistory.map((surgery, idx) => (
                              <li key={idx}>{surgery}</li>
                            )) : <li>Loading...</li>}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Blood Test Reports</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={healthData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="glucose" stroke="#3B82F6" />
                          <Line type="monotone" dataKey="bp" stroke="#EF4444" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      {[1, 2, 3].map((report) => (
                        <div key={report} className="border rounded-lg p-4">
                          <h4 className="font-medium">CBC Report</h4>
                          <p className="text-sm text-gray-500">Date: Apr 10, 2024</p>
                          <button
                            onClick={handleViewPDF}
                            className="text-blue-500 hover:text-blue-600 mt-2 transition-colors"
                          >
                            View PDF
                          </button>
                        </div>
                      ))}
                    </div>

                    {isModalOpen && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Blood Test Report Preview</h3>
                            <button
                              onClick={closeModal}
                              className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                              ✕
                            </button>
                          </div>
                          <div
                            dangerouslySetInnerHTML={{ __html: sampleBloodTestReport }}
                            className="p-4 border rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Prescription Details</h3>
                    {prescription && Object.keys(prescription).length > 0 ? (
                      <div className="border rounded-lg p-4">
                        <p><strong>MLN:</strong> {prescription.MLN}</p>
                        <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                        <p><strong>Number of Medications:</strong> {prescription.numberOfMedications}</p>
                        {prescription.medications && prescription.medications.length > 0 && (
                          <div>
                            <h4 className="font-medium mt-4">Medications:</h4>
                            <ul className="list-disc ml-5">
                              {prescription.medications.map((med, idx) => (
                                <li key={idx}>{med.medicationName} - {med.dosage} - {med.frequency} - {med.duration} - {med.route}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {prescription.labTests && prescription.labTests.length > 0 && (
                          <div>
                            <h4 className="font-medium mt-4">Lab Tests:</h4>
                            <ul className="list-disc ml-5">
                              {prescription.labTests.map((test, idx) => (
                                <li key={idx}>{test.testName} {test.urgent ? "(Urgent)" : ""}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {prescription.additionalInstructions && (
                          <p className="mt-4"><strong>Additional Instructions:</strong> {prescription.additionalInstructions}</p>
                        )}
                      </div>
                    ) : (
                      <p>No prescription details</p>
                    )}
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Vaccination Records</h3>
                      {isEditing ? (
                        <>
                          <button onClick={updateEHR} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors mr-2">Save</button>
                          <button onClick={cancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Edit Vaccinations</button>
                      )}
                    </div>
                    {isEditing ? (
                      <textarea
                        className="w-full border rounded-lg p-2"
                        value={editVaccinations}
                        onChange={(e) => setEditVaccinations(e.target.value)}
                        placeholder="Enter vaccinations, separated by commas"
                      />
                    ) : (
                      <div className="relative">
                        <div className="absolute h-full w-0.5 bg-gray-200 left-2.5"></div>
                        <div className="space-y-6 relative">
                          {ehrData ? ehrData.vaccinations.map((vac, idx) => (
                            <div key={idx} className="flex items-start">
                              <div className="w-5 h-5 rounded-full bg-green-500 relative z-10"></div>
                              <div className="ml-4">
                                <h4 className="font-medium">{vac}</h4>
                                <p className="text-sm text-gray-500">Status: Completed</p>
                              </div>
                            </div>
                          )) : <p>Loading...</p>}
                        </div>
                      </div>
                    )}
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">AI Assistant</h3>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="h-96 overflow-y-auto bg-white rounded-lg p-4 mb-4">
                        {messages.map((msg, index) => (
                          <div key={index} className={`mb-4 flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'bot' ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900'}`}>
                              {msg.isFile ? (
                                <div className="flex items-center">
                                  <PaperClipIcon className="h-5 w-5 mr-2" />
                                  {msg.text}
                                </div>
                              ) : msg.text}
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start mb-4">
                            <div className="bg-blue-100 text-blue-900 p-3 rounded-lg">Analyzing...</div>
                          </div>
                        )}
                      </div>
                      <form onSubmit={handleSendMessage} className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask me anything, upload a report, or set a reminder..."
                            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            disabled={isLoading}
                          >
                            <PaperClipIcon className="h-6 w-6" />
                          </button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            className="hidden"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                            disabled={isLoading}
                          >
                            Send
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Appointments</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div ref={calendarRef} className="bg-white rounded-xl shadow-sm p-4">
                        <Calendar
                          onChange={setDate}
                          value={date}
                          className="w-full border-none font-sans"
                          navigationLabel={({ date }) => (
                            <span className="text-base font-semibold text-gray-800">
                              {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </span>
                          )}
                          tileClassName={({ date: tileDate, view }) => {
                            const classes = ['p-2 rounded-md transition-colors'];
                            if (view === 'month') {
                              if (tileDate.toDateString() === new Date().toDateString()) {
                                classes.push('bg-gray-100 font-medium');
                              }
                              if (tileDate.toDateString() === date?.toDateString()) {
                                classes.push('bg-blue-500 text-white font-semibold');
                              } else {
                                classes.push('hover:bg-blue-100 hover:text-blue-800');
                              }
                              if (tileDate.getMonth() !== new Date(date || new Date()).getMonth()) {
                                classes.push('text-gray-300');
                              } else if (tileDate.getDay() === 0 || tileDate.getDay() === 6) {
                                classes.push('text-gray-400');
                              } else {
                                classes.push('text-gray-700');
                              }
                            }
                            return classes.join(' ');
                          }}
                          prevLabel={<span className="text-blue-500 hover:text-blue-600 text-xl">‹</span>}
                          nextLabel={<span className="text-blue-500 hover:text-blue-600 text-xl">›</span>}
                        />
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-700">Upcoming Appointments</h4>
                        {appointments.length > 0 ? (
                          appointments.map((apt) => (
                            <div
                              key={apt._id}
                              className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                            >
                              <h5 className="font-medium text-gray-800">{apt.patientName}</h5>
                              <p className="text-sm text-gray-500">
                                {new Date(apt.date).toLocaleDateString()} - {apt.time}
                              </p>
                              <p className="text-sm text-gray-500">Reason: {apt.reasonVisit}</p>
                              <div className="flex space-x-2 mt-3">
                                <button
                                  onClick={() => handleCancelAppointment(apt)}
                                  className="text-sm text-red-500 hover:text-red-600 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600">No appointments found</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
      {/* Notification Box Integration */}
      <NotificationBox reminders={reminders} setReminders={setReminders} />
    </div>
  );
};

export default EHRUsr;