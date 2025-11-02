import { useState, useRef, useEffect, useCallback } from 'react';
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
import NotificationBox from './Notifications';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source for pdf.js to a secure and reliable CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Initialize Gemini API with your API key
const genAI = new GoogleGenerativeAI('AIzaSyCOwa9U5_I5H8ZMT9pgH3TxfgC7-c5DxyA');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

const healthData = [
  { name: 'Jan', glucose: 95, bp: 120 },
  { name: 'Feb', glucose: 100, bp: 125 },
  { name: 'Mar', glucose: 92, bp: 118 },
  { name: 'Apr', glucose: 98, bp: 122 },
];

// Sample Reports for Type 1 Diabetes
const type1DiabetesReports = {
  2012: `
    <div id="type-1-diabetes-2012">
      <h2>Type 1 Diabetes Report (2012)</h2>
      <p><strong>Patient Name:</strong> John Doe</p>
      <p><strong>Diagnosis Date:</strong> January 15, 2012</p>
      <p><strong>Condition:</strong> Type 1 Diabetes Mellitus</p>
      <p><strong>Blood Glucose Level:</strong> 180 mg/dL (Fasting)</p>
      <p><strong>HbA1c:</strong> 7.8%</p>
      <p><strong>Physician:</strong> Dr. Emily Carter</p>
      <p><strong>Notes:</strong> Patient diagnosed with Type 1 Diabetes. Insulin therapy initiated. Recommended daily monitoring of blood glucose levels.</p>
    </div>
  `,
  2015: `
    <div id="type-1-diabetes-2015">
      <h2>Type 1 Diabetes Report (2015)</h2>
      <p><strong>Patient Name:</strong> John Doe</p>
      <p><strong>Diagnosis Date:</strong> March 22, 2015</p>
      <p><strong>Condition:</strong> Type 1 Diabetes Mellitus</p>
      <p><strong>Blood Glucose Level:</strong> 165 mg/dL (Fasting)</p>
      <p><strong>HbA1c:</strong> 7.2%</p>
      <p><strong>Physician:</strong> Dr. Michael Lee</p>
      <p><strong>Notes:</strong> Follow-up report. Glucose levels improved with adjusted insulin dosage. Patient advised to continue monitoring and report any hypoglycemic episodes.</p>
    </div>
  `,
};

// Boyer-Moore Search Algorithm
function BoyerMooreSearch(text, pattern, extractValue = false) {
  const lowerText = text.toLowerCase();
  const lowerPattern = pattern.toLowerCase();

  const n = lowerText.length, m = lowerPattern.length;
  if (m > n || m === 0) return { matches: [], occurrences: [], value: null };

  const badChar = new Array(256).fill(m);
  for (let i = 0; i < m - 1; i++) {
    badChar[lowerPattern.charCodeAt(i)] = m - 1 - i;
  }

  let s = 0, matches = [], occurrences = [], value = null;
  while (s <= n - m) {
    let j = m - 1;
    while (j >= 0 && lowerPattern[j] === lowerText[s + j]) j--;

    if (j < 0) {
      matches.push(s);
      if (extractValue) {
        const start = s + m;
        const valueMatch = text.slice(start).match(/[:\s]+([^<\n]+)/);
        if (valueMatch) {
          value = valueMatch[1].trim();
          occurrences.push({ position: s, value });
        }
      }
      s += (s + m < n) ? m - badChar[lowerText.charCodeAt(s + m)] : 1;
    } else {
      s += Math.max(1, j - badChar[lowerText.charCodeAt(s + j)]);
    }
  }
  return { matches, occurrences, value: occurrences.length > 0 ? occurrences[0].value : null };
}

// Other Search Algorithms (unchanged for brevity)
function RabinKarpSearch(text, pattern, d = 256, q = 101) {
  const n = text.length, m = pattern.length;
  if (m > n) return [];
  let h = 1, p = 0, t = 0, matches = [];

  for (let i = 0; i < m - 1; i++) h = (h * d) % q;
  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }

  for (let i = 0; i <= n - m; i++) {
    if (p === t) {
      let match = true;
      for (let j = 0; j < m; j++) {
        if (pattern[j] !== text[i + j]) {
          match = false;
          break;
        }
      }
      if (match) matches.push(i);
    }
    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) t += q;
    }
  }
  return matches;
}

function computeLPSArray(pattern) {
  const lps = [0];
  let len = 0, i = 1;
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else if (len !== 0) {
      len = lps[len - 1];
    } else {
      lps[i] = 0;
      i++;
    }
  }
  return lps;
}

function KMPSearch(text, pattern) {
  const lps = computeLPSArray(pattern);
  let i = 0, j = 0, matches = [];
  while (i < text.length) {
    if (pattern[j] === text[i]) {
      i++;
      j++;
    }
    if (j === pattern.length) {
      matches.push(i - j);
      j = lps[j - 1];
    } else if (i < text.length && pattern[j] !== text[i]) {
      if (j !== 0) j = lps[j - 1];
      else i++;
    }
  }
  return matches;
}

const EHRUsr = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [date, setDate] = useState(null);
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
  const [modalContent, setModalContent] = useState(null);
  const email = localStorage.getItem('userEmail');
  const calendarRef = useRef(null);

  // AI Assistant States
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi! I'm your AI Health Assistant powered by Gemini. I can help you analyze medical reports, set reminders, search EHR with 'search' or 'prefix', or test algorithms with 'test algorithms'. How can I assist you today?",
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reminders, setReminders] = useState([]);
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [awaitingDiabetesDetails, setAwaitingDiabetesDetails] = useState(false);
  const [detailedReport, setDetailedReport] = useState(null);

  useEffect(() => {
    const sampleEhrData = {
      pastDiagnoses: [
        "Type 1 Diabetes (2012)",
        "Chronic Kidney Disease (2015)",
        "Type 1 Diabetes (2015)",
        "Hypertension (2016)",
        "Type 2 Diabetes (2016)",
        "Coronary Artery Disease (2017)",
        "Type 1 Diabetes (2018)",
        "Chronic Pain (2018)",
        "Hyperthyroidism (2018)",
        "Type 2 Diabetes (2019)",
        "Chronic Obstructive Pulmonary Disease (2019)",
        "Peripheral Neuropathy (2019)",
        "Osteoporosis (2019)",
        "Osteoarthritis (2020)",
        "Rheumatoid Arthritis (2020)",
        "Gestational Diabetes (2020)",
        "Type 2 Diabetes (2020)",
        "Stroke (2020)",
        "Sleep Apnea (2020)",
        "Chronic Fatigue Syndrome (2020)",
        "Gestational Diabetes (2021)",
        "Type 2 Diabetes (2021)",
        "Obesity (2021)",
        "Fibromyalgia (2021)",
        "Cataracts (2021)",
        "Depression (2021)",
        "Sleep Apnea (2021)",
        "Hypoglycemia (2021)",
        "Polycystic Ovary Syndrome (2022)",
        "Hypothyroidism (2022)",
        "Psoriasis (2022)",
        "Chronic Sinusitis (2022)",
        "Chronic Migraine (2022)",
        "Gestational Diabetes (2023)",
        "Cardiomyopathy (2023)",
        "Anemia (2023)",
        "Gastroesophageal Reflux Disease (2023)",
        "Migraine (2023)",
        "Irritable Bowel Syndrome (2023)",
        "Anxiety Disorder (2023)",
        "Vitamin B12 Deficiency (2023)",
        "Vitamin D Deficiency (2024)",
        "Iron Deficiency (2024)",
      ],
      surgicalHistory: [
        "Appendectomy (2015, City Hospital, Dr. Smith)",
        "Knee Surgery (2018, General Medical Center, Dr. Jones)",
        "Gallbladder Removal (2020, Metro Health, Dr. Brown)",
      ],
      vaccinations: ["Flu Shot", "Tetanus"],
    };
    setEhrData(sampleEhrData);

    setPrescription({
      prescriptions: [
        {
          diagnosis: "Type 1 Diabetes (2012)",
          medications: [
            { medicationName: "Insulin", dosage: "10 units", frequency: "Daily", duration: "Ongoing", route: "Subcutaneous" },
          ],
          additionalInstructions: "Monitor blood sugar levels regularly.",
        },
        {
          diagnosis: "Type 1 Diabetes (2015)",
          medications: [
            { medicationName: "Insulin", dosage: "12 units", frequency: "Daily", duration: "Ongoing", route: "Subcutaneous" },
          ],
          additionalInstructions: "Adjusted dosage due to increased glucose levels.",
        },
        {
          diagnosis: "Type 2 Diabetes (2016)",
          medications: [
            { medicationName: "Metformin", dosage: "500 mg", frequency: "Twice daily", duration: "Ongoing", route: "Oral" },
          ],
          additionalInstructions: "Follow a low-carb diet.",
        },
        {
          diagnosis: "Gestational Diabetes (2020)",
          medications: [
            { medicationName: "Insulin", dosage: "5 units", frequency: "As needed", duration: "During pregnancy", route: "Subcutaneous" },
          ],
          additionalInstructions: "Check glucose levels 4 times daily.",
        },
        {
          diagnosis: "Hypertension (2016)",
          medications: [
            { medicationName: "Lisinopril", dosage: "10 mg", frequency: "Daily", duration: "Ongoing", route: "Oral" },
          ],
          additionalInstructions: "Reduce salt intake.",
        },
      ],
    });
  }, []);

  const sortedPastDiagnoses = ehrData?.pastDiagnoses
    ? [...ehrData.pastDiagnoses].sort((a, b) => {
        const yearA = parseInt(a.match(/\d{4}/)?.[0] || 0);
        const yearB = parseInt(b.match(/\d{4}/)?.[0] || 0);
        return yearA - yearB;
      })
    : [];

  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setDate(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        setPrescription({ prescriptions: result.data });
      } else {
        setPrescription({ prescriptions: [] });
      }
    } catch (error) {
      console.error("Error fetching prescription:", error);
      setPrescription({ prescriptions: [] });
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
    const timeRegex = /(\d{1,2}(?::\d{2})?)\s*(am|pm|AM|PM)/;
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

  const extractDiagnosisDetails = (diagnosesText, query) => {
    const lowerQuery = query.toLowerCase();
    return diagnosesText
      .split(', ')
      .filter(entry => entry.toLowerCase().includes(lowerQuery))
      .map(entry => {
        const match = entry.match(/(.+?)\s*\((\d{4})\)/);
        if (match) {
          return { name: match[1].trim(), year: parseInt(match[2]) };
        }
        return null;
      })
      .filter(entry => entry !== null);
  };

  const generateRandomPrescription = (diagnosis, year) => {
    const medications = [
      { name: "Aspirin", dosage: `${Math.floor(Math.random() * 100) + 50} mg`, frequency: "Daily" },
      { name: "Metformin", dosage: `${Math.floor(Math.random() * 500) + 100} mg`, frequency: "Twice daily" },
      { name: "Insulin", dosage: `${Math.floor(Math.random() * 20) + 5} units`, frequency: "As needed" },
      { name: "Lisinopril", dosage: `${Math.floor(Math.random() * 20) + 5} mg`, frequency: "Daily" },
    ];
    const randomMed = medications[Math.floor(Math.random() * medications.length)];
    return `
      <div className="bg-white rounded-lg p-6 shadow-lg" style="font-family: Arial, sans-serif; border: 1px solid #ccc;">
        <h2 className="text-xl font-semibold mb-4">Prescription for ${diagnosis} (${year})</h2>
        <p><strong>Patient Name:</strong> John Doe</p>
        <p><strong>Date Issued:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Diagnosis:</strong> ${diagnosis}</p>
        <h4 className="font-medium mt-2">Medication:</h4>
        <ul className="list-disc ml-5">
          <li>${randomMed.name} - ${randomMed.dosage} - ${randomMed.frequency}</li>
        </ul>
        <p className="mt-2"><strong>Instructions:</strong> Take as prescribed by your physician.</p>
        <p className="mt-2"><strong>Physician:</strong> Dr. Random Name</p>
        <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Close</button>
      </div>
    `;
  };

  const handlePrescriptionViewClick = (diagnosis, year) => {
    const content = generateRandomPrescription(diagnosis, year);
    setModalContent({ type: 'prescription', content });
    setIsModalOpen(true);
  };
  
  const handleMedicalHistorySearch = (diagnosesText, query) => {
    const lowerQuery = query.toLowerCase().trim();
    const startTime = performance.now();
    const { matches } = BoyerMooreSearch(diagnosesText, lowerQuery);
    const endTime = performance.now();
    const bmTime = (endTime - startTime).toFixed(2);
  
    const diagnosisEntries = extractDiagnosisDetails(diagnosesText, lowerQuery);
  
    if (diagnosisEntries.length > 0) {
      return `
  Medical History Search Results
  Query: "${query}"
  Found ${matches.length} occurrences
  
  Matches:
  ${diagnosisEntries
    .map(
      (entry) =>
        `- ${entry.name} (${entry.year}) <span style="cursor: pointer; color: blue; text-decoration: underline;" onClick="
          (function() {
            handlePrescriptionViewClick('${entry.name}', '${entry.year}');
          })();
        ">[View Prescription]</span>`
    )
    .join('\n')}
  
  Performance Metrics
  Boyer-Moore Time: ${bmTime} ms
      `;
    } else {
      return `
  Medical History Search Results
  Query: "${query}"
  No matches found in past diagnoses.
  
  Performance Metrics
  Boyer-Moore Time: ${bmTime} ms
      `;
    }
  };
  const handleDiabetesSearch = (diagnosesText, userQuery) => {
    const lowerQuery = userQuery.toLowerCase().trim();
    const startTime = performance.now();
    const { matches } = BoyerMooreSearch(diagnosesText, 'diabetes', true);
    const endTime = performance.now();
    const bmTime = (endTime - startTime).toFixed(2);

    const diabetesEntries = extractDiagnosisDetails(diagnosesText, 'diabetes');
    const uniqueTypes = [...new Set(diabetesEntries.map(entry => entry.name.split(' ')[0] + ' ' + entry.name.split(' ')[1]))];

    if (lowerQuery === 'diabetes') {
      setAwaitingDiabetesDetails(true);
      return `
Diabetes Search Results
Found ${matches.length} occurrences of "Diabetes"

Diabetes Types Identified:
${uniqueTypes.map(type => `- ${type}`).join('\n')}

Please specify:
- A year (e.g., "diabetes 2012")
- A type (e.g., "diabetes type 1")
- Both (e.g., "diabetes type 1 2012")
- Or type "all" to see all occurrences

Performance Metrics
Boyer-Moore Time: ${bmTime} ms
      `;
    } else if (lowerQuery === 'all' && awaitingDiabetesDetails) {
      setAwaitingDiabetesDetails(false);
      return `
All Diabetes Occurrences
${diabetesEntries.map(entry => {
  return `- ${entry.name} (${entry.year}) <a href="#" onClick={(e) => { e.preventDefault(); handlePrescriptionViewClick('${entry.name}', '${entry.year}'); }} className="text-blue-500 hover:underline">[View Prescription]</a>`;
}).join('\n')}

Performance Metrics
Boyer-Moore Time: ${bmTime} ms
      `;
    } else if (awaitingDiabetesDetails) {
      setAwaitingDiabetesDetails(false);
      const yearMatch = lowerQuery.match(/(\d{4})/);
      const typeMatch = lowerQuery.match(/(type \d+|gestational)/i);
      
      let filteredEntries = diabetesEntries;
      let filterDescription = '';

      if (yearMatch) {
        const year = parseInt(yearMatch[0]);
        filteredEntries = filteredEntries.filter(entry => entry.year === year);
        filterDescription += `Year: ${year}`;
      }
      if (typeMatch) {
        const type = typeMatch[0];
        filteredEntries = filteredEntries.filter(entry => entry.name.toLowerCase().includes(type.toLowerCase()));
        filterDescription += `${filterDescription ? ', ' : ''}Type: ${type}`;
      }

      if (filteredEntries.length > 0 || yearMatch || typeMatch) {
        return `
Filtered Diabetes Occurrences
${filterDescription ? `Filtered by: ${filterDescription}` : 'No specific filters applied'}
${filteredEntries.length > 0
  ? filteredEntries.map(entry => {
      return `- ${entry.name} (${entry.year}) <a href="#" onClick={(e) => { e.preventDefault(); handlePrescriptionViewClick('${entry.name}', '${entry.year}'); }} className="text-blue-500 hover:underline">[View Prescription]</a>`;
    }).join('\n')
  : 'No matches found for the specified criteria'}

Performance Metrics
Boyer-Moore Time: ${bmTime} ms
        `;
      }
    }

    return null;
  };

  const handleSurgerySearch = (surgicalHistoryText, query) => {
    const startTime = performance.now();
    const { matches } = BoyerMooreSearch(surgicalHistoryText.toLowerCase(), query.toLowerCase());
    const endTime = performance.now();
    const bmTime = (endTime - startTime).toFixed(2);

    const surgeryDetails = ehrData.surgicalHistory
      .filter(surgery => surgery.toLowerCase().includes(query.toLowerCase()))
      .map(surgery => {
        const match = surgery.match(/(.+?)\s*\((\d{4}),\s*([^,]+),\s*Dr\.\s*(\w+)\)/);
        if (match) {
          return {
            name: match[1].trim(),
            year: match[2],
            hospital: match[3].trim(),
            doctor: match[4],
          };
        }
        return null;
      })
      .filter(surgery => surgery !== null);

    return `
Surgery Search Results
Query: "${query}"
${surgeryDetails.length > 0
  ? surgeryDetails.map(s => `- ${s.name} (${s.year}, ${s.hospital}, Dr. ${s.doctor})`).join('\n')
  : 'No matches found'}

Performance Metrics
Boyer-Moore Time: ${bmTime} ms
    `;
  };

  const handlePrescriptionLinkClick = useCallback((type, year) => {
    if (selectedTab === 4) { // AI Assistant tab index
      const prescriptionData = prescription?.prescriptions.find(p => p.diagnosis === `${type} Diabetes (${year})`);
      if (prescriptionData) {
        setModalContent({
          type: 'prescription',
          content: `
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Prescription Details - ${type} Diabetes (${year})</h2>
              <p><strong>Diagnosis:</strong> ${prescriptionData.diagnosis}</p>
              <h4 className="font-medium mt-2">Medications:</h4>
              <ul className="list-disc ml-5">
                ${prescriptionData.medications.map(med => `
                  <li>
                    ${med.medicationName} - ${med.dosage} - ${med.frequency} - ${med.duration} - ${med.route}
                  </li>
                `).join('')}
              </ul>
              ${prescriptionData.additionalInstructions ? `<p className="mt-2"><strong>Additional Instructions:</strong> ${prescriptionData.additionalInstructions}</p>` : ''}
              <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Close</button>
            </div>
          `,
        });
        setIsModalOpen(true);
      }
    }
  }, [selectedTab, prescription]);

  const handleDetailedReportClick = () => {
    if (detailedReport) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: `**Detailed Explanation**\n${detailedReport}` },
      ]);
      setDetailedReport(null);
    }
  };

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    try {
      let textContent = '';
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          text += textContent.items.map(item => item.str).join(' ') + '\n';
        }
        textContent = text;
      } else if (file.type.startsWith('text/')) {
        textContent = await file.text();
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or text file.');
      }

      const prompt = `
        You are a medical AI assistant. Analyze the following medical report and provide:
        1. A brief overview (2-3 sentences) formatted as:
           **Overview**
           [Your brief overview here]
        2. A detailed explanation formatted as:
           **Detailed Explanation**
           [Your detailed explanation here]
        Use plain text with clear sections separated by new lines. Here's the report content:
        ${textContent}
      `;

      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }],
        }],
      });
      const response = await result.response;
      const analysis = response.text()
        .replace(/[*#]/g, '**')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      const [overviewSection, detailedSection] = analysis.split('**Detailed Explanation**');
      const overview = overviewSection.replace('**Overview**', '').trim();
      const detailedExplanation = detailedSection ? detailedSection.trim() : 'No detailed explanation provided.';

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `
**Overview**
${overview}

<a href="#" onClick={(e) => { e.preventDefault(); handleDetailedReportClick(); }} className="text-blue-500 hover:underline">[Detailed Explanation]</a>
          `,
        },
      ]);
      setDetailedReport(detailedExplanation);
    } catch (error) {
      console.error('Error analyzing file:', error);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: `Error\nFailed to analyze the uploaded file: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
      setUploadedFile(null);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() && !uploadedFile) return;

    if (uploadedFile) {
      setMessages(prev => [...prev, { sender: 'user', text: `Uploaded file: ${uploadedFile.name}` }]);
      await handleFileUpload(uploadedFile);
      return;
    }

    const currentMessage = userInput;
    setMessages(prev => [...prev, { sender: 'user', text: currentMessage }]);
    setUserInput('');
    setIsLoading(true);

    try {
      const lowerMessage = currentMessage.toLowerCase();

      if (lowerMessage.includes('search') && ehrData) {
        const query = lowerMessage.replace('search', '').trim();
        const diagnosesText = ehrData.pastDiagnoses.join(', ');
        const surgeriesText = ehrData.surgicalHistory.join(', ');

        if (query.includes('diabetes')) {
          const diabetesResult = handleDiabetesSearch(diagnosesText, query);
          if (diabetesResult) {
            setMessages(prev => [...prev, { sender: 'bot', text: diabetesResult }]);
            return;
          }
        }

        if (query.includes('surgery') || ehrData.surgicalHistory.some(surgery => surgery.toLowerCase().includes(query))) {
          const surgeryResult = handleSurgerySearch(surgeriesText, query);
          setMessages(prev => [...prev, { sender: 'bot', text: surgeryResult }]);
          return;
        }

        const medicalHistoryResult = handleMedicalHistorySearch(diagnosesText, query);
        setMessages(prev => [...prev, { sender: 'bot', text: medicalHistoryResult }]);
      } else if (lowerMessage.includes('prefix') && ehrData) {
        const query = lowerMessage.replace('prefix', '').trim();
        const diagnosesText = ehrData.pastDiagnoses.join(' ').toLowerCase();
        const surgeriesText = ehrData.surgicalHistory.join(' ').toLowerCase();
        let prescriptionText = '';
        if (prescription && prescription.prescriptions) {
          prescriptionText = prescription.prescriptions.map(p => p.medications.map(m => m.medicationName).join(' ')).join(' ').toLowerCase();
        }

        let startTime = performance.now();
        const kmpDiagnosesMatches = KMPSearch(diagnosesText, query);
        const kmpSurgeriesMatches = KMPSearch(surgeriesText, query);
        const kmpPrescriptionMatches = prescriptionText ? KMPSearch(prescriptionText, query) : [];
        let endTime = performance.now();
        const kmpTime = (endTime - startTime).toFixed(2);

        const resultText = `
Prefix Search Results
Query: "${query}"
Past Diagnoses: ${kmpDiagnosesMatches.length} matches
Surgical History: ${kmpSurgeriesMatches.length} matches
Medications: ${kmpPrescriptionMatches.length} matches

Performance Metrics
KMP Time: ${kmpTime} ms
        `;
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: resultText,
        }]);
      } else if (lowerMessage === 'test algorithms') {
        const testText = "Diabetes is a chronic condition affecting millions worldwide Diabetes management requires careful monitoring Diabetes can lead to complications if untreated Patient with Diabetes needs regular checkups Diabetes affects blood sugar levels Diabetes Type 2 is common in adults Diabetes requires insulin in some cases Diabetes education is crucial for patients Diabetes impacts kidney function over time Diabetes prevalence is increasing globally Hypertension often accompanies Diabetes Diabetes screening is recommended annually Diabetes research is ongoing Diabetes symptoms include fatigue and thirst Diabetes treatment varies by patient Diabetes can be managed with diet and exercise";
        const testPattern = "Diabetes";

        let startTime, endTime;

        startTime = performance.now();
        const rkMatches = RabinKarpSearch(testText, testPattern);
        endTime = performance.now();
        const rkTime = (endTime - startTime).toFixed(2);

        startTime = performance.now();
        const kmpMatches = KMPSearch(testText, testPattern);
        endTime = performance.now();
        const kmpTime = (endTime - startTime).toFixed(2);

        startTime = performance.now();
        const bmMatches = BoyerMooreSearch(testText, testPattern).matches;
        endTime = performance.now();
        const bmTime = (endTime - startTime).toFixed(2);

        const resultText = `
Algorithm Test Results
Pattern: "${testPattern}"
Rabin-Karp: ${rkMatches.length} matches
KMP: ${kmpMatches.length} matches
Boyer-Moore: ${bmMatches.length} matches

Performance Metrics
Rabin-Karp Time: ${rkTime} ms
KMP Time: ${kmpTime} ms
Boyer-Moore Time: ${bmTime} ms
        `;
        setMessages(prev => [...prev, { sender: 'bot', text: resultText }]);
      } else if (lowerMessage.includes('remind') || lowerMessage.includes('set')) {
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
            text: `Reminder Set\nTime: ${timeStr}\nDetails: "${newReminder.message}"`,
          }]);
        } else {
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: 'Error\nPlease specify a time (e.g., "Remind me at 3 PM") for the reminder.',
          }]);
        }
      } else {
        const result = await model.generateContent({
          contents: [{
            role: 'user',
            parts: [{
              text: `You are a medical AI assistant. Provide a clear, direct response in plain text with sections separated by new lines. Current question: ${currentMessage}`
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
          text: `Response\n${cleanResponse}`,
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Error\nSorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

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
                          <ul className="space-y-2 text-gray-600 list-disc list-inside">
                            {sortedPastDiagnoses.length > 0 ? sortedPastDiagnoses.map((diagnosis, idx) => (
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
                          <ul className="space-y-2 text-gray-600 list-disc list-inside">
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
                    <h3 className="text-xl font-semibold mb-4">Lab Reports</h3>
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
                    <p className="mt-6 text-gray-600">Use the AI Assistant tab to view prescription details via search.</p>
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Prescription Details</h3>
                    {prescription && prescription.prescriptions && prescription.prescriptions.length > 0 ? (
                      <div className="border rounded-lg p-4">
                        {prescription.prescriptions.map((pres, idx) => (
                          <div key={idx} className="mb-4">
                            <p><strong>Diagnosis:</strong> {pres.diagnosis}</p>
                            <h4 className="font-medium mt-2">Medications:</h4>
                            <ul className="list-disc ml-5">
                              {pres.medications.map((med, medIdx) => (
                                <li key={medIdx}>
                                  {med.medicationName} - {med.dosage} - {med.frequency} - {med.duration} - {med.route}
                                </li>
                              ))}
                            </ul>
                            {pres.additionalInstructions && (
                              <p className="mt-2"><strong>Additional Instructions:</strong> ${pres.additionalInstructions}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No prescription details available</p>
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
                            <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'bot' ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900'} whitespace-pre-wrap`}>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: msg.text
                                    .replace(
                                      /<a href="#" onClick=\{.*?\}\s*className="text-blue-500 hover:underline">\[View Prescription\]/g,
                                      (match) => {
                                        const [, diagnosis, year] = match.match(/handlePrescriptionViewClick\('([^']+)', '([^']+)'\)/) || [];
                                        return `<a href="#" onClick={(e) => { e.preventDefault(); handlePrescriptionViewClick('${diagnosis}', '${year}'); }} className="text-blue-500 hover:underline">[View Prescription]</a>`;
                                      }
                                    )
                                    .replace(
                                      /\[Detailed Explanation\]/g,
                                      `<a href="#" onClick={(e) => { e.preventDefault(); handleDetailedReportClick(); }} className="text-blue-500 hover:underline">[Detailed Explanation]</a>`
                                    )
                                }}
                              />
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
                            placeholder="Ask me anything, upload a report, or use 'search'/'prefix'/'test algorithms'..."
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
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setUploadedFile(file);
                                handleSendMessage(new Event('submit')); // Trigger form submission
                              }
                            }}
                            accept=".pdf,.txt"
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
                          className="w-full border-none font-roboto"
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
      <NotificationBox reminders={reminders} setReminders={setReminders} />
      {isModalOpen && modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => {
          if (e.target.className.includes('fixed')) {
            closeModal();
          }
        }}>
          <div className="bg-white rounded-lg p-6 shadow-lg" onClick={e => e.stopPropagation()}>
            <div dangerouslySetInnerHTML={{ __html: modalContent.content }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EHRUsr;