import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaHeartbeat } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const buttonHoverVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0px 10px 20px rgba(37, 99, 235, 0.3)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const iconAnimation = {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
      },
    },
  };

  // Function to scroll to the WhyUs section
  const scrollToWhyUs = () => {
    const whyUsSection = document.getElementById('why-us-section');
    if (whyUsSection) {
      whyUsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-8 pb-24 px-4 overflow-hidden">
      {/* Background gradient circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-100 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center mb-16 relative z-10"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mb-8 bg-blue-50 px-4 py-2 rounded-full shadow-sm"
          >
            <motion.div variants={iconAnimation} animate="animate">
              <FaHeartbeat className="text-blue-600" />
            </motion.div>
            <span className="text-blue-800 font-medium text-sm">
              Advanced Healthcare Technology
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tight"
          >
            Partner in health
            <br />
            and{' '}
            <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600">
              wellness
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mb-14 leading-relaxed"
          >
            Providing advanced healthcare solutions with a compassionate touch for every
            patient, using the latest medical innovations and personalized care.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 w-full justify-center"
          >
            {/* Link to Appointments page */}
            <Link to="/user/appointments">
              <motion.button
                className="btn-primary relative overflow-hidden group"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <FaHeart className="text-white group-hover:animate-pulse" />
                  <span>Book an Appointment</span>
                </span>
                <span className="absolute top-0 left-0 w-full h-0 bg-gradient-to-r from-blue-700 to-indigo-700 transition-all duration-300 group-hover:h-full"></span>
              </motion.button>
            </Link>

            {/* Scroll to WhyUs section */}
            <motion.button
              onClick={scrollToWhyUs}
              className="px-6 py-3 rounded-full font-semibold text-gray-700 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 group border border-transparent hover:border-blue-200 hover:bg-blue-50"
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
            >
              <span>About us</span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
          className="stats-card text-center flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 p-8 backdrop-blur-sm bg-white/80"
        >
          <div className="stat-item">
            <div className="text-4xl font-bold mb-2 text-blue-600">5,000+</div>
            <div className="text-gray-600">Appointments Booked</div>
          </div>
          <div className="h-12 w-px bg-gray-200 hidden md:block"></div>
          <div className="stat-item">
            <div className="text-4xl font-bold mb-2 text-blue-600">98%</div>
            <div className="text-gray-600">Patient Satisfaction</div>
          </div>
          <div className="h-12 w-px bg-gray-200 hidden md:block"></div>
          <div className="stat-item">
            <div className="text-4xl font-bold mb-2 text-blue-600">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;