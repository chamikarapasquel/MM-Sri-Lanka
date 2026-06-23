'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Monitor,
  Cpu,
  Keyboard,
  Laptop,
  LogOut,
  Settings,
  ShoppingBag,
  Wrench,
  Grid
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

const CATEGORY_GROUPS = [
  {
    title: 'Components',
    icon: Cpu,
    items: [
      { name: 'Processors', href: '/products?category=processors' },
      { name: 'Motherboards', href: '/products?category=motherboards' },
      { name: 'Graphics Cards', href: '/products?category=graphics%20cards' },
      { name: 'Memory', href: '/products?category=memory' },
      { name: 'SSD', href: '/products?category=ssd' },
      { name: 'Storage', href: '/products?category=storage' },
      { name: 'Power Supply', href: '/products?category=power%20supply' },
      { name: 'PC Cases', href: '/products?category=pc%20cases' },
      { name: 'Coolers', href: '/products?category=coolers' },
      { name: 'Thermal Paste', href: '/products?category=thermal%20paste' }
    ]
  },
  {
    title: 'Peripherals',
    icon: Keyboard,
    items: [
      { name: 'Monitors', href: '/products?category=monitors' },
      { name: 'Keyboards', href: '/products?category=keyboards' },
      { name: 'Mouse', href: '/products?category=mouse' },
      { name: 'Mouse Pad', href: '/products?category=mouse%20pad' },
      { name: 'Headsets', href: '/products?category=headsets' },
      { name: 'Speakers', href: '/products?category=speakers' },
      { name: 'Printers', href: '/products?category=printers' }
    ]
  },
  {
    title: 'Gaming & Laptops',
    icon: Laptop,
    items: [
      { name: 'Laptops', href: '/products?category=laptops' },
      { name: 'Chairs', href: '/products?category=chairs' },
      { name: 'Tables', href: '/products?category=tables' },
      { name: 'Consoles', href: '/products?category=consoles' },
      { name: 'Streaming', href: '/products?category=streaming' }
    ]
  },
  {
    title: 'Accessories & Power',
    icon: Monitor,
    items: [
      { name: 'UPS', href: '/products?category=ups' },
      { name: 'Cables', href: '/products?category=cables' },
      { name: 'Adapters', href: '/products?category=adapters' },
      { name: 'Power Banks', href: '/products?category=power%20banks' },
      { name: 'Expansion Cards', href: '/products?category=expansion%20cards' },
      { name: 'Software', href: '/products?category=software' }
    ]
  }
];

const BRANDS = [
  { name: 'ASUS', href: '/products?brand=ASUS' },
  { name: 'MSI', href: '/products?brand=MSI' },
  { name: 'Gigabyte', href: '/products?brand=Gigabyte' },
  { name: 'Corsair', href: '/products?brand=Corsair' },
  { name: 'AMD', href: '/products?brand=AMD' },
  { name: 'Intel', href: '/products?brand=Intel' },
  { name: 'Samsung', href: '/products?brand=Samsung' },
  { name: 'Logitech', href: '/products?brand=Logitech' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  
  const cartItemsCount = useCartStore((state) => state.getItemCount());
  const wishlistItemsCount = useWishlistStore((state) => state.getCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0e1a]/85 backdrop-blur-md py-3 border-b border-white/5 shadow-lg shadow-black/20'
            : 'bg-[#0a0e1a]/40 backdrop-blur-sm py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-[#00d4ff]/10 rounded-xl group-hover:bg-[#00d4ff]/20 transition-colors">
                <Cpu className="w-6 h-6 text-[#00d4ff] group-hover:rotate-12 transition-transform" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                  MM
                </span>{' '}
                Sri Lanka
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-white ${
                  pathname === '/' ? 'text-[#00d4ff]' : 'text-gray-300'
                }`}
              >
                Home
              </Link>

              {/* Products Dropdown (Mega Menu) */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('products')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors py-2">
                  Products <ChevronDown className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'products' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 mt-1 w-[800px] bg-[#0c1224]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl z-50 grid grid-cols-4 gap-6"
                    >
                      {CATEGORY_GROUPS.map((group) => {
                        const Icon = group.icon;
                        return (
                          <div key={group.title} className="space-y-3">
                            <h4 className="flex items-center gap-2 text-xs font-semibold text-[#00d4ff] uppercase tracking-wider">
                              <Icon className="w-4 h-4" />
                              {group.title}
                            </h4>
                            <ul className="space-y-1.5">
                              {group.items.map((item) => (
                                <li key={item.name}>
                                  <Link
                                    href={item.href}
                                    className="text-sm text-gray-400 hover:text-white transition-colors block py-0.5"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Brands Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('brands')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors py-2">
                  Brands <ChevronDown className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === 'brands' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-1 w-56 bg-[#0c1224]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50"
                    >
                      <ul className="grid grid-cols-2 gap-2">
                        {BRANDS.map((brand) => (
                          <li key={brand.name}>
                            <Link
                              href={brand.href}
                              className="text-sm text-gray-400 hover:text-white transition-colors block py-1"
                            >
                              {brand.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/products?category=laptops"
                className={`text-sm font-medium transition-colors hover:text-white ${
                  pathname.includes('category=laptops') ? 'text-[#00d4ff]' : 'text-gray-300'
                }`}
              >
                Laptops
              </Link>

              <Link
                href="/build-my-pc"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#00d4ff]/20 transition-all hover:scale-[1.02]"
              >
                <Wrench className="w-4 h-4" />
                Build My PC
              </Link>
            </nav>

            {/* Utility Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-gray-300 hover:text-white p-2 transition-colors"
                aria-label="Toggle search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className="relative text-gray-300 hover:text-white p-2 transition-colors hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {mounted && wishlistItemsCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#00ff88] text-[#0a0e1a] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative text-gray-300 hover:text-white p-2 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {mounted && cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#00d4ff] text-[#0a0e1a] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* User / Authentication */}
              <div className="relative">
                {session ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown('user')}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                      <div className="w-6 h-6 bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] text-white text-[10px] font-bold rounded-full flex items-center justify-center uppercase">
                        {session.user?.name?.substring(0, 2) || 'US'}
                      </div>
                      <ChevronDown className="w-4 h-4 hidden sm:block" />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === 'user' && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-1 w-56 bg-[#0c1224]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl z-50 space-y-1"
                        >
                          <div className="px-3 py-2 border-b border-white/5 text-xs text-gray-500">
                            Logged in as <span className="font-semibold text-gray-300">{session.user?.name}</span>
                          </div>
                          <Link
                            href="/account"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                          >
                            <Settings className="w-4 h-4" /> My Settings
                          </Link>
                          <Link
                            href="/account/orders"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                          >
                            <ShoppingBag className="w-4 h-4" /> My Orders
                          </Link>
                          {session.user && (session.user as { role?: string }).role === 'admin' && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#00ff88] hover:text-[#00ff88]/90 hover:bg-[#00ff88]/5 transition-all font-medium"
                            >
                              <Grid className="w-4 h-4" /> Admin Dashboard
                            </Link>
                          )}
                          <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all text-left"
                          >
                            <LogOut className="w-4 h-4" /> Log Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="p-2 border border-white/10 hover:border-[#00d4ff]/30 hover:bg-[#00d4ff]/5 text-gray-300 hover:text-white rounded-xl transition-all hidden sm:flex items-center gap-1.5 text-sm"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-gray-300 hover:text-white p-2 transition-colors lg:hidden"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Search Bar Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0a0e1a]/90 backdrop-blur-md flex items-center justify-center px-4"
          >
            <div className="w-full max-w-2xl relative">
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute -top-16 right-0 p-2 text-gray-400 hover:text-white border border-white/10 hover:border-white/30 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search computer parts, accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full px-6 py-4 pl-14 bg-white/5 border border-white/10 rounded-2xl text-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-2 focus:ring-[#00d4ff]/20 transition-all shadow-2xl"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white font-semibold rounded-xl text-sm"
                >
                  Search
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-[#0a0e1a] border-l border-white/10 flex flex-col p-6 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold text-white">Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white border border-white/10 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 flex-1">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search parts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/50"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </form>

                {/* Main Links */}
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white text-lg font-medium py-1"
                  >
                    Home
                  </Link>

                  <Link
                    href="/products"
                    className="text-gray-300 hover:text-white text-lg font-medium py-1"
                  >
                    All Products
                  </Link>

                  <Link
                    href="/build-my-pc"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white font-semibold shadow-lg shadow-[#00d4ff]/10 text-sm"
                  >
                    <Wrench className="w-4 h-4" />
                    Build My PC
                  </Link>
                </nav>

                <hr className="border-white/10" />

                {/* Categories Accordion */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Categories
                  </h4>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {CATEGORY_GROUPS.map((group) => (
                      <div key={group.title} className="space-y-1">
                        <div className="text-xs font-semibold text-[#00d4ff] uppercase py-1">
                          {group.title}
                        </div>
                        {group.items.slice(0, 5).map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm text-gray-400 hover:text-white block py-1 pl-2"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile User Profile at bottom */}
              <div className="pt-6 border-t border-white/10 mt-auto">
                {session ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] text-white font-bold rounded-full flex items-center justify-center uppercase">
                        {session.user?.name?.substring(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {session.user?.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {session.user?.email}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <Link
                        href="/account"
                        className="py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 font-medium"
                      >
                        Account
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-medium rounded-xl"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center gap-2 w-full py-3 border border-white/10 hover:border-[#00d4ff]/30 hover:bg-[#00d4ff]/5 text-white font-semibold rounded-xl text-sm"
                  >
                    <User className="w-4 h-4" />
                    Sign In to Account
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
