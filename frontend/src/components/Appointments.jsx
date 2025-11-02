import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FaUserMd, FaCalendarCheck, FaMapMarkerAlt, FaClock, 
  FaAward, FaLinkedin, FaTwitter, FaFacebook, FaCheck 
} from 'react-icons/fa';

function Appointments() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Doctors');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Get user's email and medID from localStorage
  const storedEmail = localStorage.getItem('userEmail') || '';
  const storedMedID = localStorage.getItem('medID') || 'MED20253';

  // Appointment form state: email and patientID are auto-populated from localStorage.
  const [formData, setFormData] = useState({
    doctorID: '',
    patientID: storedMedID,
    email: storedEmail, 
    date: '',
    time: '',
    patientName: '',
    phoneNO: '',
    reasonVisit: 'Annual checkup'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Specialties for filtering
  const specialties = [
    'All Doctors',
    'General Physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatrician',
    'Neurologist',
    'Gastroenterologist'
  ];

  // Fetch doctors on mount
  useEffect(() => {
    fetch("http://localhost:5000/doctor/getAll", {
      method: "POST",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setDoctors(data.data);
        } else {
          console.error("Failed to fetch doctors:", data.message);
        }
        setLoadingDoctors(false);
      })
      .catch(err => {
        console.error("Error fetching doctors:", err);
        setLoadingDoctors(false);
      });
  }, []);

  // Filter doctors by Specilzation (as provided in the backend)
  const filteredDoctors = doctors.filter((doctor) => {
    const docSpec = doctor.Specilzation || '';
    return selectedSpecialty === 'All Doctors' || docSpec === selectedSpecialty;
  });

  // Helper: map doctor index to doc1.png ... doc15.png
  const getDoctorImageName = (index) => {
    const imageIndex = index < 15 ? index + 1 : 15;
    return `/images/doc${imageIndex}.png`;
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/appointment/createappointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.message || 'An error occurred');
        setMessage('');
      } else {
        setError('');
        // Animate tick symbol for 2 seconds
        setMessage('Booking Successful');
        setTimeout(() => {
          setMessage('');
        }, 2000);
        // Reset form but keep the email and patientID from localStorage
        setFormData({
          doctorID: '',
          patientID: storedMedID,
          email: storedEmail,
          date: '',
          time: '',
          patientName: '',
          phoneNO: '',
          reasonVisit: 'Annual checkup'
        });
      }
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError('An error occurred');
      setMessage('');
    }
  };

  // "Book Now" -> show detail view and set doctorID as the doctor's MLN
  const handleBookNow = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingForm(true);
    // Set doctorID to MLN instead of _id
    setFormData((prev) => ({ ...prev, doctorID: doctor.MLN }));
    window.scrollTo(0, 0);
  };

  // Return to doctor grid
  const handleBackToList = () => {
    setSelectedDoctor(null);
    setShowBookingForm(false);
  };

  // Loading state
  if (loadingDoctors) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading doctors...</p>
      </div>
    );
  }

  // Detailed view when a doctor is selected
  if (selectedDoctor) {
    const selectedIndex = doctors.findIndex((d) => d._id === selectedDoctor._id);
    const imageSrc = getDoctorImageName(selectedIndex);

    const docLocation = selectedDoctor.Location || 'No location provided';
    const docExperience = selectedDoctor.Experience || 'N/A';
    const docQualifications = selectedDoctor.Qualifications || 'N/A';
    const docWorkingHours = selectedDoctor.workingHours || 'N/A';
    const docAbout = selectedDoctor.About || 'No information provided.';
    const docSpecial = selectedDoctor.Special || 'N/A';

    return (
      <div className="flex justify-center min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <button 
            onClick={handleBackToList}
            className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>← Back to doctors list</span>
          </button>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1 bg-gray-50 p-8">
                <div className="flex flex-col items-center">
                  <img 
                    src={imageSrc}
                    alt={`${selectedDoctor.fname} ${selectedDoctor.lname}`} 
                    className="w-64 h-64 object-cover rounded-full mb-6 border-4 border-white shadow-lg"
                  />
                  <h2 className="text-3xl font-bold mb-2">
                    {selectedDoctor.fname} {selectedDoctor.lname}
                  </h2>
                  <p className="text-gray-600 text-xl mb-6">
                    {selectedDoctor.Specilzation}
                  </p>
                  
                  <div className="w-full space-y-4 mt-4">
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-gray-500" />
                      <span>{docLocation}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaAward className="text-gray-500" />
                      <span>Experience: {docExperience}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaUserMd className="text-gray-500" />
                      <span>Qualifications: {docQualifications}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaClock className="text-gray-500" />
                      <span>Working hours: {docWorkingHours}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-8">
                    <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                      <FaLinkedin className="text-gray-700" />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                      <FaTwitter className="text-gray-700" />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                      <FaFacebook className="text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Details and booking form */}
              <div className="md:col-span-2 p-8">
                <div className="space-y-8">
                  <section>
                    <h3 className="text-2xl font-bold mb-4">About</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {docAbout}
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-2xl font-bold mb-4">Special</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {docSpecial}
                    </p>
                  </section>
                  
                  {showBookingForm ? (
                    <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-4">Book an Appointment</h3>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-gray-700 mb-2">Select Date</label>
                          <input 
                            type="date" 
                            name="date" 
                            value={formData.date}
                            onChange={handleFormChange}
                            className="w-full p-3 border rounded-lg"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Select Time</label>
                          <select 
                            name="time" 
                            value={formData.time} 
                            onChange={handleFormChange} 
                            className="w-full p-3 border rounded-lg"
                            required
                          >
                            <option value="">Select a time</option>
                            <option value="09:00">09:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="13:00">01:00 PM</option>
                            <option value="14:00">02:00 PM</option>
                            <option value="15:00">03:00 PM</option>
                            <option value="16:00">04:00 PM</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Your Name</label>
                          <input 
                            type="text" 
                            name="patientName" 
                            value={formData.patientName}
                            onChange={handleFormChange}
                            className="w-full p-3 border rounded-lg"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Phone Number</label>
                          <input 
                            type="tel"
                            name="phoneNO"
                            value={formData.phoneNO}
                            onChange={handleFormChange}
                            className="w-full p-3 border rounded-lg"
                            required
                            pattern="[0-9]{10}"
                            title="Phone number must be 10 digits"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Reason for Visit</label>
                          <textarea 
                            name="reasonVisit" 
                            value={formData.reasonVisit}
                            onChange={handleFormChange}
                            className="w-full p-3 border rounded-lg"
                            rows="3"
                            required
                          ></textarea>
                        </div>
                        <button 
                          type="submit" 
                          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                          Confirm Booking
                        </button>
                      </form>
                      {message && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                          transition={{ duration: 2 }}
                          className="flex items-center justify-center mt-4"
                        >
                          <FaCheck className="text-green-500 text-3xl" />
                        </motion.div>
                      )}
                      {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowBookingForm(true)} 
                      className="mt-8 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <FaCalendarCheck />
                      Book an Appointment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view when no doctor is selected
  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Browse through doctor specialists</h1>
          <p className="text-xl text-gray-600">Find the right specialist for your needs</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Specialties Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            {specialties.map((specialty) => (
              <motion.button
                key={specialty}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                  selectedSpecialty === specialty
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white hover:bg-blue-50 text-gray-700'
                }`}
              >
                {specialty}
              </motion.button>
            ))}
          </motion.div>

          {/* Doctors Grid */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" >
            {filteredDoctors.map((doctor, index) => {
              const imageSrc = getDoctorImageName(index);
              const docLocation = doctor.Location || 'No location provided';
              return (
                <motion.div
                  key={doctor._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative">
                    <img
                      src={imageSrc}
                      alt={`${doctor.fname} ${doctor.lname}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {doctor.fname} {doctor.lname}
                    </h3>
                    <p className="text-gray-600 mb-2">{doctor.Specilzation}</p>
                    <p className="text-gray-500 text-sm mb-4">{docLocation}</p>
                    <button 
                      onClick={() => handleBookNow(doctor)}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaCalendarCheck />
                      Book Now
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointments;
