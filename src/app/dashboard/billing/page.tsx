'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard-layout';
import { CreditCard, Download, Calendar, TrendingUp } from 'lucide-react';

interface Invoice {
  id: string;
  orderNumber: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
  pdfUrl?: string;
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/billing/invoices')
      .then((res) => res.json())
      .then((data) => setInvoices(data.invoices || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const totalSpent = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Billing
          </h1>
          <p className="text-neutral-600 mt-2">Manage your payment methods and invoices</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100">
                <TrendingUp className="w-6 h-6 text-violet-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">
              {formatPrice(totalSpent)}
            </div>
            <div className="text-sm text-neutral-600">Total spent</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">{invoices.length}</div>
            <div className="text-sm text-neutral-600">Total invoices</div>
          </motion.div>
        </div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100">
              <CreditCard className="w-6 h-6 text-violet-600" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">Payment Method</h2>
          </div>

          <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 rounded bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <div className="font-semibold text-neutral-900">•••• •••• •••• 4242</div>
                <div className="text-sm text-neutral-600">Expires 12/25</div>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-white hover:bg-neutral-50 text-neutral-900 font-medium transition-colors text-sm">
              Update
            </button>
          </div>
        </motion.div>

        {/* Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Invoice History</h2>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-neutral-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-violet-500" />
              </div>
              <p className="text-neutral-600">No invoices yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900">{invoice.orderNumber}</div>
                    <div className="text-sm text-neutral-600">{formatDate(invoice.date)}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                    <div className="font-bold text-neutral-900 min-w-[80px] text-right">
                      {formatPrice(invoice.amount)}
                    </div>
                    <button className="p-2 rounded-lg hover:bg-violet-50 text-violet-600 transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
