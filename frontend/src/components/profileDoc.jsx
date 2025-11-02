import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DoctorProfile = () => {
  // State to hold fetched doctor profile data.
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve the logged-in doctor's email from localStorage.
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (userEmail) {
      // Replace with the actual endpoint that returns the doctor profile.
      fetch("http://localhost:5000/doctor/getByEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setDoctor(data.data);
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

  // Handler to log out the doctor.
  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 flex flex-col items-center justify-center p-4 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden relative"
      >
        {/* Close Button - Now positioned relative to the form */}
        <Link to="/doctor/dashboard" className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300">
          <FaTimes className="w-6 h-6 text-gray-700 hover:text-red-500 transition-colors duration-300" />
        </Link>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-24 flex items-end">
          <div className="p-6 text-white">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold"
            >
              Doctor Profile
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
              value={`${doctor.fname} ${doctor.lname}`}
              icon={
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              }
            />

            <ProfileItem 
              label="Date of Birth" 
              value={new Date(doctor.DOB).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              icon={
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              }
            />

            <ProfileItem 
              label="Medical License Number" 
              value={doctor.MLN}
              icon={
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              }
            />

            <ProfileItem 
              label="Specialization" 
              value={doctor.Specilzation}
              icon={
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              }
            />

            <ProfileItem 
              label="Email" 
              value={doctor.email}
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

export default DoctorProfile;