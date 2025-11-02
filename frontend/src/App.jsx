import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Home/Navbar.jsx";
import PatientProfilePage from "./components/profilePat.jsx";
import DoctorProfile from "./components/profileDoc.jsx";
import Hero from "./components/Home/Hero.jsx";
import Services from "./components/Home/Services.jsx";
import WhyUs from "./components/Home/WhyUs.jsx";
import Doctors from "./components/Home/Doctors.jsx";
import Consultation from "./components/Home/Consultation.jsx";
import Footer from "./components/Home/Footer.jsx";
import Appointments from "./components/Appointments.jsx";
import Servicesrea from "./components/ServicesReal.jsx";
import Pharmacy from "./components/Pharmacy.jsx";
import Emergency from "./components/Emergency.jsx";
import LabTests from "./components/Labtests.jsx";
import RoleBasedLogin from "./components/login.jsx";
import DocDashboard from "./components/Doctors/DoctorDashboard.jsx";
import Sidebar from "./components/Doctors/DoctorSidebar.jsx";
import CommunicationDoc from "./components/Doctors/DoctorCommunication.jsx";
import EHRDoc from "./components/Doctors/DoctorEHR.jsx";
import BillingDoc from "./components/Doctors/DoctorBilling.jsx";
import AppointmentsWithPrescription from "./components/Doctors/DoctorAppointments.jsx";
import EHRUsr from "./components/EHRUser.jsx";
import PrescriptionForm from "./components/Doctors/DoctorPrescription.jsx";
import NotificationBox from "./components/Notifications.jsx";
import Chatbot from "./components/Chatbot.jsx";
import LabTestDashboard from "./components/Labs/LabTestDash.jsx";
import SignInPage from "./components/Labs/LabSign.jsx";

const DoctorLayout = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");

  const handlePageChange = (page) => {
    setActivePage(page);
    navigate(`/doctor/${page}`);
  };

  return (
    <div className="flex">
      {/* Sidebar Always Visible for Doctor Pages */}
      <Sidebar activePage={activePage} setActivePage={handlePageChange} />
      {/* Main Content */}
      <div className="flex-grow p-6 mt-20 ml-20 mr-20">
        <Routes>
          <Route path="" element={<DocDashboard />} />
          <Route path="appointments" element={<AppointmentsWithPrescription />} />
          <Route path="dashboard" element={<DocDashboard />} />
          <Route path="ehr" element={<EHRDoc />} />
          <Route path="billing" element={<BillingDoc />} />
          <Route path="communication" element={<CommunicationDoc />} />
          <Route path="prescription" element={<PrescriptionForm />} />
        </Routes>
      </div>
    </div>
  );
};

function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <WhyUs />
      <Doctors />
      <Consultation />
    </>
  );
}

function AppContent() {
  const location = useLocation();

  // Check if we are in the /doctor or /lab pages
  const isDoctorPage = location.pathname.startsWith("/doctor");
  const isLabPage = location.pathname.startsWith("/lab");

  // Show the Navbar unless we are on /doctor or /lab pages
  const showNavbar = !isDoctorPage && !isLabPage;
  
  // Show NotificationBox and Chatbot only if not on /login or /lab pages
  const showExtras = location.pathname !== "/login" && !isLabPage;
  
  // Show Footer on all pages except /lab
  const showFooter = !isLabPage;

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "pt-16" : ""}>
        <Routes>
          <Route path="/login" element={<RoleBasedLogin />} />
          <Route path="/patient/profile" element={<PatientProfilePage />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<HomePage />} />
          <Route path="/user/appointments" element={<Appointments />} />
          <Route path="/user/services" element={<Servicesrea />} />
          <Route path="/user/services/pharmacy" element={<Pharmacy />} />
          <Route path="/user/services/emergency" element={<Emergency />} />
          <Route path="/user/services/labtests" element={<LabTests />} />
          <Route path="/doctor/*" element={<DoctorLayout />} />
          <Route path="/user/ehr" element={<EHRUsr />} />
          <Route path="/lab/dash" element={<LabTestDashboard />} />
          <Route path="/lab/sign" element={<SignInPage />} />
        </Routes>

        {/* Show NotificationBox and Chatbot only if not on /login or /lab pages */}
        {showExtras && (
          <>
            <NotificationBox />
            <Chatbot />
          </>
        )}

        {/* Show Footer unless it's a /lab page */}
        {showFooter && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
