import React, { useState, useRef, useEffect } from 'react';
import { Phone, MapPin, Clock, AlertCircle, Copy, Video, Mic, X, VolumeX, Truck } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function Emergency() {
  const [showSOSConfirm, setShowSOSConfirm] = useState(false);
  const [sosPassword, setSosPassword] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [showDropdown, setShowDropdown] = useState(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [correctedInput, setCorrectedInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  const genAI = new GoogleGenerativeAI('AIzaSyCOwa9U5_I5H8ZMT9pgH3TxfgC7-c5DxyA'); // Replace with your Gemini API key

  // Emergency-related terms for autocorrection and autocomplete
  const emergencyTerms = {
    'hot pain': 'heart pain',
    'hart pain': 'heart pain',
    'chest pan': 'chest pain',
    'snake bit': 'snake bite',
    'bleeding': 'bleeding',
    'chocking': 'choking',
    'pain': 'pain' 
  };

  const symptomSuggestions = {
    'heart pain': ['severe', 'light', 'sweating', 'nausea', 'shortness of breath'],
    'chest pain': ['severe', 'light', 'sweating', 'nausea', 'shortness of breath'],
    'snake bite': ['swelling', 'pain', 'dizziness', 'bleeding', 'nausea'],
    'bleeding': ['severe', 'light', 'pressure applied', 'location'],
    'choking': ['can speak', 'cannot speak', 'turning blue'],
    'pain': ['heart pain', 'chest pain', 'severe', 'light', 'sweating', 'nausea', 'shortness of breath'] // Aggregated pain-related suggestions
  };

  const hospitals = [
    { name: 'City General Hospital', distance: '0.8 km', time: '5 mins', phone: '555-0101' },
    { name: 'Medicare Emergency Care', distance: '1.2 km', time: '8 mins', phone: '555-0102' },
    { name: "St. John's Hospital", distance: '2.5 km', time: '12 mins', phone: '555-0103' },
  ];

  const emergencyContacts = { ambulance: '911', police: '911', fire: '911' };
  const ambulanceDetails = { driverName: "John Smith", vehicleNumber: "AMB-1234", contact: "555-0123", eta: "5 minutes" };
  const trackingDetails = { status: "En Route", landmarksCrossed: ["City Square - 2 mins ago", "Main Street - 1 min ago", "Park Avenue - Now"], eta: "4 minutes" };

  // KMP Algorithm Implementation
  const computeLPSArray = (pattern) => {
    const lps = new Array(pattern.length).fill(0);
    let length = 0;
    let i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[length]) {
        length++;
        lps[i] = length;
        i++;
      } else {
        if (length !== 0) {
          length = lps[length - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }
    return lps;
  };

  const KMPSearch = (text, pattern) => {
    const lps = computeLPSArray(pattern);
    let i = 0;
    let j = 0;

    while (i < text.length) {
      if (pattern[j] === text[i]) {
        i++;
        j++;
      }
      if (j === pattern.length) {
        return true;
      } else if (i < text.length && pattern[j] !== text[i]) {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
      }
    }
    return false;
  };

  // Levenshtein Distance for autocorrection
  const levenshteinDistance = (a, b) => {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    return matrix[b.length][a.length];
  };

  const autocorrectInput = (input) => {
    const lowerInput = input.toLowerCase();
    let minDistance = Infinity;
    let corrected = lowerInput;

    for (const [misspelled, correct] of Object.entries(emergencyTerms)) {
      if (KMPSearch(lowerInput, misspelled.split(' ')[0])) {
        return correct;
      }
      const distance = levenshteinDistance(lowerInput, misspelled);
      if (distance < minDistance && distance < 3) {
        minDistance = distance;
        corrected = correct;
      }
    }
    return corrected;
  };

  const getSuggestions = (correctedText) => {
    for (const [term, suggs] of Object.entries(symptomSuggestions)) {
      if (KMPSearch(correctedText, term)) {
        if (correctedText === 'pain') {
          // Special case for standalone "pain" - return all pain-related suggestions
          return symptomSuggestions['pain'];
        }
        return suggs;
      }
    }
    return [];
  };

  const generateRandomPassword = () => Math.floor(1000 + Math.random() * 9000).toString();

  const handleSOSClick = () => {
    setShowSOSConfirm(true);
    setSosPassword(generateRandomPassword());
    setUserInput('');
    setIsConfirmed(false);
    setShowTracking(false);
  };

  const handleConfirmSOS = () => {
    if (userInput === sosPassword) {
      setIsConfirmed(true);
      console.log('Emergency call initiated to nearest hospital');
    } else {
      alert('Incorrect code. Please try again.');
    }
  };

  const handleCancelSOS = () => {
    setIsConfirmed(false);
    setShowSOSConfirm(false);
    setShowTracking(false);
    console.log('SOS request cancelled');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Number copied to clipboard!');
  };

  const handleVideoCall = async () => {
    setShowVideoCall(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      startChatbot();
    } catch (err) {
      console.error('Error accessing camera:', err);
      setChatMessages([{ sender: 'bot', text: 'Error accessing camera. Please describe your emergency manually.' }]);
    }
  };

  const startChatbot = () => {
    setChatMessages([{ sender: 'bot', text: 'I’m your Emergency First Aid Assistant. Tell me what’s happening (e.g., snake bite, heart pain) so I can help you stay alive until help arrives.' }]);

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        if (!isMuted) {
          const transcript = event.results[event.results.length - 1][0].transcript;
          const corrected = autocorrectInput(transcript);
          setCorrectedInput(corrected);
          const newSuggestions = getSuggestions(corrected);
          setSuggestions(newSuggestions);
          setChatMessages(prev => [
            ...prev, 
            { sender: 'user', text: transcript }, 
            { sender: 'bot', text: corrected === 'pain' ? 'Please specify the type of pain:' : `Did you mean: ${corrected}?` }
          ]);
          if (corrected !== 'pain') {
            handleGeminiResponse(corrected);
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setChatMessages(prev => [...prev, { sender: 'bot', text: 'I couldn’t hear you. Please speak clearly or try again.' }]);
      };

      recognition.onend = () => {
        if (showVideoCall && !isMuted) recognition.start();
      };

      recognition.start();
      recognitionRef.current = recognition;
    } else {
      setChatMessages(prev => [...prev, { sender: 'bot', text: 'Speech recognition not supported. Please type your emergency.' }]);
    }
  };

  const handleGeminiResponse = async (userMessage) => {
    const prompt = `You are an emergency first aid assistant. The user is in a critical situation and needs immediate, life-saving steps to survive until an ambulance arrives. Based on the input, provide concise, point-form instructions without stars or hashes. Focus on critical emergencies like snake bites, heart attacks, severe bleeding, choking, or unconsciousness. If unclear, ask a short clarification question. No medical diagnosis or complex treatments—keep it simple and urgent.\n\nUser input: ${userMessage}`;

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      setChatMessages(prev => [...prev, { sender: 'bot', text: response }]);
    } catch (error) {
      console.error('Gemini API error:', error);
      setChatMessages(prev => [...prev, { sender: 'bot', text: 'Error connecting. Stay calm and call emergency services if possible.' }]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const updatedInput = correctedInput === 'pain' ? suggestion : `${correctedInput} ${suggestion}`;
    setCorrectedInput(updatedInput);
    setChatMessages(prev => [...prev, { sender: 'user', text: updatedInput }]);
    handleGeminiResponse(updatedInput);
    setSuggestions([]);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    if (recognitionRef.current) {
      if (isMuted) {
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
      }
    }
  };

  const closeVideoCall = () => {
    setShowVideoCall(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setChatMessages([]);
    setIsMuted(false);
    setSuggestions([]);
  };

  const handleTrackClick = () => {
    setShowTracking(true);
  };

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Emergency Services</h1>
        <p className="text-xl text-gray-600">Quick access to emergency medical assistance</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-red-50 rounded-2xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">SOS Emergency</h2>
            <p className="text-gray-600 mb-8">
              One tap to request immediate medical assistance
            </p>
            <button 
              onClick={handleSOSClick}
              className="w-full py-4 bg-red-500 text-white rounded-full text-xl font-semibold hover:bg-red-600 transition-colors"
            >
              Request Emergency Assistance
            </button>
            <p className="mt-4 text-sm text-gray-500">
              Your location will be automatically shared with emergency services
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Emergency Centers
            </h3>
            <input
              type="text"
              placeholder="Search by location..."
              className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.name}
                className="flex items-center justify-between py-3 border-b last:border-0 relative"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{hospital.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {hospital.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {hospital.time}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <button 
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => setShowDropdown(showDropdown === hospital.name ? null : hospital.name)}
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                    {showDropdown === hospital.name && (
                      <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-2 border z-10 min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <span>{hospital.phone}</span>
                          <Copy 
                            className="w-4 h-4 cursor-pointer hover:text-blue-500" 
                            onClick={() => copyToClipboard(hospital.phone)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg h-fit">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Emergency Contacts
          </h3>
          <div className="space-y-4">
            {Object.entries(emergencyContacts).map(([service, number]) => (
              <div key={service} className="relative">
                <button 
                  className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  onClick={() => setShowDropdown(showDropdown === service ? null : service)}
                >
                  <span className="font-medium">{service.charAt(0).toUpperCase() + service.slice(1)} Services</span>
                  <Phone className="w-5 h-5 text-blue-500" />
                </button>
                {showDropdown === service && (
                  <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-2 border z-10 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <span>{number}</span>
                      <Copy 
                        className="w-4 h-4 cursor-pointer hover:text-blue-500" 
                        onClick={() => copyToClipboard(number)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSOSConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            <button 
              onClick={() => setShowSOSConfirm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            {!isConfirmed ? (
              <>
                <h3 className="text-xl font-bold mb-4">Confirm Emergency Request</h3>
                <div className="mb-4">
                  <input type="checkbox" id="confirm" className="mr-2" />
                  <label htmlFor="confirm">Are you sure you want to request emergency assistance?</label>
                </div>
                <div className="mb-4">
                  <p className="text-lg font-mono bg-gray-100 p-2 rounded">{sosPassword}</p>
                  <p className="text-sm text-gray-500 mt-1">Enter this code to confirm</p>
                </div>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter code"
                  className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleConfirmSOS}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowSOSConfirm(false)}
                    className="flex-1 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">Emergency Request Sent</h3>
                <div className="bg-green-100 p-4 rounded-lg mb-4">
                  <p>Ambulance dispatched from {hospitals[0].name}</p>
                  <p className="text-sm text-gray-600">Tracking enabled</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-5 h-5 text-blue-500" />
                    <h4 className="font-semibold">Ambulance Details</h4>
                  </div>
                  <p><span className="font-medium">Driver:</span> {ambulanceDetails.driverName}</p>
                  <p><span className="font-medium">Vehicle:</span> {ambulanceDetails.vehicleNumber}</p>
                  <p><span className="font-medium">Contact:</span> {ambulanceDetails.contact}</p>
                  <p><span className="font-medium">ETA:</span> {ambulanceDetails.eta}</p>
                </div>
                {!showTracking ? (
                  <button
                    onClick={handleTrackClick}
                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4"
                  >
                    Track Ambulance
                  </button>
                ) : (
                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold mb-2">Tracking Status</h4>
                    <p><span className="font-medium">Status:</span> {trackingDetails.status}</p>
                    <p className="font-medium mt-2">Landmarks Crossed:</p>
                    <ul className="list-disc pl-5">
                      {trackingDetails.landmarksCrossed.map((landmark, index) => (
                        <li key={index} className="text-sm">{landmark}</li>
                      ))}
                    </ul>
                    <p className="mt-2"><span className="font-medium">ETA:</span> {trackingDetails.eta}</p>
                  </div>
                )}
                <button
                  onClick={handleVideoCall}
                  className="w-full py-3 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 mb-4"
                >
                  <Video className="w-5 h-5" />
                  Start Video Call with Doctor
                </button>
                <button
                  onClick={handleCancelSOS}
                  className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Cancel SOS
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showVideoCall && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl flex gap-4 relative">
            <button 
              onClick={closeVideoCall}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <div className="flex-1">
              <video ref={videoRef} autoPlay className="w-full rounded-lg bg-black" />
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={closeVideoCall}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  End Call
                </button>
                <button
                  onClick={toggleMute}
                  className={`px-4 py-2 ${isMuted ? 'bg-red-700' : 'bg-red-500'} text-white rounded-lg hover:bg-red-600 flex items-center gap-2`}
                >
                  <VolumeX className="w-5 h-5" />
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
              </div>
            </div>
            <div className="w-80 flex flex-col">
              <h3 className="text-lg font-semibold mb-2">Emergency First Aid Chatbot</h3>
              <div className="flex-1 bg-gray-100 rounded-lg p-4 overflow-y-auto max-h-[400px]">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`mb-2 ${msg.sender === 'bot' ? 'text-left' : 'text-right'}`}>
                    <span className={`inline-block p-2 rounded-lg ${msg.sender === 'bot' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {msg.text}
                    </span>
                  </div>
                ))}
                {suggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Suggestions (click to specify):</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-2 py-1 bg-blue-200 text-blue-800 rounded-lg hover:bg-blue-300"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Mic className={`w-6 h-6 ${isMuted ? 'text-gray-400' : 'text-blue-500'}`} />
                <span className="text-sm text-gray-500">
                  {isMuted ? 'Microphone muted' : 'Voice assistance active (Speak your emergency)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}