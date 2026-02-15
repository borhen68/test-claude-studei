'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function BillingPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600 mt-2">Manage your payment methods and invoices</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Billing Coming Soon
            </h3>
            <p className="text-gray-600">
              Payment methods and invoice management will be available soon.
              <br />
              For now, all payments are processed securely through Stripe at checkout.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
