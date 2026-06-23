import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MM Sri Lanka | No 1 Computer Parts & Gaming Workstation Store',
  description: 'Shop genuine computer parts in Sri Lanka. Graphics cards, processors, motherboards, RAM, custom gaming PC builds, and warranty support.',
  keywords: 'computer parts sri lanka, gaming PC builder, custom PC sri lanka, graphics cards colombo, AMD ryzen, Intel core, ASUS, MSI, Gigabyte',
  openGraph: {
    title: 'MM Sri Lanka | Premium Computer Hardware & Custom PC Builder',
    description: 'Build your dream gaming rig or professional workstation with top-tier computer components. Island-wide cash-on-delivery in Sri Lanka.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full flex flex-col bg-[#0a0e1a] text-gray-100 selection:bg-[#00d4ff]/30 selection:text-white font-sans overflow-x-hidden">
        <Providers>
          <Navbar />
          <main className="flex-1 pt-24 pb-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
