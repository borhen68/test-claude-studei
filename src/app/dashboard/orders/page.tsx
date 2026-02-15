'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Package, Truck, CheckCircle, Clock, MapPin, ExternalLink } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  book: {
    title: string;
    coverImageUrl?: string;
  };
  config: {
    size: string;
    quantity: number;
  };
  shippingAddress?: {
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered'>('all');

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
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

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'from-gray-500 to-gray-600';
      case 'processing': return 'from-amber-500 to-orange-500';
      case 'shipped': return 'from-blue-500 to-indigo-500';
      case 'delivered': return 'from-green-500 to-emerald-500';
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const filterOptions = [
    { value: 'all' as const, label: 'All Orders', count: orders.length },
    { value: 'pending' as const, label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { value: 'processing' as const, label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { value: 'shipped' as const, label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { value: 'delivered' as const, label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Order History
          </h1>
          <p className="text-neutral-600 mt-2">Track your photo book orders</p>
        </div>

        {/* Filter tabs */}
        <div className="glass rounded-2xl p-2 inline-flex gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`relative px-6 py-3 rounded-xl font-medium transition-all ${
                filter === option.value
                  ? 'text-white'
                  : 'text-neutral-700 hover:bg-white/50'
              }`}
            >
              {filter === option.value && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {option.label}
                {option.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    filter === option.value 
                      ? 'bg-white/20' 
                      : 'bg-neutral-200'
                  }`}>
                    {option.count}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="flex gap-6">
                  <div className="w-24 h-32 bg-neutral-200 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-neutral-200 rounded w-1/4" />
                    <div className="h-6 bg-neutral-200 rounded w-1/2" />
                    <div className="h-3 bg-neutral-200 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-12 text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
              <Package className="w-12 h-12 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">No orders yet</h3>
            <p className="text-neutral-600 max-w-md mx-auto">
              {filter === 'all' 
                ? "You haven't placed any orders yet. Create a book and order your first print!"
                : `No ${filter} orders found.`
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.status);
              const statusColor = getStatusColor(order.status);
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Book cover */}
                    <div className="w-24 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-violet-100 to-indigo-100 flex-shrink-0">
                      {order.book.coverImageUrl ? (
                        <img 
                          src={order.book.coverImageUrl} 
                          alt={order.book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-10 h-10 text-violet-400" />
                        </div>
                      )}
                    </div>

                    {/* Order details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-neutral-900">
                              {order.book.title}
                            </h3>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${statusColor}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </div>
                          </div>
                          <p className="text-sm text-neutral-600 mb-1">
                            Order #{order.orderNumber}
                          </p>
                          <p className="text-xs text-neutral-500">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-neutral-900">
                            {formatPrice(order.total)}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {order.config.quantity} {order.config.quantity > 1 ? 'copies' : 'copy'}
                          </div>
                        </div>
                      </div>

                      {/* Timeline / Progress */}
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          {['pending', 'processing', 'shipped', 'delivered'].map((step, i) => {
                            const isComplete = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= i;
                            return (
                              <div key={step} className="flex-1 relative">
                                <div className={`h-2 rounded-full ${isComplete ? 'bg-gradient-to-r from-violet-500 to-indigo-500' : 'bg-neutral-200'}`} />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Additional info */}
                      <div className="flex flex-wrap gap-4 mt-4 text-sm">
                        {order.estimatedDelivery && (
                          <div className="flex items-center gap-2 text-neutral-600">
                            <Clock className="w-4 h-4" />
                            Est. delivery: {formatDate(order.estimatedDelivery)}
                          </div>
                        )}
                        {order.trackingNumber && (
                          <a 
                            href={`https://www.fedex.com/fedextrack/?tracknumbers=${order.trackingNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium transition-colors"
                          >
                            <Truck className="w-4 h-4" />
                            Track package
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {order.shippingAddress && (
                          <div className="flex items-center gap-2 text-neutral-600">
                            <MapPin className="w-4 h-4" />
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
