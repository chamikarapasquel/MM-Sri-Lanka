'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { User, Settings, ShoppingBag, Heart, Shield, LogOut } from 'lucide-react';

export default function AccountDashboard() {
  const { data: session } = useSession();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-white font-heading">
          My Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Profile */}
          <div className="md:col-span-1 border border-white/5 bg-[#111827]/40 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] rounded-full flex items-center justify-center text-xl font-bold uppercase text-white shadow-xl">
              {session?.user?.name?.substring(0, 2) || 'US'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{session?.user?.name || 'Customer'}</h2>
              <p className="text-xs text-gray-500">{session?.user?.email || 'guest@mmsrilanka.lk'}</p>
            </div>
            <div className="w-full pt-4 border-t border-white/5 space-y-2 text-left">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Membership</span>
              <div className="text-xs font-semibold text-[#00ff88]">Standard Customer Profile</div>
            </div>
          </div>

          {/* Quick Dashboard controls */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Order History', desc: 'Track and review past store purchases.', icon: ShoppingBag, href: '/account/orders', color: 'text-[#00d4ff]' },
              { title: 'Saved Wishlist', desc: 'View products saved in your wishlist.', icon: Heart, href: '/account/wishlist', color: 'text-red-400' },
              { title: 'Profile Settings', desc: 'Modify password and address listings.', icon: Settings, href: '/account/settings', color: 'text-purple-400' },
              { title: 'Security & Auth', desc: 'Secure two factor authentication options.', icon: Shield, href: '/account/security', color: 'text-green-400' }
            ].map((box, idx) => {
              const Icon = box.icon;
              return (
                <Link
                  key={idx}
                  href={box.href}
                  className="bg-[#111827]/40 border border-white/5 p-5 rounded-2xl hover:border-[#00d4ff]/20 transition-all flex items-start gap-4"
                >
                  <div className={`p-3 bg-white/5 rounded-xl ${box.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{box.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{box.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
