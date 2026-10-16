import React, { useState } from 'react';
import { 
  Hammer, 
  Paintbrush, 
  Users, 
  Sparkles, 
  Home, 
  ShoppingBag, 
  Wrench, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Sliders, 
  ShieldCheck,
  Building,
  DollarSign
} from 'lucide-react';
import { RenovationService } from '../types';

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
  onOpenDirectChoose: () => void;
  onOpenRecommend: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  onSelectService,
  onOpenDirectChoose,
  onOpenRecommend 
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const services: RenovationService[] = [
    {
      id: 'full-renovation',
      title: 'Full Home Renovation',
      category: 'renovation',
      badge: 'One-Stop Service',
      description: 'Comprehensive end-to-end renovation for Landed Properties, Condominiums, and HDB flats. Turnkey project management with zero coordination stress.',
      highlights: [
        'Demolition, masonry & space reconfiguration',
        'Custom carpentry & kitchen cabinetry',
        'Ceiling, lighting, plumbing & rewiring',
        'HDB & BCA permit compliance assistance'
      ],
      pricingModel: 'Free for Homeowners • Competitive Contractor Bids',
      iconName: 'Home'
    },
    {
      id: 'direct-contractor',
      title: 'Direct Contractor Engagement',
      category: 'direct_contractor',
      badge: 'Owners Choose Their Own',
      description: 'Choose your own contractor directly without interior design firm markups or middlemen commissions. Engage certified trade contractors directly.',
      highlights: [
        'Direct communication with verified contractors',
        'Itemized bill-of-quantities (BOQ)',
        'Save up to 20-30% on middleman commissions',
        'Retain full milestone control of your renovation'
      ],
      pricingModel: 'Direct Trade Pricing • Zero Middleman Markup',
      iconName: 'Hammer'
    },
    {
      id: 'contractor-recommendation',
      title: 'Contractor Recommendation & Matching',
      category: 'direct_contractor',
      badge: 'Owners Prefer Recommendation',
      description: 'Prefer curated recommendations? Let HOMESTYLER algorithm match you with top-rated contractors based on your property type, style preference, and budget.',
      highlights: [
        'Tailored matching for landed, condo or resale HDB',
        'Screened for track record, warranty & credentials',
        'Receive up to 3 curated contractor proposals',
        'Objective comparison of timeline & deliverables'
      ],
      pricingModel: '100% Free Matching for Homeowners',
      iconName: 'Sparkles'
    },
    {
      id: 'bidding-system',
      title: 'Contractor Bidding & Quotation System',
      category: 'renovation',
      badge: 'Transparent Competitive Bids',
      description: 'Multiple vetted contractors review your project specifications and submit transparent bids so you can choose based on options, quality, and pricing.',
      highlights: [
        'Side-by-side quotation comparison',
        'Compare materials, workmanship warranties & schedules',
        'Contractors compete to offer best value',
        'Target platform metric: >5 bids per project'
      ],
      pricingModel: 'Free for Homeowners • Commission-Based for Contractors',
      iconName: 'Layers'
    },
    {
      id: 'interior-design',
      title: 'One-Stop Interior Design',
      category: 'interior_design',
      badge: 'Turnkey Design',
      description: 'Complete aesthetic and functional interior design services. Work with professional designers from initial concept sketches to 3D photorealistic renderings.',
      highlights: [
        '3D spatial rendering & virtual walkthroughs',
        'Mood boards & bespoke material curation',
        'Lighting, spatial & ergonomic optimization',
        'On-site design supervision & styling'
      ],
      pricingModel: 'Free Consultation • Design Package Options',
      iconName: 'Paintbrush'
    },
    {
      id: 'materials-marketplace',
      title: 'Home Improvement Materials & Furniture',
      category: 'marketplace',
      badge: 'Direct Marketplace',
      description: 'Interactive marketplace for homeowners to purchase furniture, tiles, sanitary ware, smart lighting, and building materials direct from verified vendors.',
      highlights: [
        'Direct factory & distributor bulk pricing',
        'Tiles, vinyl, timber & sintered stone surfaces',
        'Sanitary fixtures, smart faucets & bathroom fittings',
        'Integrated delivery scheduled with your contractor'
      ],
      pricingModel: 'Direct Merchant Pricing • Platform Sharing',
      iconName: 'ShoppingBag'
    },
    {
      id: 'carpentry-builtins',
      title: 'Custom Carpentry & Built-In Fixtures',
      category: 'specialist',
      badge: 'Specialist Craftsmanship',
      description: 'Direct engagement with local carpentry workshops for bespoke wardrobes, feature walls, kitchen islands, and vanity cabinets.',
      highlights: [
        'E0/E1 low-formaldehyde grade plywood',
        'Premium Blum / DTC soft-close hardware',
        'Direct factory fabrication with precise measurements',
        'Custom laminate and fluted panel finishes'
      ],
      pricingModel: 'Direct Workshop Rates (Per Foot Run)',
      iconName: 'Wrench'
    },
    {
      id: 'electrical-plumbing',
      title: 'Licensed M&E, Electrical & Plumbing',
      category: 'specialist',
      badge: 'EMA / PUB Licensed',
      description: 'Licensed Electrical Workers (LEW) and PUB-licensed plumbers for home rewiring, distribution boards, pipe replacement, and smart home automation.',
      highlights: [
        'Full house electrical rewiring & DB upgrades',
        'PUB-compliant piping & water heater installations',
        'Smart home switches & data point cabling',
        'Safety certificates provided upon completion'
      ],
      pricingModel: 'Transparent Rate Card • Free Quote',
      iconName: 'Zap'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'renovation', label: 'Full Reno & Bidding' },
    { id: 'direct_contractor', label: 'Direct Contractor' },
    { id: 'interior_design', label: 'Interior Design' },
    { id: 'marketplace', label: 'Materials Marketplace' },
    { id: 'specialist', label: 'Specialist Trades' },
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Home': return <Home className="w-5 h-5 text-amber-600" />;
      case 'Hammer': return <Hammer className="w-5 h-5 text-amber-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 'Layers': return <Layers className="w-5 h-5 text-amber-600" />;
      case 'Paintbrush': return <Paintbrush className="w-5 h-5 text-amber-600" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-amber-600" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-amber-600" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-600" />;
      default: return <Hammer className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <section className="mb-12">
      {/* Hero Service Banner: Mobile-First Two-Path Decision (Business Canvas Key Activity) */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-400 to-amber-500 rounded-2xl p-5 sm:p-8 text-neutral-950 mb-8 shadow-sm">
        <div className="max-w-3xl">
          <span className="bg-neutral-950 text-amber-300 text-xs uppercase font-extrabold px-2.5 py-1 rounded-md tracking-wider">
            Key Business Activities (THE SIX)
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-2 font-display">
            How Do You Want to Renovate Your Home?
          </h1>
          <p className="text-neutral-900/90 text-sm sm:text-base font-medium mb-6">
            Everything in one space at <strong>zero cost for homeowners</strong>. Choose your own direct contractor or let our matchmaking algorithm recommend the best fit.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Option 1: Owners choose their own contractors */}
            <div 
              onClick={onOpenDirectChoose}
              className="bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-amber-600/20 shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  Service Path 1
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-1 group-hover:text-neutral-950 transition-all" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-950">
                1. Owners Choose Their Own Contractors
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                Browse trade capabilities directly, review itemized BOQs, and hire directly to bypass middleman commission fees.
              </p>
              <button className="mt-3 text-xs font-bold text-neutral-900 flex items-center gap-1 group-hover:text-amber-700">
                <span>Select Direct Mode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Option 2: Owners prefer recommendation */}
            <div 
              onClick={onOpenRecommend}
              className="bg-neutral-950 text-white p-4 sm:p-5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold bg-amber-500 text-neutral-950 px-2 py-0.5 rounded">
                  Service Path 2
                </span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                2. Owners Prefer Recommendation
              </h2>
              <p className="text-xs text-neutral-300 mt-1">
                Tell us your property type &amp; requirements to receive curated recommendations and competing bids from accredited firms.
              </p>
              <button className="mt-3 text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:text-amber-300">
                <span>Get Recommended</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header with Category Chips (Phone scrollable) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 font-display">
              Type of Services Offered
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Full-service renovation, direct contractor engagement, interior design, and materials marketplace
          </p>
        </div>

        {/* Category Pill Filters (scrollable on phone) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid (Works on phone: 1 col on mobile, 2 on md, 3 on lg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  {getIcon(service.iconName)}
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                  {service.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-neutral-900 mb-1.5 font-display">
                {service.title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Highlights List */}
              <div className="space-y-1.5 mb-4">
                {service.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100">
              <div className="text-[11px] font-semibold text-neutral-500 mb-2 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-neutral-400" />
                <span>{service.pricingModel}</span>
              </div>
              <button
                onClick={() => onSelectService(service.title)}
                className="w-full bg-neutral-100 hover:bg-neutral-900 hover:text-white active:scale-[0.98] text-neutral-900 text-xs font-bold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span>Request Quotation &amp; Bids</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
