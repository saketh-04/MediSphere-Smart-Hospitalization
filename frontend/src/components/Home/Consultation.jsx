import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaStar, FaCalendarCheck, FaUserMd, FaMapMarkerAlt } from 'react-icons/fa';

function Consultation() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-10 w-48 h-48 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 w-64 h-64 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative inline-block">
            Virtual Consultation
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </h2>
          <div className="flex justify-center items-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.3 }}
              >
                <FaStar className="text-yellow-400 text-2xl hover:text-yellow-300 transition-colors duration-300 transform hover:scale-110" />
              </motion.div>
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="ml-2 font-medium"
            >
              5.0 (980 Reviews)
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          variants={formVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm backdrop-filter"
          whileHover={{ boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)", y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="relative">
              <label className="block text-gray-700 mb-2 flex items-center gap-2 font-medium">
                <FaUserMd className="text-blue-500" />
                Name
              </label>
              <input
                type="text"
                placeholder="Jane Smith"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-transparent hover:bg-blue-50"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
              <label className="block text-gray-700 mb-2 flex items-center gap-2 font-medium">
                <FaCalendarCheck className="text-blue-500" />
                Doctor
              </label>
              <input
                type="text"
                placeholder="Dr Maria Cleven"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-transparent hover:bg-blue-50"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
              <label className="block text-gray-700 mb-2 flex items-center gap-2 font-medium">
                <FaMapMarkerAlt className="text-blue-500" />
                Location
              </label>
              <input
                type="text"
                placeholder="Amsterdam"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-transparent hover:bg-blue-50"
              />
            </motion.div>
          </div>
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <button className="btn-primary group relative overflow-hidden">
              <span className="relative z-10">Submit</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-16"
        >
          <div className="stats-card inline-block px-12">
            <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
              200K+
            </div>
            <div className="text-gray-600">Cured satisfied patients around the globe</div>
          </div>
        </motion.div>

        {/* Newsletter section */}
        <div className="pt-16 pb-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 mb-16 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div className="relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Stay updated with our health tips</h3>
                <p className="text-blue-100 mb-6">Get the latest healthcare insights and updates straight to your inbox</p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="flex-grow px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors duration-300 whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Consultation;