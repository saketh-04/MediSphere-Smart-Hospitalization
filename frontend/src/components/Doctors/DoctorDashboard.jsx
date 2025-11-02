import { motion, AnimatePresence } from 'framer-motion';
import { FaHeartbeat, FaUserMd, FaLaptopMedical, FaPrescription, FaCalendarCheck, FaChartLine, FaNotesMedical, FaStethoscope, FaHospital, FaUserCog, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function DocDashboard() {
  const specialties = [
    {
      icon: <FaUserMd className="text-blue-700 text-3xl" />,
      title: "Patient Consultations",
      description: "Conduct seamless virtual or in-person consultations with integrated video and notes"
    },
    {
      icon: <FaLaptopMedical className="text-blue-700 text-3xl" />,
      title: "Electronic Health Records",
      description: "Securely access and update patient records with real-time synchronization"
    },
    {
      icon: <FaPrescription className="text-blue-700 text-3xl" />,
      title: "E-Prescriptions",
      description: "Prescribe medications digitally with our pharmacy integration system"
    }
  ];

  const clinicalFeatures = [
    {
      icon: <FaNotesMedical className="text-white text-2xl" />,
      title: "Clinical Documentation",
      description: "Streamlined documentation with customizable templates and voice-to-text"
    },
    {
      icon: <FaHospital className="text-white text-2xl" />,
      title: "Practice Management",
      description: "Comprehensive tools for managing your medical practice efficiently"
    },
    {
      icon: <FaUserCog className="text-white text-2xl" />,
      title: "Patient Portal",
      description: "Secure patient communication and record access"
    }
  ];

  const stats = [
    { number: "98%", label: "Patient Satisfaction" },
    { number: "50K+", label: "Consultations" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className=" pb-20 px-4 hero-pattern">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.span 
              className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-2"
              whileHover={{ scale: 1.05, backgroundColor: "#93C5FD" }}
            >
              <FaStethoscope />
              Doctors Focused Platform
            </motion.span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800">
                Your Practice, <br />
                <span className="gradient-text">Simplified</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline your workflow with MediSphere - a comprehensive platform designed to enhance patient care and optimize your practice efficiency.
              </p>
             <Link to="/doctor/appointments"><motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#1D4ED8" }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Get Started
              </motion.button></Link> 
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
                alt="Doctor using MediSphere"
                className="rounded-2xl shadow-2xl"
              />
              <AnimatePresence>
                <motion.div 
                  className="absolute -bottom-10 -left-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="floating-stats bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FaChartLine className="text-blue-700 text-xl" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">98%</p>
                        <p className="text-gray-600">Success Rate</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="stats-card"
              >
                <h3 className="text-4xl font-bold text-blue-700 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Patient Management */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Comprehensive Patient Management</h2>
            <p className="section-subtitle">Stay connected with your patients through integrated tools and insights</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specialties.map((specialty, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                className="feature-card"
              >
                <motion.div 
                  className="mb-6 inline-block p-3 bg-blue-100 rounded-lg"
                  whileHover={{ scale: 1.1, backgroundColor: "#DBEAFE" }}
                >
                  {specialty.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">{specialty.title}</h3>
                <p className="text-gray-600">{specialty.description}</p>
                <motion.a 
                  href="#" 
                  className="learn-more-link"
                  whileHover={{ x: 5 }}
                >
                  Learn more →
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose MediSphere */}
      <section className="py-20 bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Why choose MediSphere for your practice?
            </h2>
            <p className="text-xl text-blue-100">
              We combine cutting-edge technology with intuitive design to enhance your medical practice
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clinicalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.03,
                  backgroundColor: "rgba(255, 255, 255, 0.15)"
                }}
                className="glass-card p-8 rounded-xl"
              >
                <motion.div 
                  className="mb-6 inline-block p-3 bg-white/20 rounded-lg"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-blue-50">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              What Doctors Say
            </h2>
            <p className="text-xl text-gray-600">
              Hear from physicians who transformed their practice with MediSphere
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "MediSphere has streamlined my patient interactions and record-keeping, saving me hours every day.",
                name: "Dr. Sarah Johnson",
                role: "Cardiologist",
                image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=100&q=80" // Placeholder for Dr. Sarah Johnson
              },
              {
                quote: "The analytics tools help me track patient outcomes like never before - a game-changer for my practice.",
                name: "Dr. Michael Chen",
                role: "General Practitioner",
                image: "https://images.unsplash.com/photo-1612349317154-3c9b2e2b1c74?auto=format&fit=crop&w=100&q=80" // Placeholder for Dr. Michael Chen
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                className="p-8 bg-white rounded-xl shadow-lg transition-all duration-300"
              >
                <p className="text-gray-600 italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover bg-gray-200"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            className="bg-white p-12 rounded-2xl shadow-xl text-center"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to Transform Your Practice?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of physicians who trust MediSphere for exceptional patient care
            </p>
            <Link to="/doctor/appointments"><motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#1D4ED8" }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Start Your Journey
            </motion.button></Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default DocDashboard;