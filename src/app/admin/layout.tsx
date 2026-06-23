import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  ArrowLeft, 
  Monitor,
  UserCheck
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Secure route check: Session must exist and user's role must be admin
  if (!session || (session.user as any).role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex">
      {/* Sidebar navigation */}
      <aside className="w-64 border-r border-white/10 bg-[#0f1629]/95 backdrop-blur-md flex flex-col sticky top-0 h-screen z-30">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <Monitor className="w-6 h-6 text-[#00d4ff]" />
            <span className="text-xl font-bold tracking-wider">
              <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                MM
              </span>{' '}
              <span className="text-white text-sm">Control</span>
            </span>
          </Link>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#00ff88]">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Admin Authenticated</span>
          </div>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 p-4 space-y-1.5">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-gray-300 hover:text-white font-medium group text-sm"
          >
            <LayoutDashboard className="w-5 h-5 text-gray-500 group-hover:text-[#00d4ff] transition-colors" />
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-gray-300 hover:text-white font-medium group text-sm"
          >
            <Package className="w-5 h-5 text-gray-500 group-hover:text-[#00ff88] transition-colors" />
            Products
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-gray-300 hover:text-white font-medium group text-sm"
          >
            <ShoppingBag className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
            Orders
          </Link>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 justify-center w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl text-sm font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main content container */}
      <main className="flex-1 min-h-screen bg-[#0a0e1a] overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
