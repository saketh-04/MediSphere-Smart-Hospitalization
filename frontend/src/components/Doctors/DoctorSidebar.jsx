import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaUser, FaHeartbeat } from "react-icons/fa";

function Sidebar({ activePage, setActivePage }) {
  // Updated nav items
  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "appointments", label: "Appointments" },
    { id: "ehr", label: "EHR & Prescriptions" },
  ];

  // Check for a logged-in user from localStorage.
  const userEmail = localStorage.getItem("userEmail");
  const isLoggedIn = Boolean(userEmail);
  const userRole = localStorage.getItem("userRole") || "patient";

  // Set profile and dashboard links based on user role.
  const profileLink = userRole === "doctor" ? "/doctor/profile" : "/patient/profile";
  const dashboardLink = userRole === "doctor" ? "/doctor/dashboard" : "/patient/dashboard";

  return (
    <>
      {/* Motion.nav to replicate the Navbar styling */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 50 }}
        className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo: same as Navbar */}
            <div className="flex items-center gap-2">
              <FaHeartbeat className="text-blue-600 text-2xl" />
              <span className="text-xl font-bold">MediSphere</span>
            </div>

            {/* Navigation Links: spaced similarly to Navbar */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right side: if logged in, display profile icon; otherwise, show Sign In */}
            <div>
              {isLoggedIn ? (
                <Link to={profileLink}>
                  <FaUser className="text-2xl" />
                </Link>
              ) : (
                <Link to="/login" className="btn-primary">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Spacer so content doesn't hide behind the nav */}
      <div className="h-16"></div>
    </>
  );
}

export default Sidebar;
