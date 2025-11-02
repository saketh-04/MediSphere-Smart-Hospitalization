import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PatientProfile = () => {
  // State to hold fetched patient profile data.
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve the logged-in user's email from localStorage.
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (userEmail) {
      // Replace the endpoint URL with the actual endpoint that returns the patient profile.
      fetch("http://localhost:5000/patient/getByEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setPatient(data.data);
          } else {
            console.error("Failed to fetch profile:", data.message);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching profile:", error);
          setLoading(false);
        });
    } else {
      console.error("No user email found in localStorage.");
      setLoading(false);
    }
  }, [userEmail]);

  // Handler to log out the user.
  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  // Handler for close button click
  const handleClose = () => {
    window.location.href = '/user';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden relative"
      >
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md"
          aria-label="Close profile"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </motion.button>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-24 flex items-end">
          <div className="p-6 text-white">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold"
            >
              Patient Profile
            </motion.h1>
          </div>
        </div>

        <div className="p-8">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, staggerChildren: 0.1 }}
          >
            <ProfileItem 
              label="Name" 
              value={`${patient.fname} ${patient.lname}`}
              icon={
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              }
            />

            <ProfileItem 
              label="Medical ID" 
              value={patient.medID}
              icon={
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                </svg>
              }
            />

            <ProfileItem 
              label="Date of Birth" 
              value={new Date(patient.DOB).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              icon={
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              }
            />

            <ProfileItem 
              label="Email" 
              value={patient.email}
              icon={
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              }
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Log Out Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
      >
        Log Out
      </motion.button>
    </div>
  );
};

// Reusable profile item component with hover effect
const ProfileItem = ({ label, value, icon }) => {
  return (
    <motion.div 
      className="flex items-start p-4 rounded-lg hover:bg-blue-50 transition-colors duration-300"
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }}
    >
      <div className="flex-shrink-0 mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
};

export default PatientProfile;