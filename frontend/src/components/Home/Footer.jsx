import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaHeartbeat, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';

function Footer() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  const socialLinks = [
    { icon: <FaFacebook />, url: "https://www.facebook.com", name: "Facebook" },
    { icon: <FaTwitter />, url: "https://www.twitter.com", name: "Twitter" },
    { icon: <FaInstagram />, url: "https://www.instagram.com", name: "Instagram" },
    { icon: <FaLinkedin />, url: "https://www.linkedin.com", name: "LinkedIn" }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden" ref={ref}>
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-900 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-900 rounded-full opacity-10 blur-3xl"></div>
      
      {/* Main footer content */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-4 gap-10"
          >
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-2 mb-6">
                <FaHeartbeat className="text-blue-500 text-3xl" />
                <span className="text-2xl font-bold">MediSphere</span>
              </div>
              <p className="text-gray-400 mb-6">Transform your healthcare experience with our innovative platform designed to help you lead a healthier life.</p>
              
              <div className="flex gap-4 mt-6">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.name}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h4 className="text-xl font-bold mb-6 relative inline-block">
                For Patients
                <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-500"></div>
              </h4>
              <ul className="space-y-3">
                {[
                  { text: "Search for doctors", url: "https://www.healthcare.com/doctors" },
                  { text: "Search for clinics", url: "https://www.healthcare.com/clinics" },
                  { text: "Search for hospitals", url: "https://www.healthcare.com/hospitals" },
                  { text: "Practo Plus", url: "https://www.practo.com/plus" }
                ].map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.url} 
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 h-0.5 bg-blue-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h4 className="text-xl font-bold mb-6 relative inline-block">
                For Doctors
                <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-500"></div>
              </h4>
              <ul className="space-y-3">
                {[
                  { text: "Practo Profile", url: "https://www.practo.com/doctor-profile" },
                  { text: "For clinics", url: "https://www.practo.com/clinic-services" },
                  { text: "Ray by Practo", url: "https://www.practo.com/ray" },
                  { text: "Practo Reach", url: "https://www.practo.com/reach" }
                ].map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.url} 
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 h-0.5 bg-blue-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h4 className="text-xl font-bold mb-6 relative inline-block">
                Contact Us
                <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-500"></div>
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-start">
                    <FaMapMarkerAlt className="mt-1 mr-3 text-blue-500" />
                    <span>123 Healthcare Avenue, Medical District, 10001</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                    <FaPhone className="mr-3 text-blue-500" />
                    <span>+1 (234) 567-890</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:info@healthsync.com" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                    <FaEnvelope className="mr-3 text-blue-500" />
                    <span>info@healthsync.com</span>
                  </a>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom bar with enhanced hover effects */}
      <div className="border-t border-gray-800 mt-12 pt-8 pb-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="text-gray-500 text-sm mb-4 md:mb-0 group hover:text-white transition-all duration-300 cursor-default"
          >
            <span className="inline-block group-hover:scale-105 transition-transform duration-300">
              © 2025 HealthSync. All rights reserved.
            </span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
            className="flex gap-6"
          >
            {["Privacy", "Terms", "Cookies", "Security"].map((item, index) => (
              <a 
                key={index} 
                href="#" 
                className="text-gray-500 text-sm group relative overflow-hidden transition-all duration-300"
              >
                <span className="relative z-10 group-hover:text-white">{item}</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;