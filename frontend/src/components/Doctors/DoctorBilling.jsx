import React from 'react';
import { Download, Plus, DollarSign, CreditCard, Filter } from 'lucide-react';
import { Line } from 'react-chartjs-2';

const BillingDoc = () => {
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [3000, 3500, 2800, 4200, 3800, 4500],
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Monthly Revenue'
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Billing & Payments</h1>
        <div className="flex space-x-4">
          <button className="btn-secondary flex items-center space-x-2">
            <Download size={20} />
            <span>Export</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Plus size={20} />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">$24,500</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-800">$3,200</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
              <CreditCard size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Payments</p>
              <p className="text-2xl font-bold text-gray-800">$21,300</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
        <div className="h-64">
          <Line options={chartOptions} data={revenueData} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <button className="btn-secondary flex items-center space-x-2">
              <Filter size={20} />
              <span>Filter</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-4">Invoice ID</th>
                <th className="pb-4">Patient</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[1, 2, 3].map((_, index) => (
                <tr key={index}>
                  <td className="py-4">#INV-{1000 + index}</td>
                  <td className="py-4">John Doe</td>
                  <td className="py-4">Mar 10, 2024</td>
                  <td className="py-4">$150.00</td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-blue-600 hover:text-blue-800">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingDoc;