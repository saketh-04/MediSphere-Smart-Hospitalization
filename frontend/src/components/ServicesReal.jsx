import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TestTube2, Ambulance, Pill as Pills } from 'lucide-react';


export default function Servicesrea() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Lab Test Booking Center",
      description: "Book lab tests, find nearby diagnostic centers, and get home sample collection services",
      icon: TestTube2,
      path: "/user/services/labtests",
      color: "bg-purple-50 hover:bg-purple-100",
      iconColor: "text-purple-500",
    },
    {
      title: "One-Tap SOS Emergency",
      description: "Quick access to emergency services, ambulance booking, and nearby hospitals",
      icon: Ambulance,
      path: "/user/services/emergency",
      color: "bg-red-50 hover:bg-red-100",
      iconColor: "text-red-500",
    },
    {
      title: "Pharmacy & Medicine Delivery",
      description: "Order medicines online, upload prescriptions, and get doorstep delivery",
      icon: Pills,
      path: "/user/services/pharmacy",
      color: "bg-green-50 hover:bg-green-100",
      iconColor: "text-green-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Medical Services</h1>
        <p className="text-xl text-gray-600">Comprehensive healthcare solutions at your fingertips</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.title}
            className={`${service.color} rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 cursor-pointer`}
            onClick={() => navigate(service.path)}
          >
            <service.icon className={`w-12 h-12 ${service.iconColor} mb-6`} />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}