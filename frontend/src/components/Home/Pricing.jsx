import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaCheck, FaArrowRight } from 'react-icons/fa';

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      features: ["Basic Features", "Up to 3 Projects", "Community Support"],
      popular: false,
      color: "from-blue-400 to-blue-500"
    },
    {
      name: "Pro",
      price: "$49/mo",
      features: ["All Starter Features", "Unlimited Projects", "Priority Support", "Advanced Analytics"],
      popular: true,
      color: "from-blue-600 to-blue-700"
    }
  ];
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 50
      }
    }),
    hover: { 
      y: -15,
      boxShadow: "0 30px 60px rgba(0, 0, 0, 0.12)",
      transition: { duration: 0.3 }
    }
  };
  
  const featureVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({ 
      opacity: 1, 
      x: 0,
      transition: { delay: 0.3 + i * 0.1 }
    })
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden" ref={ref}>
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-100 opacity-40 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-200 opacity-40 blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div 
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={titleVariants}
          className="text-center mb-20"
        >
          <motion.span 
            variants={childVariants}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-4"
          >
            Pricing
          </motion.span>
          <motion.h2 
            variants={childVariants}
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent"
          >
            Simple Pricing
          </motion.h2>
          <motion.p 
            variants={childVariants}
            className="text-secondary text-xl max-w-2xl mx-auto"
          >
            Choose the plan that works for you and your practice
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              whileHover="hover"
              variants={cardVariants}
              className={`bg-white p-8 rounded-3xl ${plan.popular ? 'ring-2 ring-blue-500' : 'border border-gray-200'} shadow-lg relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex justify-center items-end gap-1 mb-2">
                  <p className="text-5xl font-bold">{plan.price.split('/')[0]}</p>
                  {plan.price.includes('/') && (
                    <span className="text-gray-500 text-lg">/{plan.price.split('/')[1]}</span>
                  )}
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full"></div>
              </div>
              
              <ul className="space-y-5 mb-10">
                {plan.features.map((feature, i) => (
                  <motion.li 
                    key={i}
                    custom={i}
                    variants={featureVariants}
                    className="flex items-start gap-3"
                  >
                    <div className="min-w-6 mt-0.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <FaCheck size={12} />
                      </span>
                    </div>
                    <span className="text-secondary">{feature}</span>
                  </motion.li>
                ))}
              </ul>
              
              <motion.button 
                className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 group ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600' : 'bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50'}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Get Started</span>
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FaArrowRight />
                </motion.div>
              </motion.button>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-16 bg-blue-50 p-6 rounded-2xl max-w-3xl mx-auto"
        >
          <p className="text-gray-600 mb-4">Need a custom plan for your organization?</p>
          <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
            Contact our sales team →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default Pricing;