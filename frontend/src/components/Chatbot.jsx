import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, Mic } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detailedResponse, setDetailedResponse] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [spellSuggestions, setSpellSuggestions] = useState(null);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [voiceCorrection, setVoiceCorrection] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const genAI = new GoogleGenerativeAI('AIzaSyCOwa9U5_I5H8ZMT9pgH3TxfgC7-c5DxyA');

  const dictionary = [
    'medicine', 'healthcare', 'disease', 'treatment', 'symptoms', 'diagnosis',
    'prescription', 'therapy', 'surgery', 'hospital', 'doctor', 'nurse',
    'patient', 'pharmacy', 'medication', 'vaccine', 'infection', 'virus',
    'bacteria', 'antibiotic', 'pain', 'fever', 'cough', 'headache', 'nausea',
    'fatigue', 'allergy', 'asthma', 'diabetes', 'cancer', 'stroke', 'heart',
    'lung', 'kidney', 'liver', 'blood', 'immune', 'chronic', 'acute',
    'inflammation', 'injury', 'fracture', 'arthritis', 'depression', 'anxiety',
    'hypertension', 'cholesterol', 'obesity', 'malaria', 'tuberculosis',
    'hepatitis', 'pneumonia', 'influenza', 'migraine', 'seizure', 'epilepsy',
    'dementia', 'alzheimer', 'parkinson', 'thyroid', 'hormone', 'insulin',
    'syringe', 'injection', 'tablet', 'capsule', 'ointment', 'saline',
    'bandage', 'stethoscope', 'thermometer', 'pulse', 'oxygen', 'respirator',
    'ventilator', 'catheter', 'dialysis', 'transplant', 'biopsy', 'radiology',
    'ultrasound', 'xray', 'mri', 'ctscan', 'endoscopy', 'chemotherapy',
    'radiation', 'immunotherapy', 'surgical', 'anesthesia', 'sedation',
    'recovery', 'rehabilitation', 'physiotherapy', 'pathology', 'laboratory',
    'specimen', 'culture', 'microscope', 'genetics', 'dna', 'rna', 'mutation',
    'virology', 'epidemiology', 'pandemic', 'endemic', 'outbreak',
    'quarantine', 'prognosis', 'mortality', 'morbidity', 'incidence',
    'prevalence', 'screening', 'prevention', 'wellness', 'nutrition', 'diet',
    'vitamin', 'mineral', 'supplement', 'exercise', 'cardiology', 'neurology',
    'oncology', 'pediatrics', 'geriatrics', 'psychiatry', 'dermatology',
    'orthopedics', 'ophthalmology', 'ent', 'gastroenterology', 'urology',
    'gynecology', 'obstetrics', 'neonatology', 'allergen', 'antigen',
    'antibody', 'immunization', 'parasite', 'fungus', 'trauma', 'emergency',
    'ambulance', 'triage', 'intensive', 'icu', 'ward', 'outpatient',
    'inpatient', 'consultation', 'referral', 'specialist', 'generalist',
    'clinic', 'disorder', 'syndrome', 'condition', 'relapse', 'remission',
    'sideeffect', 'adverse', 'dosage', 'overdose', 'addiction', 'withdrawal',
    'placebo', 'trial', 'research', 'study', 'clinical', 'evidence', 'protocol',
    'ethics', 'consent', 'pharmaceutical', 'drug', 'generic', 'brand',
    'formulation', 'metabolism', 'excretion', 'absorption', 'bioavailability',
    'toxicology', 'poison', 'antidote', 'sterile', 'aseptic', 'disinfectant',
    'sanitizer', 'prosthesis', 'implant', 'pacemaker', 'defibrillator', 'stent',
    'suture', 'incision', 'lesion', 'ulcer', 'edema', 'swelling', 'rash',
    'itch', 'bleeding', 'clot', 'hemorrhage', 'anemia', 'leukemia', 'lymphoma',
    'antibiotics', 'antiviral', 'antifungal', 'antidepressant', 'antihistamine',
    'analgesic', 'anticoagulant', 'bronchitis', 'cirrhosis', 'colitis',
    'concussion', 'constipation', 'diarrhea', 'eczema', 'emphysema',
    'endocarditis', 'gastritis', 'glaucoma', 'gout', 'hernia', 'hypoglycemia',
    'hyperglycemia', 'immunodeficiency', 'jaundice', 'laryngitis', 'melanoma',
    'meningitis', 'myocarditis', 'nephritis', 'osteoporosis', 'pancreatitis',
    'pharyngitis', 'psoriasis', 'rabies', 'rheumatism', 'schizophrenia',
    'sciatica', 'sinusitis', 'tendonitis', 'tonsillitis', 'urticaria',
    'varicose', 'vertigo', 'bloodpressure', 'electrocardiogram', 'colonoscopy',
    'echocardiogram', 'laparoscopy', 'mammogram', 'vaccination', 'antiseptic',
    'contusion', 'dislocation', 'embolism', 'encephalitis', 'fibromyalgia',
    'hematology', 'homeopathy', 'infusion', 'laceration', 'leprosy',
    'metastasis', 'neurosurgery', 'palpitation', 'perfusion', 'pleurisy',
    'psychosis', 'pulmonary', 'radiotherapy', 'resuscitation', 'sclerosis',
    'tachycardia', 'thrombosis', 'toxicology', 'ulceration', 'vasectomy'
  ];

  const medicalPhrases = [
    "What are the symptoms of diabetes?",
    "How is heart disease treated?",
    "What causes chronic pain?",
    "Can you explain cancer treatment options?",
    "What is the prognosis for pneumonia?",
    "How does hypertension affect the body?",
    "What are the side effects of chemotherapy?",
    "How to manage asthma symptoms?",
    "What is the recovery time for surgery?",
    "How does insulin work in diabetes?",
    "What are the signs of a stroke?",
    "How is arthritis diagnosed?",
    "What causes kidney failure?",
    "How to prevent influenza?",
    "What are the treatments for depression?",
    "How does a heart attack feel?",
    "What is the purpose of dialysis?",
    "How to recognize an allergic reaction?",
    "What causes migraines?",
    "How is tuberculosis transmitted?",
    "What are the symptoms of hepatitis?",
    "How does chemotherapy work?",
    "What is the treatment for osteoporosis?",
    "How to manage high cholesterol?",
    "What causes thyroid problems?",
    "How is epilepsy diagnosed?",
    "What are the side effects of antibiotics?",
    "How to treat a fever?",
    "What is the prognosis for leukemia?",
    "How does radiation therapy work?",
    "What are the symptoms of meningitis?",
    "How to prevent heart disease?",
    "What causes stomach ulcers?",
    "How is glaucoma treated?",
    "What are the signs of dehydration?",
    "How does immunotherapy work?",
    "What is the recovery time for a fracture?",
    "How to manage chronic fatigue?",
    "What causes autoimmune diseases?",
    "How is pneumonia diagnosed?",
    "What are the symptoms of anxiety?",
    "How to treat skin infections?",
    "What is the purpose of an MRI?",
    "How does blood pressure affect health?",
    "What causes respiratory infections?",
    "How is colonoscopy performed?",
    "What are the symptoms of a concussion?",
    "How to prevent malaria?",
    "What is the treatment for gout?",
    "How does physical therapy help recovery?",
    "What causes liver cirrhosis?",
    "How is eczema treated?",
    "What are the signs of hypoglycemia?"
  ];

  // KMP Algorithm for Autocomplete
  const computeLPSArray = (pattern) => {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
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
    let i = 0; // index for text
    let j = 0; // index for pattern

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

  const getAutocompleteSuggestions = (input) => {
    if (!input.trim()) return [];
    const lowerInput = input.toLowerCase();

    // First, try prefix matching for exact starts
    const prefixMatches = medicalPhrases
      .filter(phrase => phrase.toLowerCase().startsWith(lowerInput))
      .slice(0, 3);

    // If we have less than 3 prefix matches, supplement with KMP substring matches
    if (prefixMatches.length < 3) {
      const substringMatches = medicalPhrases
        .filter(phrase => {
          const lowerPhrase = phrase.toLowerCase();
          return !lowerPhrase.startsWith(lowerInput) && KMPSearch(lowerPhrase, lowerInput);
        })
        .slice(0, 3 - prefixMatches.length);
      return [...prefixMatches, ...substringMatches];
    }

    return prefixMatches;
  };

  // Rabin-Karp Spell Check
  const rabinKarpSpellCheck = (text) => {
    const d = 256;
    const q = 101;
    const words = text.split(' ');
    const suggestions = [];

    words.forEach(word => {
      if (word.length < 3) return;
      let isCorrect = false;
      const patternHash = calculateHash(word, word.length, d, q);

      for (let dictWord of dictionary) {
        if (dictWord.length !== word.length) continue;
        const textHash = calculateHash(dictWord, dictWord.length, d, q);
        if (patternHash === textHash && dictWord === word) {
          isCorrect = true;
          break;
        }
      }

      if (!isCorrect) {
        const similarWords = findSimilarWords(word);
        if (similarWords.length > 0) {
          suggestions.push({ word, suggestions: similarWords });
        }
      }
    });

    return suggestions.length > 0 ? suggestions : null;
  };

  const calculateHash = (str, len, d, q) => {
    let hash = 0;
    for (let i = 0; i < len; i++) {
      hash = (d * hash + str.charCodeAt(i)) % q;
    }
    return hash;
  };

  const findSimilarWords = (word) => {
    const suggestions = [];
    dictionary.forEach(dictWord => {
      if (Math.abs(dictWord.length - word.length) <= 2) {
        const distance = levenshteinDistance(word, dictWord);
        if (distance <= 2) {
          suggestions.push(dictWord);
        }
      }
    });
    return suggestions.slice(0, 3);
  };

  const levenshteinDistance = (a, b) => {
    const matrix = Array(b.length + 1).fill(null).map(() =>
      Array(a.length + 1).fill(null)
    );

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputMessage(text);

    if (text.trim()) {
      clearTimeout(window.spellCheckTimeout);
      window.spellCheckTimeout = setTimeout(() => {
        const suggestions = rabinKarpSpellCheck(text.toLowerCase());
        setSpellSuggestions(suggestions);
        const autoSuggestions = getAutocompleteSuggestions(text);
        setAutocompleteSuggestions(autoSuggestions);
      }, 500);
    } else {
      setSpellSuggestions(null);
      setAutocompleteSuggestions([]);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    setSpellSuggestions(null);
    setAutocompleteSuggestions([]);
    setVoiceCorrection(null);

    const userMessage = {
      role: 'user',
      content: `You are a medical AI assistant. Your task is to provide responses strictly related to healthcare, 
      medicine, diseases, treatments, symptoms, medical research, and related topics. If the user's question is unrelated 
      to medicine, politely respond with: "I'm a medical AI and can only provide information on healthcare-related topics." 
      Ensure that your response remains within the medical domain at all times.\n\nUser's question: ${inputMessage.trim()}`
    };

    setMessages(prev => [...prev, { role: 'user', content: inputMessage.trim() }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const chat = model.startChat();
      const result = await chat.sendMessage(userMessage.content);
      const response = await result.response;
      let fullResponse = response.text();
      let shortResponse = fullResponse.split('. ').slice(0, 3).join('. ') + '.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: shortResponse }]);
      setDetailedResponse(fullResponse);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'I encountered an error. Try again!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailedResponse = () => {
    setMessages(prev => [...prev, { role: 'assistant', content: detailedResponse }]);
    setDetailedResponse(null);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setInputMessage('');
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }
        setInputMessage(prev => prev + finalTranscript);
        const suggestions = rabinKarpSpellCheck(finalTranscript.toLowerCase());
        if (suggestions) {
          setVoiceCorrection(suggestions);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setInputMessage('Error with voice recognition. Please try again.');
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome or another supported browser.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const words = inputMessage.split(' ');
    const corrected = words.map(w => {
      const misspelled = spellSuggestions?.find(s => s.word === w.toLowerCase());
      return misspelled && suggestion === misspelled.suggestions[0] ? suggestion : w;
    });
    setInputMessage(corrected.join(' '));
    setSpellSuggestions(null);
  };

  const handleAutocompleteClick = (suggestion) => {
    // Update inputMessage with the selected suggestion and clear suggestions
    setInputMessage(suggestion);
    setAutocompleteSuggestions([]); // Clear suggestions after selection
    // Do not call handleSendMessage here; let the user send manually
  };

  const handleVoiceCorrectionClick = (suggestion) => {
    const words = inputMessage.split(' ');
    const corrected = words.map(w => {
      const misspelled = voiceCorrection?.find(s => s.word === w.toLowerCase());
      return misspelled && suggestion === misspelled.suggestions[0] ? suggestion : w;
    });
    setInputMessage(corrected.join(' '));
    setVoiceCorrection(null);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <MessageSquare className="text-blue-600" size={24} />
              <h3 className="font-semibold text-gray-800">MediSphere Assistant</h3>
            </div>
            <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto max-h-[400px] space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500">
                <p>👋 Hello! How can I assist you today?</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Loader2 className="animate-spin" size={20} />
                </div>
              </div>
            )}
            {detailedResponse && (
              <div className="flex justify-start">
                <button
                  onClick={handleDetailedResponse}
                  className="text-blue-600 text-sm underline mt-2"
                >
                  Want a detailed explanation?
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t relative">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder={isRecording ? "Listening..." : "Type your message..."}
                className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-full ${isRecording ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-600'} hover:bg-blue-300`}
                disabled={isLoading}
              >
                <Mic size={20} />
              </button>
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </div>
            {spellSuggestions && (
              <div className="absolute bottom-16 left-4 bg-white border rounded-lg shadow-lg p-2 z-50">
                {spellSuggestions.map((item, index) => (
                  <div key={index} className="py-1">
                    <p className="text-sm text-gray-600">Did you mean:</p>
                    {item.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left text-blue-600 hover:bg-gray-100 px-2 py-1 rounded"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ))}
                <button
                  onClick={() => setSpellSuggestions(null)}
                  className="text-sm text-gray-500 hover:text-gray-700 mt-1"
                >
                  Dismiss
                </button>
              </div>
            )}
            {autocompleteSuggestions.length > 0 && (
              <div className="absolute bottom-16 left-4 bg-white border rounded-lg shadow-lg p-2 z-50">
                <p className="text-sm text-gray-600">Suggestions:</p>
                {autocompleteSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleAutocompleteClick(suggestion)}
                    className="block w-full text-left text-blue-600 hover:bg-gray-100 px-2 py-1 rounded"
                  >
                    {suggestion}
                  </button>
                ))}
                <button
                  onClick={() => setAutocompleteSuggestions([])}
                  className="text-sm text-gray-500 hover:text-gray-700 mt-1"
                >
                  Dismiss
                </button>
              </div>
            )}
            {voiceCorrection && (
              <div className="absolute bottom-16 left-4 bg-white border rounded-lg shadow-lg p-2 z-50">
                {voiceCorrection.map((item, index) => (
                  <div key={index} className="py-1">
                    <p className="text-sm text-gray-600">Did you mean (voice correction):</p>
                    {item.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleVoiceCorrectionClick(suggestion)}
                        className="block w-full text-left text-blue-600 hover:bg-gray-100 px-2 py-1 rounded"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ))}
                <button
                  onClick={() => setVoiceCorrection(null)}
                  className="text-sm text-gray-500 hover:text-gray-700 mt-1"
                >
                  Dismiss
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;