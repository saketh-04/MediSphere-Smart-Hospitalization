import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaBrain, FaHeartbeat, FaUserMd, FaWheelchair, FaBandAid, FaHospital, FaAngleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Add this import

function Services() {
  const services = [
    {
      icon: <FaWheelchair className="text-blue-500 text-3xl" />,
      title: "Pediatrics",
      description: "Monitor your child's growth and development closely to ensure their health at every stage."
    },
    {
      icon: <FaBandAid className="text-blue-500 text-3xl" />,
      title: "Orthopedics",
      description: "Receive care for bone and muscle health with advanced treatments tailored to your needs."
    },
    {
      icon: <FaHospital className="text-blue-500 text-3xl" />,
      title: "Gastroenterology",
      description: "Comprehensive care for digestive health to address issues with precision and personalized attention."
    },
    {
      icon: <FaBrain className="text-blue-500 text-3xl" />,
      title: "Neurology",
      description: "Specialized treatments for brain and nerve health, ensuring advanced and compassionate care always."
    },
    {
      icon: <FaHeartbeat className="text-blue-500 text-3xl" />,
      title: "Cardiology",
      description: "State-of-the-art heart care focused on your cardiovascular health with expertise and dedication."
    },
    {
      icon: <FaUserMd className="text-blue-500 text-3xl" />,
      title: "General care",
      description: "Reliable primary healthcare services designed to maintain your well-being at every stage of life."
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
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      }
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
        type: "tween",
        ease: "easeOut"
      }
    }
  };
  
  const iconVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 150
      }
    },
    hover: {
      scale: 1.15,
      rotate: [0, 5, -5, 0],
      transition: { duration: 0.5 }
    }
  };
  
  const linkVariants = {
    initial: { x: 0 },
    hover: {
      x: 5,
      transition: { duration: 0.2 }
    }
  };

  const badgeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5
      }
    }
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-96 h-96 rounded-full bg-blue-50 right-0 top-20 blur-3xl opacity-70"></div>
        <div className="absolute w-96 h-96 rounded-full bg-blue-100 -left-40 -bottom-20 blur-3xl opacity-70"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-4"
          >
            Our Specialties
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent"
          >
            Personalized solutions for<br />better health
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Our comprehensive range of medical services designed with your well-being in mind
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-24 relative"
        >
          <motion.div 
            className="relative mx-auto bg-blue-100 rounded-2xl overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 p-8 md:p-12">
                <motion.span 
                  variants={badgeVariants}
                  initial="initial"
                  animate="animate"
                  className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-4"
                >
                  Meet Our Team
                </motion.span>
                <h3 className="text-3xl font-bold mb-4 text-blue-600">
                  Expert Specialists at Your Service
                </h3>
                <p className="text-gray-600 mb-6">
                  Our team of dedicated healthcare professionals brings years of experience and compassionate care to every patient interaction.
                </p>
                <Link to="/user/appointments"><motion.button 
                  className="py-3 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transition-all duration-300 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Meet Our Doctors</span>
                  <motion.span 
                    className="inline-block ml-2"
                    initial={{ x: 0 }}
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.button></Link>
              </div>
              
              <div className="md:w-1/2 relative">
                <img src="/images/header_img.png" alt="Medical specialists team" className="w-full h-auto" />
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              className="service-card group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:bg-blue-50 border border-transparent hover:border-blue-200"
            >
              <motion.div 
                className="mb-8 p-4 rounded-2xl bg-blue-50 w-16 h-16 flex items-center justify-center relative"
                variants={iconVariants}
                whileHover="hover"
              >
                {service.icon}
                <div className="absolute inset-0 bg-blue-100 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
              </motion.div>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{service.title}</h3>
              <p className="text-gray-600 mb-6 transition-colors duration-300">{service.description}</p>
              
              <motion.a 
                href="#" 
                className="inline-flex items-center text-blue-600 font-medium transition-colors duration-300"
                whileHover="hover"
              >
                View Services
                <motion.div className="ml-2" variants={linkVariants}>
                  <FaAngleRight />
                </motion.div>
              </motion.a>
              
              <div className="w-full h-1 bg-gray-100 mt-6 rounded-full overflow-hidden transition-colors duration-300">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-300 to-blue-500 w-0 group-hover:from-blue-400 group-hover:to-blue-500"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Link to="/user/appointments" className="btn-primary py-4 px-8 group bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transition-all duration-300 inline-flex items-center">
            <span>View All Specialties</span>
            <motion.span 
              className="inline-block ml-2"
              initial={{ x: 0 }}
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Services;