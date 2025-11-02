import React, { useState, useEffect } from 'react';
import { Search, Home, Download, X, CreditCard, FileText, Calendar, MapPin, Check, Clock, TrendingUp } from 'lucide-react';

// Types defined as JSDoc comments for better IDE support
/** @typedef {Object} Test
 * @property {string} id
 * @property {string} name
 * @property {Lab[]} labs
 */

/** @typedef {Object} Lab
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {string} turnaround
 * @property {string} [location]
 * @property {string} [city]
 * @property {number} [rating]
 */

/** @typedef {Object} TestReport
 * @property {string} id
 * @property {string} testName
 * @property {string} date
 * @property {string} time
 * @property {string} labName
 * @property {string} reportUrl
 * @property {('normal'|'attention'|'critical')} status
 * @property {string} reportFile
 * @property {ReportTracking} tracking
 */

/** @typedef {Object} ReportTracking
 * @property {string} orderId
 * @property {TrackingStage[]} stages
 * @property {string} expectedDate
 */

/** @typedef {Object} TrackingStage
 * @property {string} name
 * @property {string} date
 * @property {string} time
 * @property {boolean} completed
 * @property {string} description
 */

/** @typedef {Object} BookingFormData
 * @property {string} testId
 * @property {string} labId
 * @property {string} patientName
 * @property {string} age
 * @property {string} email
 * @property {string} phone
 */

/** @typedef {Object} City
 * @property {string} id
 * @property {string} name
 */

const sampleReportContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Test Report</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      .report-header { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
      .report-section { margin: 20px 0; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
    </style>
  </head>
  <body>
    <h1 class="report-header">Test Report</h1>
    <div class="report-section">
      <h2>Test Results</h2>
      <table>
        <tr><th>Parameter</th><th>Value</th><th>Reference Range</th></tr>
        <tr><td>Hemoglobin</td><td>13.5 g/dL</td><td>13.0-17.0 g/dL</td></tr>
        <tr><td>WBC Count</td><td>6500 /µL</td><td>4000-11000 /µL</td></tr>
      </table>
    </div>
  </body>
  </html>
`;

export default function LabTests() {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [reportsSearchQuery, setReportsSearchQuery] = useState('');
  const [trackingSearchQuery, setTrackingSearchQuery] = useState('');
  const [citySearchQuery, setLocationSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedLab, setSelectedLab] = useState(null);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showReportViewModal, setShowReportViewModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [bookingData, setBookingData] = useState({
    testId: '',
    labId: '',
    patientName: '',
    age: '',
    email: '',
    phone: '',
  });
  const [tests, setTests] = useState([]); // State for fetched tests

  // Sample cities data
  const cities = [
    { id: 'c1', name: 'Mumbai' },
    { id: 'c2', name: 'Delhi' },
    { id: 'c3', name: 'Bangalore' },
    { id: 'c4', name: 'Chennai' },
    { id: 'c5', name: 'Hyderabad' },
  ];

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  // Sample reports data
  const reports = [
    {
      id: '1',
      testName: 'Complete Blood Count',
      date: '2024-03-15',
      time: '09:30 AM',
      labName: 'City Diagnostics',
      reportUrl: '/reports/cbc-report.pdf',
      status: 'normal',
      reportFile: '/src/sampleReports/cbc-report.html',
      tracking: {
        orderId: 'ORD123456',
        expectedDate: '2024-03-17',
        stages: [
          { 
            name: 'Order Placed', 
            date: '2024-03-15', 
            time: '09:30 AM', 
            completed: true,
            description: 'Your test has been booked successfully'
          },
          { 
            name: 'Sample Collection', 
            date: '2024-03-15', 
            time: '11:45 AM', 
            completed: true,
            description: 'Your sample has been collected'
          },
          { 
            name: 'Lab Processing', 
            date: '2024-03-16', 
            time: '02:30 PM', 
            completed: true,
            description: 'Your sample is being analyzed in the lab'
          },
          { 
            name: 'Report Generated', 
            date: '2024-03-17', 
            time: '10:15 AM', 
            completed: true,
            description: 'Your test report has been generated'
          },
          { 
            name: 'Report Available', 
            date: '2024-03-17', 
            time: '11:00 AM', 
            completed: true,
            description: 'Your report is available for download'
          }
        ]
      }
    },
    {
      id: '2',
      testName: 'Thyroid Profile',
      date: '2024-02-28',
      time: '11:45 AM',
      labName: 'HealthLabs',
      reportUrl: '/reports/thyroid-report.pdf',
      status: 'attention',
      reportFile: '/src/sampleReports/cbc-report.html',
      tracking: {
        orderId: 'ORD123457',
        expectedDate: '2024-03-02',
        stages: [
          { 
            name: 'Order Placed', 
            date: '2024-02-28', 
            time: '11:45 AM', 
            completed: true,
            description: 'Your test has been booked successfully'
          },
          { 
            name: 'Sample Collection', 
            date: '2024-02-28', 
            time: '03:20 PM', 
            completed: true,
            description: 'Your sample has been collected'
          },
          { 
            name: 'Lab Processing', 
            date: '2024-03-01', 
            time: '11:30 AM', 
            completed: true,
            description: 'Your sample is being analyzed in the lab'
          },
          { 
            name: 'Report Generated', 
            date: '2024-03-02', 
            time: '09:45 AM', 
            completed: true,
            description: 'Your test report has been generated'
          },
          { 
            name: 'Report Available', 
            date: '2024-03-02', 
            time: '10:30 AM', 
            completed: true,
            description: 'Your report is available for download'
          }
        ]
      }
    },
    {
      id: '3',
      testName: 'Vitamin D Test',
      date: '2024-03-10',
      time: '03:15 PM',
      labName: 'MediTest Center',
      reportUrl: '/reports/vitamin-d-report.pdf',
      status: 'normal',
      reportFile: '/src/sampleReports/cbc-report.html',
      tracking: {
        orderId: 'ORD123458',
        expectedDate: '2024-03-13',
        stages: [
          { 
            name: 'Order Placed', 
            date: '2024-03-10', 
            time: '03:15 PM', 
            completed: true,
            description: 'Your test has been booked successfully'
          },
          { 
            name: 'Sample Collection', 
            date: '2024-03-11', 
            time: '10:30 AM', 
            completed: true,
            description: 'Your sample has been collected'
          },
          { 
            name: 'Lab Processing', 
            date: '2024-03-12', 
            time: '01:45 PM', 
            completed: true,
            description: 'Your sample is being analyzed in the lab'
          },
          { 
            name: 'Report Generated', 
            date: '2024-03-12',
            time: '04:30 PM', 
            completed: false,
            description: 'Your test report is being prepared'
          },
          { 
            name: 'Report Available', 
            date: '2024-03-13', 
            time: 'Expected', 
            completed: false,
            description: 'Your report will be available for download'
          }
        ]
      }
    }
  ];

  const filteredReports = reports.filter(report =>
    report.testName.toLowerCase().includes(reportsSearchQuery.toLowerCase()) ||
    report.date.includes(reportsSearchQuery)
  );

  const filteredTrackingReports = reports.filter(report =>
    report.testName.toLowerCase().includes(trackingSearchQuery.toLowerCase()) ||
    report.tracking.orderId.toLowerCase().includes(trackingSearchQuery.toLowerCase())
  );

  // Sample labs data
  const labs = [
    { id: 'l1', name: 'City Diagnostics', location: 'Downtown', city: 'Mumbai', rating: 4.5 },
    { id: 'l2', name: 'HealthLabs', location: 'Uptown', city: 'Mumbai', rating: 4.8 },
    { id: 'l3', name: 'MediTest Center', location: 'Midtown', city: 'Delhi', rating: 4.3 },
    { id: 'l4', name: 'Prime Diagnostics', location: 'Central', city: 'Bangalore', rating: 4.6 },
    { id: 'l5', name: 'LifeCare Labs', location: 'South', city: 'Chennai', rating: 4.7 },
  ];

  const filteredLabs = selectedCity
    ? labs.filter(lab => lab.city === selectedCity.name)
    : labs;

  // Fetch tests from the database
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch('http://localhost:5000/owner/getall', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.success) {
          const groupedTests = data.data.reduce((acc, item) => {
            const testName = item.TestName;
            if (!acc[testName]) {
              acc[testName] = {
                id: testName.toLowerCase().replace(/\s/g, '-'),
                name: testName,
                labs: [],
              };
            }
            acc[testName].labs.push({
              id: item._id,
              name: item.labName,
              price: item.cost,
              turnaround: item.TestTime,
            });
            return acc;
          }, {});
          setTests(Object.values(groupedTests));
        } else {
          console.error('Failed to fetch tests:', data);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };
    fetchTests();
  }, []);

  const filteredTests = tests.filter(test =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleBookTest = (test) => {
    setSelectedTest(test);
    setSelectedLab(null); // Reset selected lab
    setBookingData({
      testId: test.id,
      labId: '',
      patientName: '',
      age: '',
      email: '',
      phone: '',
    });
    setShowBookingModal(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedLab) {
      alert('Please select a lab.');
      return;
    }
    setShowBookingModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const patientID = localStorage.getItem('medID');
    if (!patientID) {
      alert('Patient ID not found. Please log in again.');
      return;
    }
    const age = parseInt(bookingData.age);
    const phone = parseInt(bookingData.phone);
    if (isNaN(age) || isNaN(phone)) {
      alert('Please enter valid numbers for age and phone.');
      return;
    }
    const labTestData = {
      patientID,
      patientName: bookingData.patientName,
      email: bookingData.email,
      age,
      price: selectedLab.price,
      labName: selectedLab.name,
      phone,
    };
    try {
      const response = await fetch('http://localhost:5000/lab/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(labTestData),
      });
      if (response.ok) {
        const result = await response.json();
        setShowPaymentModal(false);
        alert('Booking successful! ' + result.message);
        setBookingData({
          testId: '',
          labId: '',
          patientName: '',
          age: '',
          email: '',
          phone: '',
        });
        setSelectedTest(null);
        setSelectedLab(null);
      } else {
        const errorResult = await response.json();
        alert('Failed to book the test: ' + errorResult.message);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('An error occurred while booking the test.');
    }
  };

  const handleCollectionSubmit = (e) => {
    e.preventDefault();
    setShowCollectionModal(false);
    setShowPaymentModal(true);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportViewModal(true);
  };

  const handleTrackReport = (report) => {
    setSelectedReport(report);
    setShowTrackingModal(true);
  };

  const handleDownloadReport = (report) => {
    const blob = new Blob([sampleReportContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.testName}-report.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpiChange = (e) => {
    const value = e.target.value;
    setUpiId(value);
    setIsUpiVerified(value.toLowerCase().endsWith('@sbi'));
  };

  useEffect(() => {
    if (selectedReport && showReportViewModal) {
      const reportContainer = document.getElementById('report-container');
      if (reportContainer) {
        reportContainer.innerHTML = sampleReportContent;
      }
    }
    return () => {
      const reportContainer = document.getElementById('report-container');
      if (reportContainer) {
        reportContainer.innerHTML = '';
      }
    };
  }, [selectedReport, showReportViewModal]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Lab Test Booking Center</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Search and test list */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for tests..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredTests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-semibold text-gray-900">{test.name}</h3>
                    <p className="text-sm text-gray-500">
                      Results in {test.labs[0]?.turnaround || 'Varies'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-500">
                      From ₹{Math.min(...test.labs.map(lab => lab.price))}
                    </p>
                    <button
                      onClick={() => handleBookTest(test)}
                      className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Centers */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Test Centers</h3>
              <div className="relative w-64">
                <MapPin className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={citySearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  placeholder="Search by city..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {citySearchQuery && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                    {filteredCities.map((city) => (
                      <button
                        key={city.id}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => {
                          setSelectedCity(city);
                          setLocationSearchQuery('');
                        }}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {filteredLabs.map((center) => (
                <div key={center.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{center.name}</h4>
                    <p className="text-sm text-gray-500">{center.location}, {center.city}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm text-gray-600">{center.rating}</span>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(center.name + ' ' + center.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                  >
                    View Center
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Home Collection */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Home className="text-blue-500" />
              <h3 className="font-semibold text-lg">Home Collection</h3>
            </div>
            <p className="text-gray-600 mb-4">Get your samples collected at home by our trained phlebotomists</p>
            <button
              onClick={() => setShowCollectionModal(true)}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Schedule Collection
            </button>
          </div>

          {/* Download Reports */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Download className="text-blue-500" />
              <h3 className="font-semibold text-lg">Download Reports</h3>
            </div>
            <p className="text-gray-600 mb-4">Access your test reports anytime, anywhere</p>
            <button 
              onClick={() => setShowReportsModal(true)}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              View Reports
            </button>
          </div>

          {/* Track Reports */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-blue-500" />
              <h3 className="font-semibold text-lg">Track Reports</h3>
            </div>
            <p className="text-gray-600 mb-4">Check the status of your pending test reports</p>
            <button 
              onClick={() => setShowTrackingModal(true)}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Track
            </button>
          </div>
        </div>
      </div>

      {/* Reports Modal */}
      {showReportsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Your Test Reports</h3>
              <button onClick={() => setShowReportsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={reportsSearchQuery}
                  onChange={(e) => setReportsSearchQuery(e.target.value)}
                  placeholder="Search reports by test name or date..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{report.testName}</h4>
                      <p className="text-gray-600">{report.labName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(report.status)}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    {report.date} at {report.time}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewReport(report)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      <FileText className="w-4 h-4" />
                      View Report
                    </button>
                    <button 
                      onClick={() => handleDownloadReport(report)}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button 
                      onClick={() => handleTrackReport(report)}
                      className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Track
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Report View Modal */}
      {showReportViewModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">{selectedReport.testName} Report</h3>
              <button onClick={() => setShowReportViewModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div id="report-container" className="bg-white rounded-lg p-6"></div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Track Your Reports</h3>
              <button onClick={() => setShowTrackingModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={trackingSearchQuery}
                  onChange={(e) => setTrackingSearchQuery(e.target.value)}
                  placeholder="Search by test name or order ID..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {!selectedReport ? (
              <div className="space-y-4">
                {filteredTrackingReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{report.testName}</h4>
                        <p className="text-gray-600">{report.labName}</p>
                        <p className="text-sm text-gray-500">Order ID: {report.tracking.orderId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(report.status)}`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      {report.date} at {report.time}
                    </div>
                    <button 
                      onClick={() => handleTrackReport(report)}
                      className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Track Status
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-xl text-gray-900 mb-1">{selectedReport.testName}</h4>
                      <p className="text-gray-600 mb-1">{selectedReport.labName}</p>
                      <p className="text-sm text-gray-500">Order ID: {selectedReport.tracking.orderId}</p>
                    </div>
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Back to List
                    </button>
                  </div>
                  <div className="flex items-center mt-4">
                    <Clock className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-gray-700">
                      Expected completion: <span className="font-medium">{selectedReport.tracking.expectedDate}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedReport.tracking.stages.map((stage, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="relative flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          stage.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {stage.completed && <Check className="w-5 h-5 text-white" />}
                        </div>
                        {index < selectedReport.tracking.stages.length - 1 && (
                          <div className={`w-0.5 flex-grow ${
                            stage.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{stage.name}</p>
                          {stage.completed && (
                            <span className="text-sm text-gray-500">
                              {stage.date} at {stage.time}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">{stage.description}</p>
                        {!stage.completed && (
                          <p className="text-sm text-gray-500 mt-1">
                            Expected: {stage.date} {stage.time !== 'Expected' && `at ${stage.time}`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Book {selectedTest.name}</h3>
              <button onClick={() => setShowBookingModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Lab</label>
                <select
                  required
                  value={bookingData.labId}
                  onChange={(e) => {
                    const lab = selectedTest.labs.find((lab) => lab.id === e.target.value);
                    setSelectedLab(lab);
                    setBookingData({ ...bookingData, labId: e.target.value });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Choose a lab</option>
                  {selectedTest.labs.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                <input
                  type="text"
                  required
                  value={bookingData.patientName}
                  onChange={(e) => setBookingData({ ...bookingData, patientName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  required
                  value={bookingData.age}
                  onChange={(e) => setBookingData({ ...bookingData, age: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  required
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium">Amount to Pay:</span>
                  <span className="font-bold text-blue-600">₹{selectedLab?.price || 0}</span>
                </div>
              </div>
              {/* Simplified payment form (assuming payment is simulated) */}
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg font-medium"
              >
                Pay ₹{selectedLab?.price || 0}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Home Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Schedule Home Collection</h3>
              <button onClick={() => setShowCollectionModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCollectionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Test</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e) => setSelectedTest(tests.find(test => test.id === e.target.value) || null)}
                >
                  <option value="">Choose a test</option>
                  {tests.map(test => (
                    <option key={test.id} value={test.id}>
                      {test.name} - From ₹{Math.min(...test.labs.map(lab => lab.price))}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Address</label>
                <textarea
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your complete address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select time slot</option>
                  <option>7:00 AM - 9:00 AM</option>
                  <option>9:00 AM - 11:00 AM</option>
                  <option>11:00 AM - 1:00 PM</option>
                  <option>4:00 PM - 6:00 PM</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}