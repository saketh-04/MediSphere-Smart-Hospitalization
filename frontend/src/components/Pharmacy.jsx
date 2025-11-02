import React, { useState } from 'react';
import { Search, Upload, Truck, MapPin, Phone, Copy, X, CreditCard, Check } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Pharmacy() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [isUpiVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    pincode: '',
    deliveryOption: 'standard'
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [orders, setOrders] = useState([ // Changed to useState for dynamic updates
    {
      id: "ORD12345",
      date: "March 14, 2025",
      items: [
        { name: "Paracetamol", quantity: 2, price: 50 },
        { name: "Vitamin C", quantity: 1, price: 180 },
      ],
      total: 280,
      status: "Shipped",
      estimatedDelivery: "March 16, 2025",
      trackingSteps: [
        { step: "Order Placed", completed: true, date: "March 14, 2025, 10:00 AM" },
        { step: "Processing", completed: true, date: "March 14, 2025, 12:00 PM" },
        { step: "Shipped", completed: true, date: "March 15, 2025, 9:00 AM" },
        { step: "Out for Delivery", completed: false, date: "Estimated March 16, 2025" },
        { step: "Delivered", completed: false, date: "Pending" },
      ],
    },
    {
      id: "ORD12346",
      date: "March 13, 2025",
      items: [{ name: "Amoxicillin", quantity: 1, price: 120 }],
      total: 120,
      status: "Delivered",
      estimatedDelivery: "March 14, 2025",
      trackingSteps: [
        { step: "Order Placed", completed: true, date: "March 13, 2025, 2:00 PM" },
        { step: "Processing", completed: true, date: "March 13, 2025, 4:00 PM" },
        { step: "Shipped", completed: true, date: "March 13, 2025, 6:00 PM" },
        { step: "Out for Delivery", completed: true, date: "March 14, 2025, 8:00 AM" },
        { step: "Delivered", completed: true, date: "March 14, 2025, 11:00 AM" },
      ],
    },
  ]);

  // Initialize Google Generative AI with your API key
  const genAI = new GoogleGenerativeAI("AIzaSyCOwa9U5_I5H8ZMT9pgH3TxfgC7-c5DxyA"); // Replace with your actual API key
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const medicines = [
    { name: 'Paracetamol', price: 50, type: 'Tablet' },
    { name: 'Amoxicillin', price: 120, type: 'Capsule' },
    { name: 'Vitamin C', price: 180, type: 'Tablet' },
    { name: 'Omeprazole', price: 90, type: 'Capsule' },
  ];

  const pharmacies = [
    { name: 'MediCare Pharmacy', distance: '0.5 km', time: 'Open 24/7', phone: '9876543210', website: 'https://medicarepharmacy.com', maps: 'https://maps.google.com/?q=Medicare+Pharmacy' },
    { name: 'HealthPlus Drugstore', distance: '1.2 km', time: 'Opens till 10 PM', phone: '8765432109', website: 'https://healthplusdrugstore.com', maps: 'https://maps.google.com/?q=HealthPlus+Drugstore' },
    { name: 'City Pharmacy', distance: '1.8 km', time: 'Opens till 11 PM', phone: '7654321098', website: 'https://citypharmacy.com', maps: 'https://maps.google.com/?q=City+Pharmacy' }
  ];

  const addToCart = (medicine) => {
    try {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.name === medicine.name);
        if (existingItem) {
          return prevCart.map(item => 
            item.name === medicine.name ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevCart, { ...medicine, quantity: 1 }];
      });
    } catch (error) {
      console.error('Error in addToCart:', error);
      setErrorMessage('Failed to add item to cart');
    }
  };

  const updateQuantity = (name, delta) => {
    try {
      setCart(prevCart =>
        prevCart.map(item => 
          item.name === name ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        ).filter(item => item.quantity > 0)
      );
    } catch (error) {
      console.error('Error in updateQuantity:', error);
      setErrorMessage('Failed to update quantity');
    }
  };

  const removeItem = (name) => {
    try {
      setCart(prevCart => prevCart.filter(item => item.name !== name));
    } catch (error) {
      console.error('Error in removeItem:', error);
      setErrorMessage('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    try {
      return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    } catch (error) {
      console.error('Error in calculateTotal:', error);
      return 0;
    }
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text) => {
    try {
      navigator.clipboard.writeText(text);
      alert('Phone number copied to clipboard!');
    } catch (error) {
      console.error('Error in copyToClipboard:', error);
      setErrorMessage('Failed to copy to clipboard');
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setShowCheckoutModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date().toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const orderId = `ORD${Math.floor(Math.random() * 100000)}`; // Simple random order ID
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + (formData.deliveryOption === 'standard' ? 2 : 1)); // Standard: +2 days, Express: +1 day
    const estimatedDeliveryString = estimatedDelivery.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const newOrder = {
      id: orderId,
      date: currentDate,
      items: [...cart], // Copy current cart items
      total: calculateTotal(),
      status: "Order Placed",
      estimatedDelivery: estimatedDeliveryString,
      trackingSteps: [
        { step: "Order Placed", completed: true, date: `${currentDate}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` },
        { step: "Processing", completed: false, date: "Pending" },
        { step: "Shipped", completed: false, date: "Pending" },
        { step: "Out for Delivery", completed: false, date: "Pending" },
        { step: "Delivered", completed: false, date: "Pending" },
      ],
    };

    setOrders(prevOrders => [...prevOrders, newOrder]); // Add new order to orders array
    setShowPaymentModal(false);
    setCart([]); // Clear the cart
    alert('Payment successful! Your order has been placed.');
    setShowTrackingModal(true); // Open tracking modal
  };

  const handlePrescriptionUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setErrorMessage('No file selected');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const prescriptionText = event.target.result;
          console.log('Prescription text:', prescriptionText);

          const prescribedMedicines = await analyzePrescriptionWithGemini(prescriptionText);
          console.log('Prescribed medicines from Gemini:', prescribedMedicines);

          if (!prescribedMedicines || prescribedMedicines.length === 0) {
            throw new Error('No valid medicines found in prescription');
          }

          setCart(prevCart => {
            const updatedCart = [...prevCart];
            prescribedMedicines.forEach(newItem => {
              const existingItemIndex = updatedCart.findIndex(item => item.name === newItem.name);
              if (existingItemIndex !== -1) {
                updatedCart[existingItemIndex] = {
                  ...updatedCart[existingItemIndex],
                  quantity: updatedCart[existingItemIndex].quantity + newItem.quantity
                };
              } else {
                updatedCart.push(newItem);
              }
            });
            console.log('Updated cart:', updatedCart);
            return updatedCart;
          });

          const total = calculateTotal();
          alert(`Prescription processed successfully!\n${prescribedMedicines.length} items added to cart.\nTotal Cost: ₹${total}`);
          setErrorMessage('');
        } catch (error) {
          console.error('Error processing prescription text:', error);
          setErrorMessage(`Error processing prescription: ${error.message}`);
          alert(`Error processing prescription: ${error.message}`);
        }
      };

      reader.onerror = (error) => {
        console.error('File reader error:', error);
        setErrorMessage('Error reading file');
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error in handlePrescriptionUpload:', error);
      setErrorMessage('Error uploading prescription');
    }
  };

  const analyzePrescriptionWithGemini = async (text) => {
    try {
      const prompt = `
        Analyze this prescription text and extract medicine names and quantities.
        Available medicines are: ${medicines.map(m => m.name).join(', ')}
        Return only medicines that match the available list.
        Format the response as a JSON array of objects with "name" and "quantity" properties.
        If quantity is not specified, default to 1.
        Prescription text:
        ${text}
      `;

      console.log('Sending prompt to Gemini:', prompt);
      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();
      console.log('Raw Gemini response:', responseText);

      const cleanedResponse = responseText
        .replace(/json/g, '')
        .replace(/`/g, '')
        .trim();

      console.log('Cleaned response:', cleanedResponse);

      let extractedMedicines;
      try {
        extractedMedicines = JSON.parse(cleanedResponse);
      } catch (parseError) {
        throw new Error(`Failed to parse Gemini response: ${parseError.message}`);
      }

      if (!Array.isArray(extractedMedicines)) {
        throw new Error('Gemini response is not an array');
      }

      const validMedicines = extractedMedicines.map(item => {
        const medicine = medicines.find(m => m.name.toLowerCase() === item.name.toLowerCase());
        return medicine ? { 
          name: medicine.name,
          price: medicine.price,
          type: medicine.type,
          quantity: Number(item.quantity) || 1 
        } : null;
      }).filter(Boolean);

      console.log('Valid medicines:', validMedicines);
      return validMedicines;
    } catch (error) {
      console.error('Error in analyzePrescriptionWithGemini:', error);
      throw error;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">Online Pharmacy</h1>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search medicines..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {filteredMedicines.map((medicine) => (
                <div key={medicine.name} className="p-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                  <h3 className="font-semibold text-gray-900 text-lg">{medicine.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{medicine.type}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold text-blue-600 text-lg">₹{medicine.price}</span>
                    <button 
                      onClick={() => addToCart(medicine)} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Pharmacies</h2>
            <div className="space-y-6">
              {pharmacies.map((pharmacy) => (
                <div key={pharmacy.name} className="flex items-center justify-between p-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{pharmacy.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{pharmacy.distance} away</p>
                  </div>
                  <div className="text-right space-y-3">
                    <p className="text-sm text-green-600 font-medium">{pharmacy.time}</p>
                    <div className="flex gap-3">
                      <a href={pharmacy.website} target="_blank" className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all">
                        Visit Store
                      </a>
                      <a href={pharmacy.maps} target="_blank" className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all">
                        <MapPin size={18} />
                      </a>
                      <button 
                        onClick={() => alert(pharmacy.phone)} 
                        className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-all"
                      >
                        <Phone size={18} />
                      </button>
                      <button 
                        onClick={() => copyToClipboard(pharmacy.phone)} 
                        className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <Upload className="text-blue-600" size={24} />
              <h3 className="font-semibold text-xl">Upload Prescription</h3>
            </div>
            <p className="text-gray-600 mb-6 text-sm">Upload your prescription for quick order processing</p>
            <label className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium flex items-center justify-center cursor-pointer">
              Upload Now
              <input
                type="file"
                accept=".txt"
                onChange={handlePrescriptionUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <Truck className="text-blue-600" size={24} />
              <h3 className="font-semibold text-xl">Track Orders</h3>
            </div>
            <p className="text-gray-600 mb-6 text-sm">Monitor the status of your pharmacy orders in real-time</p>
            <button
              onClick={() => setShowTrackingModal(true)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium flex items-center justify-center"
            >
              Track Your Orders
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="font-semibold text-xl mb-6">Cart</h3>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Your cart is empty</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.name} className="flex items-center justify-between mb-6 p-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500 mt-1">₹{item.price} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateQuantity(item.name, -1)} 
                        className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.name, 1)} 
                        className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all flex items-center justify-center"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeItem(item.name)} 
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all flex items-center justify-center"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-6">
                  <div className="flex justify-between text-lg font-semibold py-4 border-t border-gray-100">
                    <span>Total:</span>
                    <span className="text-blue-600">₹{calculateTotal()}</span>
                  </div>
                  <button 
                    onClick={() => setShowCheckoutModal(true)} 
                    className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900">Checkout</h3>
              <button 
                onClick={() => setShowCheckoutModal(false)} 
                className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[100px]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Option</label>
                <select
                  value={formData.deliveryOption}
                  onChange={(e) => setFormData({ ...formData, deliveryOption: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="standard">Standard Delivery (24 hours)</option>
                  <option value="express">Express Delivery (2-4 hours)</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium"
              >
                Continue to Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900">Payment</h3>
              <button 
                onClick={() => setShowPaymentModal(false)} 
                className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="space-y-8">
              <div className="bg-gray-50 p-5 rounded-xl">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium text-gray-700">Amount to Pay:</span>
                  <span className="font-bold text-blue-600">₹{calculateTotal()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative flex cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="upi" 
                      className="peer sr-only" 
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                    />
                    <div className="w-full p-4 text-gray-600 bg-white border border-gray-200 rounded-xl peer-checked:border-blue-600 peer-checked:text-blue-600 hover:bg-gray-50 transition-all">
                      <div className="flex items-center">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" 
                          className="w-8 h-8 object-contain" 
                          alt="UPI Logo" 
                        />
                        <div className="ml-3 font-medium">UPI</div>
                      </div>
                    </div>
                  </label>
                  <label className="relative flex cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="card" 
                      className="peer sr-only"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <div className="w-full p-4 text-gray-600 bg-white border border-gray-200 rounded-xl peer-checked:border-blue-600 peer-checked:text-blue-600 hover:bg-gray-50 transition-all">
                      <div className="flex items-center">
                        <CreditCard className="w-6 h-6" />
                        <div className="ml-3 font-medium">Card</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@sbi"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      {isUpiVerified && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        placeholder="123"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium"
              >
                Pay ₹{calculateTotal()}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900">Track Your Orders</h3>
              <button
                onClick={() => setShowTrackingModal(false)}
                className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders to track</p>
            ) : (
              <div className="space-y-8">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">Order #{order.id}</h4>
                        <p className="text-sm text-gray-500">Placed on: {order.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 
                        order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700">Items:</p>
                      {order.items.map((item, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {item.name} x {item.quantity} - ₹{item.price * item.quantity}
                        </p>
                      ))}
                      <p className="text-lg font-semibold text-blue-600 mt-2">Total: ₹{order.total}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700">Estimated Delivery: {order.estimatedDelivery}</p>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm font-medium text-gray-700">Tracking Progress:</p>
                      {order.trackingSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${
                            step.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <div>
                            <p className={`text-sm font-medium ${
                              step.completed ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {step.step}
                            </p>
                            <p className="text-xs text-gray-500">{step.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}