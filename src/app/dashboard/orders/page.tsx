'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';

interface Order {
  id: string;
  status: string;
  total: number;
  currency: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  book: {
    id: string;
    title: string;
    coverImageUrl?: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Track your photo book orders</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600">Your orders will appear here once you make a purchase</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <Link href={`/book/${order.book.id}`}>
                    {order.book.coverImageUrl ? (
                      <img
                        src={order.book.coverImageUrl}
                        alt={order.book.title}
                        className="w-24 h-32 object-cover rounded"
                      />
                    ) : (
                      <div className="w-24 h-32 bg-gray-100 rounded flex items-center justify-center text-3xl">
                        📖
                      </div>
                    )}
                  </Link>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/book/${order.book.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                        >
                          {order.book.title}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          Order #{order.id.slice(0, 8)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(order.total, order.currency)}
                        </p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Ordered</p>
                        <p className="font-medium text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {order.paidAt && (
                        <div>
                          <p className="text-gray-600">Paid</p>
                          <p className="font-medium text-gray-900">
                            {new Date(order.paidAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {order.shippedAt && (
                        <div>
                          <p className="text-gray-600">Shipped</p>
                          <p className="font-medium text-gray-900">
                            {new Date(order.shippedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {order.trackingNumber && (
                        <div className="col-span-2">
                          <p className="text-gray-600">Tracking</p>
                          {order.trackingUrl ? (
                            <a
                              href={order.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:text-blue-700"
                            >
                              {order.trackingNumber}
                            </a>
                          ) : (
                            <p className="font-medium text-gray-900">
                              {order.trackingNumber}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
