import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

const SEED_CATEGORIES = [
  { name: 'Processors', icon: 'Cpu', displayOrder: 1 },
  { name: 'Motherboards', icon: 'Grid', displayOrder: 2 },
  { name: 'Graphics Cards', icon: 'Monitor', displayOrder: 3 },
  { name: 'Memory', icon: 'HardDrive', displayOrder: 4 },
  { name: 'SSD', icon: 'HardDrive', displayOrder: 5 },
  { name: 'Power Supply', icon: 'Cpu', displayOrder: 6 },
  { name: 'PC Cases', icon: 'Monitor', displayOrder: 7 },
  { name: 'Coolers', icon: 'Cpu', displayOrder: 8 },
  { name: 'Monitors', icon: 'Monitor', displayOrder: 9 },
  { name: 'Keyboards', icon: 'Keyboard', displayOrder: 10 },
  { name: 'Mouse', icon: 'Mouse', displayOrder: 11 },
  { name: 'Headsets', icon: 'Headphones', displayOrder: 12 },
  { name: 'Laptops', icon: 'Laptop', displayOrder: 13 }
];

const SEED_PRODUCTS = [
  {
    name: 'AMD Ryzen 7 7800X3D 8-Core 16-Thread Processor',
    description: 'The ultimate gaming processor with AMD 3D V-Cache technology.',
    shortDescription: 'AMD Socket AM5 Processor for gaming excellence.',
    price: 115000,
    originalPrice: 125000,
    category: 'Processors',
    brand: 'AMD',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { Socket: 'AM5', Cores: '8', Threads: '16', Cache: '96MB L3' },
    stock: 12,
    sku: 'AMD-7800X3D',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    ratings: { average: 5.0, count: 48 },
    tags: ['cpu', 'amd', 'ryzen', 'gaming'],
    warranty: '3 Years Warranty'
  },
  {
    name: 'ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB GDDR6X',
    description: 'High performance graphics card with DLSS 3 and advanced thermal design.',
    shortDescription: 'ASUS ROG Strix Nvidia graphics card.',
    price: 345000,
    originalPrice: 365000,
    category: 'Graphics Cards',
    brand: 'ASUS',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { GPU: 'RTX 4070 Ti Super', Memory: '16GB GDDR6X', Interface: 'PCIe 4.0' },
    stock: 8,
    sku: 'ASUS-4070TIS',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    ratings: { average: 4.8, count: 32 },
    tags: ['gpu', 'nvidia', 'rtx', 'asus'],
    warranty: '3 Years Warranty'
  },
  {
    name: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz CL36',
    description: 'Stunning RGB styling and optimized performance for Intel and AMD motherboards.',
    shortDescription: 'Corsair DDR5 Gaming Memory Kit.',
    price: 45000,
    originalPrice: 49000,
    category: 'Memory',
    brand: 'Corsair',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { Type: 'DDR5', Capacity: '32GB (2x16GB)', Speed: '6000MHz' },
    stock: 25,
    sku: 'COR-32G-6000',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    ratings: { average: 4.7, count: 19 },
    tags: ['ram', 'ddr5', 'corsair', 'rgb'],
    warranty: 'Lifetime Warranty'
  },
  {
    name: 'Samsung 990 Pro 2TB PCIe 4.0 NVMe M.2 SSD',
    description: 'Experience the best SSD speed and reliability with V-NAND technology.',
    shortDescription: 'Samsung PCIe 4.0 NVMe M.2 SSD.',
    price: 68000,
    originalPrice: 72000,
    category: 'SSD',
    brand: 'Samsung',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { 'Form Factor': 'M.2 2280', Interface: 'PCIe 4.0 x4', 'Read Speed': '7450 MB/s' },
    stock: 18,
    sku: 'SAM-990P-2T',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    ratings: { average: 4.9, count: 64 },
    tags: ['ssd', 'nvme', 'samsung', 'storage'],
    warranty: '5 Years Warranty'
  },
  {
    name: 'ASUS ROG Strix B650-A Gaming WiFi Motherboard',
    description: 'Sleek white motherboard for AM5 socket, supporting PCIe 5.0 and high-speed DDR5 memory.',
    shortDescription: 'ASUS ROG AM5 B650 Motherboard with WiFi.',
    price: 78000,
    originalPrice: 82000,
    category: 'Motherboards',
    brand: 'ASUS',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { Socket: 'AM5', Chipset: 'AMD B650', Memory: '4x DDR5 Slots', Form: 'ATX' },
    stock: 10,
    sku: 'ASUS-B650-A',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    ratings: { average: 4.6, count: 14 },
    tags: ['motherboard', 'asus', 'rog', 'AM5'],
    warranty: '3 Years Warranty'
  },
  {
    name: 'Arctic Liquid Freezer III 360 A-RGB CPU Cooler',
    description: 'Premium AIO liquid cooler with outstanding cooling performance and quiet operation.',
    shortDescription: 'Arctic 360mm Liquid CPU Cooler with A-RGB.',
    price: 49000,
    originalPrice: 53000,
    category: 'Coolers',
    brand: 'Arctic',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { 'Radiator Size': '360mm', Fans: '3x 120mm A-RGB', 'Supported Sockets': 'AM4/AM5/LGA1700' },
    stock: 15,
    sku: 'ARC-LF3-360',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    ratings: { average: 4.9, count: 28 },
    tags: ['cooler', 'arctic', 'liquid', 'aio'],
    warranty: '6 Years Warranty'
  },
  {
    name: 'Corsair RM850x 850W 80+ Gold Fully Modular PSU',
    description: 'Gold level power efficiency and zero RPM fan mode for silent computer operations.',
    shortDescription: 'Corsair 850W Gold Modular Power Supply.',
    price: 48000,
    originalPrice: 52000,
    category: 'Power Supply',
    brand: 'Corsair',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { Capacity: '850W', Efficiency: '80+ Gold', Modular: 'Fully Modular' },
    stock: 20,
    sku: 'COR-PSU-RM850X',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    ratings: { average: 4.8, count: 35 },
    tags: ['psu', 'corsair', 'power'],
    warranty: '10 Years Warranty'
  },
  {
    name: 'NZXT H9 Flow Dual-Chamber Mid-Tower Case',
    description: 'Showcase build case with dual-chamber design and excellent airflow capabilities.',
    shortDescription: 'NZXT Mid-Tower Dual-Chamber Gaming Case.',
    price: 42000,
    originalPrice: 45000,
    category: 'PC Cases',
    brand: 'NZXT',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80'],
    specifications: { Type: 'Mid-Tower', Motherboard: 'ATX/M-ATX/ITX', Fans: '4x Included' },
    stock: 6,
    sku: 'NZXT-H9-FLOW',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    ratings: { average: 4.9, count: 22 },
    tags: ['case', 'nzxt', 'gaming'],
    warranty: '2 Years Warranty'
  }
];

export async function GET() {
  try {
    await connectDB();

    // 1. Seed Categories
    await Category.deleteMany({});
    for (const cat of SEED_CATEGORIES) {
      const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await Category.create({
        ...cat,
        slug,
        isActive: true
      });
    }

    // 2. Seed Products
    await Product.deleteMany({});
    for (const prod of SEED_PRODUCTS) {
      const slug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await Product.create({
        ...prod,
        slug
      });
    }

    return NextResponse.json({
      success: true,
      message: `Database seeded successfully. Created ${SEED_CATEGORIES.length} categories and ${SEED_PRODUCTS.length} products.`
    });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
