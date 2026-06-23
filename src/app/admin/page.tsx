import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Link from 'next/link';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await connectDB();

  // Fetch metrics in parallel
  const [
    totalOrdersCount,
    totalProductsCount,
    totalUsersCount,
    recentOrders,
    salesStats
  ] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .lean(),
    Order.aggregate([
      { $match: { paymentStatus: 'paid', status: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
    ])
  ]);

  const totalSales = salesStats[0]?.totalSales || 0;

  // Count pending/processing orders for warnings
  const pendingOrders = await Order.countDocuments({ status: { $in: ['pending', 'processing'] } });

  // Group status stats
  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  const statusCounts = ordersByStatus.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1.5">Live store activity, performance statistics, and quick management links.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-[#111827]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#00d4ff]/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00d4ff]/5 rounded-full blur-xl group-hover:bg-[#00d4ff]/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Revenue</span>
            <div className="p-2 bg-[#00d4ff]/10 rounded-xl text-[#00d4ff]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">{formatPrice(totalSales)}</h3>
            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1 text-[#00ff88]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Paid & fulfilled orders</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#111827]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Orders</span>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">{totalOrdersCount}</h3>
            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-500 font-semibold">{pendingOrders} pending/processing</span>
            </p>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-[#111827]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#00ff88]/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff88]/5 rounded-full blur-xl group-hover:bg-[#00ff88]/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Products</span>
            <div className="p-2 bg-[#00ff88]/10 rounded-xl text-[#00ff88]">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">{totalProductsCount}</h3>
            <p className="text-xs text-gray-400 mt-1.5">Active items in catalog</p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-[#111827]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-pink-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-xl group-hover:bg-pink-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Customers</span>
            <div className="p-2 bg-pink-500/10 rounded-xl text-pink-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">{totalUsersCount}</h3>
            <p className="text-xs text-gray-400 mt-1.5">Registered accounts</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (Left 2 Columns) */}
        <div className="lg:col-span-2 bg-[#111827]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Recent Orders</h2>
              <p className="text-xs text-gray-400 mt-0.5">Summary of the latest customer purchases.</p>
            </div>
            <Link 
              href="/admin/orders" 
              className="text-xs font-semibold text-[#00d4ff] hover:text-[#00ff88] flex items-center gap-1 transition-colors"
            >
              View All Orders
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">No orders found.</div>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 font-semibold">
                    <th className="pb-3 pr-4">Order ID</th>
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Total</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map((order: any) => (
                    <tr key={order._id} className="group hover:bg-white/5 transition-colors">
                      <td className="py-3.5 pr-4 font-mono font-medium text-gray-300">
                        {order.orderNumber || `MM-${order._id.toString().substring(0, 8).toUpperCase()}`}
                      </td>
                      <td className="py-3.5 pr-4 text-white font-medium">
                        {order.user?.name || 'Guest User'}
                      </td>
                      <td className="py-3.5 pr-4 font-semibold text-gray-200">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ${
                          order.status === 'delivered' ? 'bg-[#00ff88]/10 text-[#00ff88]' :
                          order.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                          order.status === 'shipped' ? 'bg-[#00d4ff]/10 text-[#00d4ff]' :
                          'bg-amber-500/10 text-amber-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions (Right 1 Column) */}
        <div className="space-y-6">
          {/* Quick Tasks */}
          <div className="bg-[#111827]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Management</h2>
            <div className="space-y-3">
              <Link
                href="/admin/products/new"
                className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 hover:border-white/15 rounded-xl text-sm font-semibold transition-all group hover:bg-white/10"
              >
                <span>Create New Product</span>
                <Package className="w-4 h-4 text-gray-400 group-hover:text-[#00ff88] transition-colors" />
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 hover:border-white/15 rounded-xl text-sm font-semibold transition-all group hover:bg-white/10"
              >
                <span>Edit & Delete Products</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#00d4ff] transition-colors" />
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 hover:border-white/15 rounded-xl text-sm font-semibold transition-all group hover:bg-white/10"
              >
                <span>Fulfill Customer Orders</span>
                <Clock className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Fulfillment Status Widget */}
          <div className="bg-[#111827]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Order Breakdown</h2>
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-400">
                  <span>Pending / Processing</span>
                  <span>{statusCounts['pending'] || 0}</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full" 
                    style={{ width: `${(statusCounts['pending'] || 0) / (totalOrdersCount || 1) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-400">
                  <span>Shipped / En Route</span>
                  <span>{statusCounts['shipped'] || 0}</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#00d4ff] h-full rounded-full" 
                    style={{ width: `${(statusCounts['shipped'] || 0) / (totalOrdersCount || 1) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-400">
                  <span>Delivered</span>
                  <span>{statusCounts['delivered'] || 0}</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#00ff88] h-full rounded-full" 
                    style={{ width: `${(statusCounts['delivered'] || 0) / (totalOrdersCount || 1) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
