import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaUserMd, FaLaptopMedical, FaFileMedical, FaPills } from 'react-icons/fa';

function WhyUs() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const reasons = [
    {
      icon: <FaUserMd className="text-blue-500 text-4xl transition-all duration-300 group-hover:text-blue-600" />,
      title: "Experienced Professionals",
      description: "Our team of dedicated healthcare providers brings years of specialized experience to deliver personalized and compassionate care for every patient.",
    },
    {
      icon: <FaLaptopMedical className="text-blue-500 text-4xl transition-all duration-300 group-hover:text-blue-600" />,
      title: "SOS Emergency",
      description: "Our website's SOS emergency feature allows a single-click alert that immediately notifies designated contacts or responders, ensuring swift help in critical situations.",
    },
    {
      icon: <FaFileMedical className="text-blue-500 text-4xl transition-all duration-300 group-hover:text-blue-600" />,
      title: "Medical Records Management",
      description: "Access your complete medical history, test results, and treatment plans through our secure patient portal, putting you in control of your health data.",
    },
    {
      icon: <FaPills className="text-blue-500 text-4xl transition-all duration-300 group-hover:text-blue-600" />,
      title: "Pharmacy & Medicine Ordering",
      description: "Order prescriptions with just a few clicks and get medications delivered to your doorstep with our integrated pharmacy services and tracking system.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0.8, rotate: -10 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
      },
    },
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  return (
    <section id="why-us-section" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background styling */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full filter blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-50 rounded-full filter blur-3xl opacity-30 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-4">
            OUR ADVANTAGES
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
            Why choose MediSphere for<br />your healthcare?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We combine cutting-edge technology with compassionate care to provide you with the best healthcare experience possible.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#B3E5FC] relative overflow-hidden"
            >
              {/* Colored overlay on hover */}
              <div className="absolute inset-0 bg-[#E0F7FA] opacity-0 group-hover:opacity-100 -z-1 transition-opacity duration-300 rounded-2xl"></div>

              {/* Icon */}
              <motion.div
                className="mb-6 relative z-10 bg-blue-50 group-hover:bg-[#B3E5FC] w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                variants={iconVariants}
                whileHover="hover"
              >
                {reason.icon}
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 group-hover:text-gray-800 transition-colors duration-300 relative z-10">{reason.title}</h3>
              <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 relative z-10">{reason.description}</p>

              {/* Call to action */}
              
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default WhyUs;