import { motion } from "framer-motion";
import { FaHeartbeat, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar() {
  // Check for a logged-in user by reading from localStorage.
  const userEmail = localStorage.getItem("userEmail");
  const isLoggedIn = Boolean(userEmail);
  // Optionally, retrieve the user's role from localStorage (default to "patient").
  const userRole = localStorage.getItem("userRole") || "patient";

  // Determine the profile page route based on the user's role.
  const profileLink = userRole === "doctor" ? "/doctor/profile" : "/patient/profile";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 50 }}
      className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <FaHeartbeat className="text-blue-600 text-2xl" />
            <span className="text-xl font-bold">MediSphere</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/user" className="nav-link">Home</Link>
            <Link to="/user/appointments" className="nav-link">Appointments</Link>
            <Link to="/user/ehr" className="nav-link">EHR</Link>
            <Link to="/user/services" className="nav-link">Services</Link>
          </div>

          {/* Display profile icon if logged in, else Sign In button */}
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
  );
}

export default Navbar;
