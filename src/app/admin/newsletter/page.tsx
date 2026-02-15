'use client';

import { useState } from 'react';
import { Mail, Download, Send } from 'lucide-react';

export default function AdminNewsletterPage() {
  const [subscribers] = useState([
    { email: 'user1@example.com', subscribedAt: '2024-02-10', status: 'active' },
    { email: 'user2@example.com', subscribedAt: '2024-02-08', status: 'active' },
    { email: 'user3@example.com', subscribedAt: '2024-02-05', status: 'active' },
  ]);

  const exportSubscribers = () => {
    const csv = 'Email,Subscribed At,Status\n' + 
      subscribers.map(s => `${s.email},${s.subscribedAt},${s.status}`).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
            <p className="text-gray-600 mt-2">Manage email subscribers</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportSubscribers}
              className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              Export CSV
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Campaign
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <div className="text-sm font-medium text-gray-600">Total Subscribers</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{subscribers.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Active</div>
            <div className="text-3xl font-bold text-green-600">
              {subscribers.filter(s => s.status === 'active').length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">This Month</div>
            <div className="text-3xl font-bold text-blue-600">+12</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Subscribed
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscribers.map((subscriber, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {subscriber.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
