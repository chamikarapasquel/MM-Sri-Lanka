'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Truck,
  RotateCcw,
  CreditCard,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderData {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    district: string;
    postalCode: string;
  };
  totalAmount: number;
  shippingCost: number;
  discount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders?limit=100');
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, field: 'status' | 'paymentStatus', value: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (res.ok) {
        toast.success(`Order ${field} updated successfully`);
        // Update state local
        setOrders(orders.map((o) => {
          if (o._id === orderId) {
            return { ...o, [field]: value };
          }
          return o;
        }));
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update order');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating order');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter in memory
  const filteredOrders = orders.filter((order) => {
    const customerName = order.user?.name || order.shippingAddress?.fullName || '';
    const orderNum = order.orderNumber || '';
    const matchesSearch = 
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      orderNum.toLowerCase().includes(search.toLowerCase()) ||
      order._id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === '' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-purple-400" />
          Orders Management
        </h1>
        <p className="text-gray-400 mt-1">Track customer orders, fulfill delivery packages, and update payments status.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-[#111827]/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, order ID..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0a0e1a]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors cursor-pointer"
          >
            <option value="">All Fulfillment Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111827]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-gray-400">
            <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <span className="text-sm">Fetching store orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-gray-600" />
            <span>No orders match your search criteria.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider text-xs">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Payment</th>
                  <th className="pb-3 pr-4">Fulfillment Status</th>
                  <th className="pb-3 text-right">Update Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => {
                  const isUpdating = updatingId === order._id;
                  const formattedNum = order.orderNumber || `MM-${order._id.substring(0, 8).toUpperCase()}`;
                  
                  return (
                    <tr key={order._id} className="group hover:bg-white/5 transition-colors">
                      {/* Order Number */}
                      <td className="py-4 pr-4 font-mono font-semibold text-gray-300">
                        {formattedNum}
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 pr-4">
                        <div className="text-white font-medium">
                          {order.user?.name || order.shippingAddress?.fullName || 'Guest'}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {order.user?.email || 'N/A'} • {order.shippingAddress?.phone}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 pr-4 text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      {/* Total */}
                      <td className="py-4 pr-4 font-semibold text-gray-200">
                        {formatPrice(order.totalAmount)}
                        <div className="text-[10px] text-gray-500 font-normal uppercase tracking-wider mt-0.5">
                          {order.paymentMethod}
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 pr-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          order.paymentStatus === 'paid' ? 'bg-[#00ff88]/10 text-[#00ff88]' :
                          order.paymentStatus === 'failed' ? 'bg-red-500/10 text-red-400' :
                          'bg-amber-500/10 text-amber-500'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Fulfillment Status */}
                      <td className="py-4 pr-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          order.status === 'delivered' ? 'bg-[#00ff88]/10 text-[#00ff88]' :
                          order.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                          order.status === 'shipped' ? 'bg-[#00d4ff]/10 text-[#00d4ff]' :
                          'bg-amber-500/10 text-amber-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Update Dropdowns */}
                      <td className="py-4 text-right space-y-1.5 min-w-[200px]">
                        {isUpdating ? (
                          <div className="text-xs text-gray-500 py-2">Updating...</div>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-2 justify-end">
                            {/* Payment Status Dropdown */}
                            <select
                              value={order.paymentStatus}
                              disabled={order.status === 'cancelled'}
                              onChange={(e) => handleStatusChange(order._id, 'paymentStatus', e.target.value)}
                              className="px-2 py-1 bg-[#0a0e1a]/80 border border-white/10 rounded-lg text-xs text-gray-300 focus:outline-none focus:border-[#00d4ff]/40 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="failed">Failed</option>
                              <option value="refunded">Refunded</option>
                            </select>

                            {/* Fulfillment Status Dropdown */}
                            <select
                              value={order.status}
                              disabled={order.status === 'cancelled' || order.status === 'delivered'}
                              onChange={(e) => handleStatusChange(order._id, 'status', e.target.value)}
                              className="px-2 py-1 bg-[#0a0e1a]/80 border border-white/10 rounded-lg text-xs text-gray-300 focus:outline-none focus:border-[#00d4ff]/40 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        )}
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
}
