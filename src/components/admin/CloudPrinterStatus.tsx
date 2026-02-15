'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

interface CloudPrinterStatusProps {
  orderId: string;
  cloudprinterId?: string;
}

export function CloudPrinterStatus({ orderId, cloudprinterId }: CloudPrinterStatusProps) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    if (!cloudprinterId) return;
    
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/cloudprinter/order/${cloudprinterId}`);
      const data = await res.json();

      if (data.success) {
        setStatus(data.order);
      } else {
        setError(data.error || 'Failed to fetch status');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cloudprinterId) {
      fetchStatus();
    }
  }, [cloudprinterId]);

  if (!cloudprinterId) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-500">
          CloudPrinter order not yet created
        </p>
      </div>
    );
  }

  if (loading && !status) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-gray-600">Loading status...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchStatus}
              className="text-sm text-red-600 hover:text-red-700 underline mt-2"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'in_production':
      case 'processing':
        return <Package className="w-5 h-5 text-orange-600" />;
      default:
        return <Loader2 className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'delivered':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'shipped':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'in_production':
      case 'processing':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  return (
    <div className="space-y-4">
      <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getStatusIcon()}
            <div className="ml-3">
              <p className="font-semibold capitalize">{status.status.replace('_', ' ')}</p>
              <p className="text-xs opacity-75">
                CloudPrinter ID: {cloudprinterId}
              </p>
            </div>
          </div>
          <button
            onClick={fetchStatus}
            className="text-sm opacity-75 hover:opacity-100 underline"
          >
            Refresh
          </button>
        </div>
      </div>

      {status.items && status.items.length > 0 && (
        <div className="space-y-2">
          {status.items.map((item: any, index: number) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-semibold text-gray-900">
                Item: {item.reference}
              </p>
              <p className="text-xs text-gray-600 capitalize">
                Status: {item.status.replace('_', ' ')}
              </p>
              
              {item.tracking && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Tracking:</p>
                  <div className="flex items-center justify-between">
                    <code className="text-xs font-mono text-gray-900">
                      {item.tracking.number}
                    </code>
                    {item.tracking.url && (
                      <a
                        href={item.tracking.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
                      >
                        Track
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Carrier: {item.tracking.carrier}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>Created: {new Date(status.created_at).toLocaleString()}</p>
        <p>Updated: {new Date(status.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
}
