'use client';

import { useState, useEffect } from 'react';
import {
  Wrench,
  AlertTriangle,
  Cpu,
  Monitor,
  HardDrive,
  Keyboard,
  Plus,
  Trash2,
  ShoppingCart,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useCartStore, type CartProduct } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

// Available categories for builder slots
const SLOTS = [
  { id: 'cpu', name: 'Processor (CPU)', category: 'Processors', icon: Cpu, required: true },
  { id: 'motherboard', name: 'Motherboard', category: 'Motherboards', icon: Monitor, required: true },
  { id: 'memory', name: 'Memory (RAM)', category: 'Memory', icon: HardDrive, required: true },
  { id: 'gpu', name: 'Graphics Card (GPU)', category: 'Graphics Cards', icon: Monitor, required: false },
  { id: 'storage', name: 'SSD / HDD', category: 'SSD', icon: HardDrive, required: true },
  { id: 'case', name: 'PC Case', category: 'PC Cases', icon: Monitor, required: true },
  { id: 'psu', name: 'Power Supply (PSU)', category: 'Power Supply', icon: Cpu, required: true },
  { id: 'cooler', name: 'Cooler', category: 'Coolers', icon: Cpu, required: false }
];

// Seed components catalog for select modal
const CATALOG: Record<string, any[]> = {
  Processors: [
    { id: 'c1', name: 'AMD Ryzen 7 7800X3D', price: 115000, socket: 'AM5', wattage: 120, brand: 'AMD' },
    { id: 'c2', name: 'Intel Core i7-14700K', price: 128000, socket: 'LGA1700', wattage: 250, brand: 'Intel' },
    { id: 'c3', name: 'AMD Ryzen 5 7600', price: 68000, socket: 'AM5', wattage: 65, brand: 'AMD' }
  ],
  Motherboards: [
    { id: 'm1', name: 'ASUS ROG Strix B650-A Gaming WiFi', price: 78000, socket: 'AM5', ramType: 'DDR5', brand: 'ASUS' },
    { id: 'm2', name: 'MSI PRO Z790-A MAX WiFi', price: 89000, socket: 'LGA1700', ramType: 'DDR5', brand: 'MSI' },
    { id: 'm3', name: 'Gigabyte B650M DS3H', price: 54000, socket: 'AM5', ramType: 'DDR5', brand: 'Gigabyte' }
  ],
  Memory: [
    { id: 'r1', name: 'Corsair Vengeance RGB DDR5 32GB 6000MHz', price: 45000, ramType: 'DDR5', brand: 'Corsair' },
    { id: 'r2', name: 'Kingston Fury Beast DDR5 16GB 5200MHz', price: 22000, ramType: 'DDR5', brand: 'Kingston' }
  ],
  'Graphics Cards': [
    { id: 'g1', name: 'ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB', price: 345000, wattage: 285, brand: 'ASUS' },
    { id: 'g2', name: 'MSI Ventus 2X RTX 4060 Ti 8GB', price: 155000, wattage: 160, brand: 'MSI' },
    { id: 'g3', name: 'Gigabyte RX 7800 XT Gaming OC 16GB', price: 215000, wattage: 263, brand: 'Gigabyte' }
  ],
  SSD: [
    { id: 's1', name: 'Samsung 990 Pro 2TB PCIe 4.0 NVMe M.2', price: 68000, brand: 'Samsung' },
    { id: 's2', name: 'Crucial P3 Plus 1TB PCIe 4.0 NVMe M.2', price: 28000, brand: 'Crucial' }
  ],
  'PC Cases': [
    { id: 'cs1', name: 'NZXT H9 Flow Dual-Chamber Mid-Tower Case', price: 42000, brand: 'NZXT' },
    { id: 'cs2', name: 'Lian Li O11 Dynamic EVO RGB', price: 58000, brand: 'Lian Li' }
  ],
  'Power Supply': [
    { id: 'p1', name: 'Corsair RM850x 850W 80+ Gold Modular', price: 48000, brand: 'Corsair' },
    { id: 'p2', name: 'Thermaltake Toughpower GF3 750W ATX 3.0', price: 39000, brand: 'Thermaltake' }
  ],
  Coolers: [
    { id: 'cl1', name: 'Arctic Liquid Freezer III 360 A-RGB', price: 49000, brand: 'Arctic' },
    { id: 'cl2', name: 'Deepcool AK620 Dual-Tower CPU Air Cooler', price: 21500, brand: 'Deepcool' }
  ]
};

export default function PCBuilderPage() {
  const [mounted, setMounted] = useState(false);
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [activeModalSlot, setActiveModalSlot] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Run compatibility checker when selections change
  useEffect(() => {
    const checks: string[] = [];
    const cpu = selections.cpu;
    const mobo = selections.motherboard;
    const ram = selections.memory;
    const psu = selections.psu;
    const gpu = selections.gpu;

    // Socket matching
    if (cpu && mobo && cpu.socket !== mobo.socket) {
      checks.push(`Incompatible Socket: The ${cpu.name} (${cpu.socket}) cannot be fitted on the selected ${mobo.name} (${mobo.socket}).`);
    }

    // RAM generation matching
    if (mobo && ram && mobo.ramType !== ram.ramType) {
      checks.push(`Memory Mismatch: The selected motherboard supports ${mobo.ramType} RAM but the memory selected is ${ram.ramType}.`);
    }

    // PSU wattage estimate check
    if (psu) {
      const cpuPower = cpu?.wattage || 0;
      const gpuPower = gpu?.wattage || 0;
      const otherPower = 100; // estimated drives, fans, cooler overhead
      const estimatedTotal = cpuPower + gpuPower + otherPower;
      const psuRating = parseInt(psu.name.match(/\d+W/)?.[0] || '650');
      
      if (estimatedTotal > psuRating) {
        checks.push(`Power Limit Alert: Estimated total build consumption (${estimatedTotal}W) exceeds the capacity of the selected Power Supply (${psuRating}W).`);
      }
    }

    setWarnings(checks);
  }, [selections]);

  if (!mounted) return null;

  const totalCost = Object.values(selections).reduce((sum, item) => sum + item.price, 0);

  // Estimated system power draw
  const totalPowerDraw =
    (selections.cpu?.wattage || 0) + (selections.gpu?.wattage || 0) + 100;

  const handleSelectComponent = (slotId: string, component: any) => {
    setSelections({ ...selections, [slotId]: component });
    setActiveModalSlot(null);
  };

  const handleRemoveComponent = (slotId: string) => {
    const next = { ...selections };
    delete next[slotId];
    setSelections(next);
  };

  const handleAddAllToCart = () => {
    // Check required configurations
    const missing = SLOTS.filter((s) => s.required && !selections[s.id]);
    if (missing.length > 0) {
      toast.error(`Please select components for: ${missing.map((m) => m.name).join(', ')}`);
      return;
    }

    if (warnings.length > 0) {
      toast.error('Cannot add system to cart. Please resolve active compatibility warnings first.');
      return;
    }

    // Add selected items to Zustand cart
    Object.keys(selections).forEach((key) => {
      const comp = selections[key];
      const cartProduct: CartProduct = {
        _id: `pc-${comp.id}`,
        name: comp.name,
        slug: comp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price: comp.price,
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80',
        brand: comp.brand,
        stock: 5
      };
      addItem(cartProduct, 1);
    });

    openCart();
    toast.success('Successfully added all custom PC components to your shopping cart!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-heading flex items-center gap-2">
            <Wrench className="w-8 h-8 text-[#00d4ff]" />
            Custom PC Builder
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Pick compatible computer parts, verify total system power, and add entire system builds to cart.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Estimated Total</div>
            <div className="text-2xl font-extrabold text-[#00ff88]">
              {formatPrice(totalCost)}
            </div>
          </div>
          <button
            onClick={handleAddAllToCart}
            className="px-6 py-3.5 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-[#00d4ff]/20 transition-all hover:scale-[1.01] flex items-center gap-2 text-sm uppercase tracking-wider"
          >
            <ShoppingCart className="w-4.5 h-4.5" />
            Add Build to Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Configurator Slots (Left, 8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {SLOTS.map((slot) => {
            const selectedItem = selections[slot.id];
            const Icon = slot.icon;

            return (
              <div
                key={slot.id}
                className={`p-5 rounded-2xl border backdrop-blur-md transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  selectedItem
                    ? 'bg-[#111827]/40 border-white/5'
                    : 'bg-[#111827]/10 border-dashed border-white/10 hover:border-white/20'
                }`}
              >
                {/* Slot descriptor */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="p-3 bg-white/5 rounded-xl text-gray-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {slot.name}
                      {slot.required && (
                        <span className="text-[10px] text-red-400 bg-red-500/5 px-2 py-0.5 rounded-full border border-red-500/10 uppercase tracking-wider font-semibold">
                          Required
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">Select a compatible item</p>
                  </div>
                </div>

                {/* Selected element description */}
                {selectedItem ? (
                  <div className="flex-1 flex flex-col sm:flex-row items-center justify-end gap-4 w-full sm:w-auto">
                    <div className="text-right sm:pr-4">
                      <div className="text-sm font-bold text-white line-clamp-1">{selectedItem.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Brand: {selectedItem.brand} {selectedItem.wattage ? `| Power: ${selectedItem.wattage}W` : ''}
                      </div>
                    </div>
                    <div className="text-sm font-extrabold text-[#00ff88] min-w-[100px] text-right">
                      {formatPrice(selectedItem.price)}
                    </div>
                    <button
                      onClick={() => handleRemoveComponent(slot.id)}
                      className="p-2 text-gray-500 hover:text-red-400 bg-white/5 hover:bg-red-500/5 rounded-xl border border-white/5 hover:border-red-500/10 transition-all"
                      aria-label="Remove component"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveModalSlot(slot.id)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-all uppercase tracking-wider flex items-center gap-1.5 w-full sm:w-auto justify-center"
                  >
                    <Plus className="w-4 h-4 text-[#00d4ff]" />
                    Choose Part
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* System Diagnostics Sidebar (Right, 4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Wattage calculator & stats */}
          <div className="bg-[#111827]/40 border border-white/5 p-6 rounded-2xl space-y-4 backdrop-blur-md shadow-xl">
            <h2 className="text-md font-bold text-white uppercase tracking-wider">
              System Diagnostics
            </h2>
            <div className="space-y-3.5 text-sm font-medium">
              <div className="flex justify-between text-gray-400">
                <span>Parts Selected</span>
                <span className="text-white font-bold">{Object.keys(selections).length} / 8</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Estimated Power Draw</span>
                <span className="text-[#00d4ff] font-bold">{totalPowerDraw} Watts</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Recommended PSU capacity</span>
                <span className="text-white font-bold">
                  {totalPowerDraw > 100 ? `${Math.ceil((totalPowerDraw * 1.25) / 50) * 50}W` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Compatibility warnings */}
          {warnings.length > 0 ? (
            <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                Compatibility Warnings ({warnings.length})
              </div>
              <ul className="space-y-2.5">
                {warnings.map((warn, i) => (
                  <li key={i} className="text-xs text-gray-400 leading-relaxed list-disc pl-3">
                    {warn}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-[#00ff88]/5 border border-[#00ff88]/10 p-5 rounded-2xl flex gap-3 text-xs text-[#00ff88]">
              <CheckCircle className="w-6 h-6 shrink-0" />
              <div>
                <span className="font-bold block">Compatibility Passed</span>
                <span className="text-gray-400 mt-0.5 leading-relaxed block">
                  All selected hardware components are fully matched and compatible with each other.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Choose Component Selection Modal */}
      {activeModalSlot !== null && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0a0e1a] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Choose {SLOTS.find((s) => s.id === activeModalSlot)?.name}
              </h2>
              <button
                onClick={() => setActiveModalSlot(null)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-gray-400 hover:text-white rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
              {CATALOG[SLOTS.find((s) => s.id === activeModalSlot)!.category]?.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => handleSelectComponent(activeModalSlot, comp)}
                  className="p-4 bg-white/5 border border-white/5 hover:border-[#00d4ff]/30 rounded-xl flex justify-between items-center cursor-pointer transition-all hover:bg-white/[0.08]"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white">{comp.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Brand: {comp.brand} {comp.socket ? `| Socket: ${comp.socket}` : ''} {comp.ramType ? `| Memory Type: ${comp.ramType}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-[#00ff88]">
                      {formatPrice(comp.price)}
                    </div>
                    {comp.wattage && (
                      <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block mt-1">
                        Power: {comp.wattage}W
                      </span>
                    )}
                  </div>
                </div>
              )) || (
                <div className="text-center text-sm text-gray-500 py-12">
                  No parts available for this slot.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
