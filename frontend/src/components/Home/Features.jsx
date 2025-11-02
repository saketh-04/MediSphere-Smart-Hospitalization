import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function Features() {
  const features = [
    {
      title: "Smart Automation",
      description: "Automate repetitive tasks and focus on what matters most to your healthcare needs",
      icon: "🚀",
      color: "from-blue-400 to-indigo-500"
    },
    {
      title: "Real-time Analytics",
      description: "Get insights into your health workflow with powerful analytics and visualization tools",
      icon: "📊",
      color: "from-green-400 to-teal-500"
    },
    {
      title: "Team Collaboration",
      description: "Work together seamlessly with your healthcare team members for better coordination",
      icon: "👥",
      color: "from-purple-400 to-pink-500"
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-100 rounded-full opacity-30 blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 relative"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-4">Why Choose Us</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need for exceptional healthcare management</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
            >
              {/* Hover background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Icon with gradient background */}
              <div className="relative z-10 mb-6">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300 scale-150`}></div>
                <div className={`w-16 h-16 flex items-center justify-center text-3xl bg-gradient-to-br ${feature.color} rounded-2xl text-white shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
                  {feature.icon}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 relative z-10 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-600 relative z-10">{feature.description}</p>
              
              {/* Bottom line with animation */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 group-hover:w-full transition-all duration-500"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Features;