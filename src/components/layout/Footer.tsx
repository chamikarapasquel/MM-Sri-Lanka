'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for subscribing to our newsletter!');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <footer className="bg-[#05070f] border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      {/* Glow effect in footer */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#7c3aed]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#00d4ff]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Logo & Tagline */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-tight text-white">
                <span className="bg-gradient-to-r from-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent">
                  MM
                </span>{' '}
                Sri Lanka
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm">
              Your ultimate partner for premium computer builds, high-end components, and professional workstations in Sri Lanka.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="w-5 h-5 text-[#00d4ff] shrink-0" />
                <span>No. 123, Galle Road, Colombo 03, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-5 h-5 text-[#00d4ff] shrink-0" />
                <span>+94 11 234 5678 / +94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-5 h-5 text-[#00d4ff] shrink-0" />
                <span>sales@mmsrilanka.lk</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm">
                  Tech Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm">
                  Warranty Claim
                </Link>
              </li>
              <li>
                <Link href="/build-my-pc" className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm">
                  PC Configurator
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Stay Connected</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get notified about special deals and new arrivals.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                placeholder="Enter email address"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff]/40 transition-colors"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white text-xs font-semibold rounded-xl hover:shadow-md hover:shadow-[#00d4ff]/10 transition-all uppercase tracking-wider"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="border-white/5 my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} MM Sri Lanka. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-400 text-xs">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-400 text-xs">
              Terms of Service
            </Link>
          </div>
          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/10 text-gray-400 hover:text-[#00d4ff] transition-all" aria-label="Facebook">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
            </a>
            <a href="#" className="p-2 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/10 text-gray-400 hover:text-[#00d4ff] transition-all" aria-label="Instagram">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="p-2 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/10 text-gray-400 hover:text-[#00d4ff] transition-all" aria-label="YouTube">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.02 0 12 0 12s0 3.98.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.98 24 12 24 12s0-3.98-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="#" className="p-2 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/10 text-gray-400 hover:text-[#00d4ff] transition-all" aria-label="Twitter">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
