import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaStar, FaCalendarAlt, FaPhoneAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link for navigation

function Doctors() {
  const doctors = [
    {
      name: "Jonathan Reed",
      specialty: "Gastroenterologist",
      image: "/images/doc1.png",
      rating: 4.9,
      experience: "15 years",
      availability: "Mon-Fri"
    },
    {
      name: "Olivia Bennett",
      specialty: "Dermatologist",
      image: "/images/doc2.png",
      rating: 4.8,
      experience: "12 years",
      availability: "Tues-Sat"
    }
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 relative overflow-hidden" ref={ref}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full opacity-30 blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 relative inline-block">
            Available Doctors
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose from our expert medical professionals for personalized care</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {doctors.map((doctor, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group relative"
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 scale-110"></div>
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md relative z-10 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-semibold group-hover:text-blue-600 transition-colors duration-300">{doctor.name}</h3>
                  <p className="text-gray-600 mb-3">{doctor.specialty}</p>
                  
                  <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`${i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'} text-sm`} />
                    ))}
                    <span className="ml-2 text-gray-600 text-sm">{doctor.rating}</span>
                  </div>
                  
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-300 text-sm font-medium">
                      <FaCalendarAlt />
                      <span>Schedule</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 text-sm font-medium">
                      <FaPhoneAlt />
                      <span>Contact</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-sm relative z-10">
                <div className="text-gray-600">
                  <span className="font-medium text-gray-800">Experience:</span> {doctor.experience}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium text-gray-800">Available:</span> {doctor.availability}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link to="/user/appointments" className="inline-flex items-center group">
            <span className="text-blue-600 group-hover:text-blue-800 font-semibold transition-colors duration-300">Meet Our Experts</span>
            <span className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Doctors;