import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  FaHeartbeat, FaUserMd, FaUser, FaEnvelope, FaLock, 
  FaPhone, FaCalendar, FaIdCard, FaGraduationCap, FaHospital,
  FaMapMarkerAlt, FaAward, FaClock, FaTint
} from 'react-icons/fa';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('patient');
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Updated form state with additional fields.
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    phNo: '',
    DOB: '',
    email: '',
    password: '',
    MLN: '',
    Specilzation: '',
    hospital: '',
    Location: '',
    Experience: '',
    Qualifications: '',
    workingHours: '',
    About: '',
    Special: '',
    bloodType: ''
  });

  // Helper to update formData
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Redirect function updates localStorage and then redirects.
  // For labassistant, the credentials are hardcoded.
  const redirectAfterLogin = (userData) => {
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userRole', userType);

    if (userType === 'doctor') {
      localStorage.setItem('MLN', userData.MLN);
      localStorage.setItem('medID', userData.MLN);
      window.location.href = '/doctor';
    } else if (userType === 'labassistant') {
      window.location.href = '/lab/dash';
    } else {
      localStorage.setItem('medID', userData.medID);
      window.location.href = '/user';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // For labassistant, use hardcoded login logic
    if (userType === 'labassistant') {
      if (isLogin) {
        if (
          formData.email === 'pavanvignesh184@gmail.com' &&
          formData.password === '123'
        ) {
          redirectAfterLogin({ email: formData.email });
        } else {
          alert('Invalid lab assistant credentials');
        }
      } else {
        alert('Lab assistant sign up is not available');
      }
      return;
    }

    // For patients and doctors, determine endpoint based on userType and mode
    let endpoint = '';
    if (userType === 'doctor') {
      endpoint = isLogin
        ? 'http://localhost:5000/doctor/checkDoctorSign'
        : 'http://localhost:5000/doctor/createDoctorSign';
    } else {
      // userType === 'patient'
      endpoint = isLogin
        ? 'http://localhost:5000/patient/checkPatientSign'
        : 'http://localhost:5000/patient/createPatientSign';
    }

    if (isLogin) {
      // LOGIN: Only email and password are required.
      const payload = { email: formData.email, password: formData.password };

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          console.log("Login successful:", data);
          redirectAfterLogin(data.data);
        } else {
          console.error("Login failed:", data.message);
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    } else {
      // SIGN UP: Use full form data payload.
      const payload = { ...formData };

      // Remove doctor-specific fields for patient sign-up.
      if (userType === 'patient') {
        delete payload.MLN;
        delete payload.Specilzation;
        delete payload.hospital;
        delete payload.Location;
        delete payload.Experience;
        delete payload.Qualifications;
        delete payload.workingHours;
        delete payload.About;
        delete payload.Special;
      }

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          console.log("Sign up successful:", data);
          setSignupSuccess(true);
        } else {
          console.error("Sign up failed:", data.message);
        }
      } catch (error) {
        console.error("Error during sign up:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side - Info Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-600 p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800"
              alt="Medical Team"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500/90"></div>
          </div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-12">
              <FaHeartbeat className="text-white text-3xl" />
              <span className="text-2xl font-bold text-white">MediSphere</span>
            </div>
            <div className="flex-grow">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Expert Specialists at Your Service
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Our team of dedicated healthcare professionals brings years of experience and compassionate care to every patient interaction.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-4"
                >
                  <h3 className="font-semibold text-white mb-2">5000+ Doctors</h3>
                  <p className="text-sm text-blue-100">Verified healthcare professionals</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-4"
                >
                  <h3 className="font-semibold text-white mb-2">24/7 Care</h3>
                  <p className="text-sm text-blue-100">Always available for you</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login/Signup Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              {isLogin 
                ? (userType === 'doctor' 
                    ? 'Doctor Login' 
                    : userType === 'labassistant'
                      ? 'Lab Assistant Login'
                      : 'Patient Login'
                  )
                : (userType === 'doctor' 
                    ? 'Create Doctor Account' 
                    : userType === 'labassistant'
                      ? 'Create Lab Assistant Account'
                      : 'Create Patient Account'
                  )
              }
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Account Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                {/* Patient */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserType('patient')}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    userType === 'patient'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <FaUser className="mx-auto mb-2 text-xl" />
                  <span className="block text-sm font-medium">Patient</span>
                </motion.button>
                {/* Doctor */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserType('doctor')}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    userType === 'doctor'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <FaUserMd className="mx-auto mb-2 text-xl" />
                  <span className="block text-sm font-medium">Doctor</span>
                </motion.button>
                {/* Lab Assistant */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserType('labassistant')}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    userType === 'labassistant'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <FaUser className="mx-auto mb-2 text-xl" />
                  <span className="block text-sm font-medium">Lab Assistant</span>
                </motion.button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Login fields */}
                {isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="email" 
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="password" 
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <motion.div
                initial={false}
                animate={{ height: 'auto' }}
                className="space-y-4 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2"
              >
                {/* Additional fields for sign-up */}
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.fname}
                            onChange={(e) => handleChange('fname', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.lname}
                            onChange={(e) => handleChange('lname', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="tel" 
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.phNo}
                          onChange={(e) => handleChange('phNo', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <div className="relative">
                        <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="date" 
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.DOB}
                          onChange={(e) => handleChange('DOB', e.target.value)}
                        />
                      </div>
                    </div>
                    {/* Doctor-specific fields */}
                    {userType === 'doctor' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Medical License Number</label>
                          <div className="relative">
                            <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                              type="text" 
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={formData.MLN}
                              onChange={(e) => handleChange('MLN', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                          <div className="relative">
                            <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select 
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={formData.Specilzation}
                              onChange={(e) => handleChange('Specilzation', e.target.value)}
                            >
                              <option value="">Select Specialization</option>
                              <option value="cardiology">Cardiology</option>
                              <option value="dermatology">Dermatology</option>
                              <option value="neurology">Neurology</option>
                              <option value="pediatrics">Pediatrics</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Hospital/Clinic</label>
                          <div className="relative">
                            <FaHospital className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                              type="text" 
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={formData.hospital}
                              onChange={(e) => handleChange('hospital', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                          <div className="relative">
                            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                              type="text" 
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={formData.Location}
                              onChange={(e) => handleChange('Location', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                          <div className="relative">
                            <FaAward className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                              type="text" 
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={formData.Experience}
                              onChange={(e) => handleChange('Experience', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                          <div className="relative">
                            <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                              type="text" 
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={formData.Qualifications}
                              onChange={(e) => handleChange('Qualifications', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
                          <div className="relative">
                            <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                              type="text" 
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={formData.workingHours}
                              onChange={(e) => handleChange('workingHours', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                          <textarea 
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="3"
                            value={formData.About}
                            onChange={(e) => handleChange('About', e.target.value)}
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Special</label>
                          <textarea 
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="2"
                            value={formData.Special}
                            onChange={(e) => handleChange('Special', e.target.value)}
                          ></textarea>
                        </div>
                      </>
                    )}
                    {userType === 'patient' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                        <div className="relative">
                          <FaTint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.bloodType}
                            onChange={(e) => handleChange('bloodType', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="email" 
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="password" 
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={formData.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg mt-6 font-semibold hover:bg-blue-600 transition-colors"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </motion.button>
            </form>
            
            {signupSuccess && (
              <p className="text-center mt-4 text-green-600 font-medium">
                Sign up successful! Please sign in.
              </p>
            )}
            
            <p className="text-center mt-6 text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setSignupSuccess(false);
                }}
                className="text-blue-500 font-semibold hover:text-blue-600"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;