import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Search, Filter, CheckCircle, X } from 'lucide-react'; // Import X for the close button

const LabTestDashboard = () => {
  // State for lab tests data
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  
  // We use useNavigate to redirect the user
  const navigate = useNavigate();

  // Fetch lab tests from the database
  useEffect(() => {
    const fetchLabTests = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/lab/dashboard");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLabTests(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch lab tests');
        setLoading(false);
        console.error('Error fetching lab tests:', err);
      }
    };
    
    fetchLabTests();
  }, []);
  
  // Filter lab tests based on search term
  const filteredLabTests = labTests.filter((test) => {
    const searchLower = searchTerm.toLowerCase();
    const patientId = (test.patientId || test.patientID || '').toLowerCase();
    const patientName = (test.patientName || '').toLowerCase();
    const priceStr = test.price ? test.price.toString() : '';
    const labName = (test.labName || '').toLowerCase();
    const email = (test.email || '').toLowerCase();
    
    return (
      patientId.includes(searchLower) ||
      patientName.includes(searchLower) ||
      priceStr.includes(searchLower) ||
      labName.includes(searchLower) ||
      email.includes(searchLower)
    );
  });
  
  // Separate pending and completed tests
  const pendingTests = filteredLabTests.filter((test) => !test.isComplete);
  const completedTests = filteredLabTests.filter((test) => test.isComplete);
  
  // Function to mark a test as complete by calling the API
  const markAsComplete = async (testId) => {
    try {
      const response = await fetch(`http://localhost:5000/lab/update/${testId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isComplete: true,
          completedDate: new Date().toISOString().split('T')[0]
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update lab test');
      }
      
      const updatedData = await response.json();
      // Update local state with the updated test data
      setLabTests((prevTests) =>
        prevTests.map((test) => (test._id === testId ? updatedData.data : test))
      );
    } catch (err) {
      console.error('Error updating lab test:', err);
      alert('Failed to update test status');
    }
  };
  
  if (loading) {
    return <div className="p-4 text-center">Loading lab tests...</div>;
  }
  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }
  
  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Heading + Close Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">DASHBOARD</h1>
        <button
          onClick={() => navigate('/login')}
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Search Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Patient ID, Name, Price, Lab Name, or Email"
              className="pl-10 pr-4 py-2 w-full border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Clear Filters (just resets search) */}
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => setSearchTerm('')}
          >
            <Filter className="h-5 w-5" />
            Clear Search
          </button>
        </div>
      </div>
      
      {/* Pending Tests Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          Pending Lab Tests ({pendingTests.length})
        </h2>
        
        {pendingTests.length === 0 ? (
          <div className="text-gray-500 text-center py-4">No pending lab tests found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lab Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingTests.map((test) => {
                  const patientId = test.patientId || test.patientID || '';
                  const patientName = test.patientName || '';
                  const price = test.price ?? '';
                  const labName = test.labName || '';
                  const email = test.email || '';

                  // If any of these fields are missing, skip rendering this row
                  if (!patientId || !patientName || !price || !labName || !email) {
                    return null;
                  }

                  return (
                    <tr key={test._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                        {patientId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {patientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {labName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => markAsComplete(test._id)}
                          className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Completed Tests Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          Completed Lab Tests ({completedTests.length})
        </h2>
        
        {completedTests.length === 0 ? (
          <div className="text-gray-500 text-center py-4">No completed lab tests found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lab Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedTests.map((test) => {
                  const patientId = test.patientId || test.patientID || '';
                  const patientName = test.patientName || '';
                  const price = test.price ?? '';
                  const labName = test.labName || '';
                  const email = test.email || '';

                  // If any required fields are missing, skip rendering this row
                  if (!patientId || !patientName || !price || !labName || !email) {
                    return null;
                  }

                  return (
                    <tr key={test._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                        {patientId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {patientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {labName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {email}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabTestDashboard;
