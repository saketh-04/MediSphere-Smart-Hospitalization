import React from 'react';
import { Bell, Search } from 'lucide-react';

const Header = () => {
  return (
    <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search patients, appointments..."
            className="w-96 pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
          <Bell />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <img
            src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop"
            alt="Doctor"
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium">Dr. Sarah Wilson</span>
        </div>
      </div>
    </div>
  );
};

export default Header;