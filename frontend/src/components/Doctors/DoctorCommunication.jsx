import React, { useState } from 'react';
import { Search, Video, Phone, Send, Paperclip, Image } from 'lucide-react';

const CommunicationDoc = () => {
  const [activeChat, setActiveChat] = useState(0);

  const patients = [
    {
      id: 1,
      name: 'John Doe',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      lastMessage: 'Thank you, doctor!',
      time: '10:30 AM'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      lastMessage: 'When should I take the medicine?',
      time: 'Yesterday'
    }
  ];

  return (
    <div className="p-6 h-[calc(100vh-4rem)]">
      <div className="bg-white rounded-xl shadow-sm h-full flex">
        {/* Sidebar */}
        <div className="w-80 border-r">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-5rem)]">
            {patients.map((patient, index) => (
              <button
                key={patient.id}
                className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 ${
                  activeChat === index ? 'bg-blue-50' : ''
                }`}
                onClick={() => setActiveChat(index)}
              >
                <img src={patient.image} alt={patient.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1 text-left">
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-gray-600 truncate">{patient.lastMessage}</p>
                </div>
                <span className="text-xs text-gray-500">{patient.time}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src={patients[activeChat].image} alt={patients[activeChat].name} className="w-10 h-10 rounded-full" />
              <span className="font-medium">{patients[activeChat].name}</span>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Phone size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Video size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Messages will go here */}
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Paperclip size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Image size={20} />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationDoc;