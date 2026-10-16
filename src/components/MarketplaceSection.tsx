import React, { useState } from 'react';
import { ShoppingBag, Tag, Check, Truck, ShieldCheck, Sparkles, Filter } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  category: 'surfaces' | 'sanitary' | 'smart_home' | 'furniture';
  price: string;
  originalPrice: string;
  discount: string;
  supplier: string;
  badge: string;
  description: string;
}

export const MarketplaceSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useState<string[]>([]);

  const products: ProductItem[] = [
    {
      id: 'prod-1',
      name: 'Sintered Stone Countertop Slab (Jumbo)',
      category: 'surfaces',
      price: '$128 / ft run',
      originalPrice: '$185',
      discount: '30% Off Direct',
      supplier: 'Stamford Stone Direct',
      badge: 'Heat & Scratch Resistant',
      description: 'Ideal for kitchen island and bathroom vanity. Cut-to-measure directly coordinated with your contractor.'
    },
    {
      id: 'prod-2',
      name: 'Anti-Slip SPC Herringbone Vinyl Flooring (5.5mm)',
      category: 'surfaces',
      price: '$4.20 / sq ft',
      originalPrice: '$6.50',
      discount: '35% Off Direct',
      supplier: 'Apex Flooring Hub',
      badge: 'Zero Formaldehyde',
      description: 'IXPE acoustic underlay pre-attached. Waterproof and termite-proof with direct trade warranty.'
    },
    {
      id: 'prod-3',
      name: 'Matte Gunmetal Rain Shower Set & Thermostatic Mixer',
      category: 'sanitary',
      price: '$268',
      originalPrice: '$420',
      discount: 'Direct Factory',
      supplier: 'Hansgrohe / Direct Sanitary Co',
      badge: 'PUB 3-Tick Certified',
      description: 'PVD corrosion-resistant finish with anti-scald thermostatic valve and brass construction.'
    },
    {
      id: 'prod-4',
      name: 'Zigbee 3.0 Smart Wall Switch & Hub Package (6-Gang)',
      category: 'smart_home',
      price: '$198',
      originalPrice: '$310',
      discount: '36% Bundle Off',
      supplier: 'SmartLiving SG',
      badge: 'Works with Apple Home & Google',
      description: 'No neutral wire required. Seamlessly integrates with contractor rewiring and lighting layouts.'
    },
    {
      id: 'prod-5',
      name: 'Modular Solid Oak 6-Seater Dining Set',
      category: 'furniture',
      price: '$890',
      originalPrice: '$1,350',
      discount: 'Factory Direct',
      supplier: 'WoodCraft Artisan Studio',
      badge: 'FSC-Certified Solid Timber',
      description: 'Sustainably sourced North American white oak with water-resistant organic oil finish.'
    },
    {
      id: 'prod-6',
      name: 'Tornado Flush Rimless Smart Toilet Suite',
      category: 'sanitary',
      price: '$450',
      originalPrice: '$680',
      discount: 'Direct Trade Rate',
      supplier: 'Sanitary Wares SG',
      badge: 'PUB WELS 3-Tick',
      description: 'Nano-glaze antibacterial coating with dual-cyclone silent flush mechanism.'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Materials' },
    { id: 'surfaces', label: 'Tiles & Surfaces' },
    { id: 'sanitary', label: 'Sanitary Wares' },
    { id: 'smart_home', label: 'Smart Home & M&E' },
    { id: 'furniture', label: 'Designer Furniture' },
  ];

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  const toggleCart = (id: string) => {
    if (cartItems.includes(id)) {
      setCartItems(cartItems.filter(item => item !== id));
    } else {
      setCartItems([...cartItems, id]);
    }
  };

  return (
    <section className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 font-display">
              Home Improvement Materials &amp; Products
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Interactive marketplace for homeowners to buy furniture, interior fittings, and materials direct from merchants
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === c.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((prod) => {
          const inCart = cartItems.includes(prod.id);
          return (
            <div
              key={prod.id}
              className="bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 p-5 flex flex-col justify-between shadow-xs transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    {prod.badge}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {prod.discount}
                  </span>
                </div>

                <h3 className="font-bold text-neutral-900 text-base mb-1 font-display">
                  {prod.name}
                </h3>
                <p className="text-xs text-neutral-500 mb-3">
                  Supplier: <strong className="text-neutral-700">{prod.supplier}</strong>
                </p>

                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  {prod.description}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-lg font-black text-neutral-900 font-display">{prod.price}</span>
                    <span className="text-xs text-neutral-400 line-through ml-2">{prod.originalPrice}</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-medium">Direct Delivery</span>
                </div>

                <button
                  onClick={() => toggleCart(prod.id)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    inCart
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white active:scale-[0.98]'
                  }`}
                >
                  {inCart ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Project Specs</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Renovation Specs</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
