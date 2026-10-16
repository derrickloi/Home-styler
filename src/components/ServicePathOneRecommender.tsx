import React, { useState, useMemo } from 'react';
import { 
  Home, 
  UtensilsCrossed, 
  Bath, 
  Hammer, 
  Paintbrush, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  ChevronRight, 
  SlidersHorizontal,
  Info,
  Check,
  TrendingDown
} from 'lucide-react';
import { Contractor, HomeOwnerLocation } from '../types';
import rawContractors from '../data/contractors.json';
import { calculateDistanceKm, formatDistance, PRESET_HOME_LOCATIONS } from '../utils/geo';

export type RenovationTypeId = 
  | 'full_overhaul' 
  | 'kitchen_wet' 
  | 'bathrooms' 
  | 'carpentry' 
  | 'flooring_paint' 
  | 'electrical_lew';

export type PropertyTypeId = 'hdb_4room' | 'hdb_5room' | 'condo' | 'landed';

interface RenovationTypeConfig {
  id: RenovationTypeId;
  label: string;
  shortLabel: string;
  iconName: string;
  tagline: string;
  description: string;
  baseTimeline: string;
  typicalSavingsPct: number;
  priceBenchmarks: Record<PropertyTypeId, { min: number; max: number; idEstimate: { min: number; max: number } }>;
  scopeChecklist: { title: string; detail: string; standardSpec: string }[];
  recommendedContractorIds: string[];
}

const RENOVATION_TYPES: RenovationTypeConfig[] = [
  {
    id: 'full_overhaul',
    label: 'Full Home Overhaul',
    shortLabel: 'Full Overhaul',
    iconName: 'Home',
    tagline: 'Turnkey space makeover for resale HDB, condos & landed homes',
    description: 'Complete end-to-end renovation encompassing non-load bearing wall hacking, masonry screeding, whole-home custom carpentry, new M&E wiring, and sanitary fittings.',
    baseTimeline: '6 - 9 Weeks',
    typicalSavingsPct: 24,
    priceBenchmarks: {
      hdb_4room: { min: 42000, max: 68000, idEstimate: { min: 58000, max: 88000 } },
      hdb_5room: { min: 52000, max: 82000, idEstimate: { min: 72000, max: 108000 } },
      condo: { min: 58000, max: 96000, idEstimate: { min: 78000, max: 125000 } },
      landed: { min: 110000, max: 210000, idEstimate: { min: 145000, max: 280000 } },
    },
    scopeChecklist: [
      {
        title: 'HDB / BCA Permit Filing & Haulage',
        detail: 'HDB Registered Renovation Contractor (RRC) authorization, corridor floor protection, and legal waste haulage.',
        standardSpec: 'Official HDB permit approval reference before hacking starts'
      },
      {
        title: 'Wall Hacking & Structural Masonry',
        detail: 'Demolition of non-load bearing partition walls, rubbish chute replacement, and new hollow block partitions.',
        standardSpec: 'Pre-packed waterproof cement mortar & laser leveling'
      },
      {
        title: 'Whole-Home Custom Carpentry',
        detail: 'Kitchen base & tall units, master bedroom full-height wardrobe, and shoe cabinet.',
        standardSpec: 'E0/E1 low-formaldehyde plywood with genuine Blum soft-close fittings'
      },
      {
        title: 'Complete Electrical & PUB Plumbing',
        detail: 'Whole-house copper rewiring, 13A double sockets, air-con isolators, and concealed stainless steel plumbing.',
        standardSpec: 'Licensed Electrical Worker (LEW) CS/5H certificate of compliance'
      }
    ],
    recommendedContractorIds: ['HB-01-0080F', 'HB-01-0078H', 'HB-01-3750H', 'HB-01-3206D']
  },
  {
    id: 'kitchen_wet',
    label: 'Kitchen & Wet Works',
    shortLabel: 'Kitchen & Wet Works',
    iconName: 'UtensilsCrossed',
    tagline: 'Heavy-duty waterproofing, floor & wall tiles, quartz countertops & custom cabinetry',
    description: 'Demolish old tiles, apply certified waterproofing membranes, lay anti-slip homogenous flooring, and fabricate durable moisture-resistant kitchen cabinets.',
    baseTimeline: '2.5 - 4 Weeks',
    typicalSavingsPct: 28,
    priceBenchmarks: {
      hdb_4room: { min: 12500, max: 21000, idEstimate: { min: 17500, max: 29000 } },
      hdb_5room: { min: 14000, max: 24000, idEstimate: { min: 19800, max: 33000 } },
      condo: { min: 16500, max: 28000, idEstimate: { min: 23000, max: 39000 } },
      landed: { min: 25000, max: 48000, idEstimate: { min: 36000, max: 68000 } },
    },
    scopeChecklist: [
      {
        title: 'Tile Hacking & 24h Waterproof Ponding Test',
        detail: 'Clear existing floor and wall tiles to bare concrete, apply liquid-applied polyurethane membrane.',
        standardSpec: 'Strict 24-hour water ponding test with HDB inspection sign-off'
      },
      {
        title: 'Homogenous Wall & Floor Tiling',
        detail: 'Heavy-duty 600x600mm slip-resistant floor tiles and stain-resistant porcelain wall tiles.',
        standardSpec: 'Full pre-packed screed with anti-efflorescence tile grout'
      },
      {
        title: 'Cabinetry Fabrication (Top & Bottom)',
        detail: 'Heavy-duty internal PVC carcass with laminate fronts and moisture-resistant marine ply sink base.',
        standardSpec: 'Solid E0 plywood carcass + Blum Clip Top hinges'
      },
      {
        title: 'Countertop & Gas/Plumbing Hookup',
        detail: 'Engineered quartz or sintered stone countertop with undermount kitchen sink and gas hob connection.',
        standardSpec: 'Food-safe certified quartz slab with bevelled polished edges'
      }
    ],
    recommendedContractorIds: ['HB-01-0028A', 'HB-01-0086E', 'HB-01-0228G', 'HB-01-2376Z']
  },
  {
    id: 'bathrooms',
    label: 'Bathrooms & Sanitary',
    shortLabel: 'Bathrooms & Sanitary',
    iconName: 'Bath',
    tagline: 'Certified waterproofing, homogenous tiles, tempered glass screen & PUB fittings',
    description: 'Renovate master and common bathrooms with HDB-compliant screeding, dual-layer waterproofing membrane, vanity counters, and modern concealed sanitary piping.',
    baseTimeline: '2 - 3 Weeks',
    typicalSavingsPct: 26,
    priceBenchmarks: {
      hdb_4room: { min: 8500, max: 15500, idEstimate: { min: 12000, max: 21500 } },
      hdb_5room: { min: 9200, max: 16800, idEstimate: { min: 13000, max: 23000 } },
      condo: { min: 11500, max: 19500, idEstimate: { min: 16000, max: 27500 } },
      landed: { min: 18000, max: 34000, idEstimate: { min: 25000, max: 48000 } },
    },
    scopeChecklist: [
      {
        title: 'Dual-Layer Waterproofing Membrane',
        detail: 'Application of HDB-approved elastomeric polymer waterproofing extending 300mm up walls and 1800mm in shower wet zones.',
        standardSpec: 'HDB/BCA approved waterproofing system'
      },
      {
        title: 'Anti-Slip Homogenous Flooring',
        detail: 'R10/R11 slip-resistant porcelain tiles with calibrated slopes toward floor traps to prevent water puddling.',
        standardSpec: 'Stainless steel 304 insect-proof anti-odour floor trap'
      },
      {
        title: 'Frameless Tempered Glass Shower Screen',
        detail: '10mm safety tempered glass partition with heavy-duty 304 stainless steel hardware and magnetic seals.',
        standardSpec: '10mm clear tempered safety glass tested to SS 341 standard'
      },
      {
        title: 'PUB Certified Sanitary Installation',
        detail: 'Water-saving 3-tick WELS certified toilet bowl, rainshower set, bidet spray, and vanity basin cabinet.',
        standardSpec: 'PUB registered licensed plumber verification'
      }
    ],
    recommendedContractorIds: ['HB-01-2391H', 'HB-01-2397G', 'HB-01-0800F', 'HB-01-5377B']
  },
  {
    id: 'carpentry',
    label: 'Custom Carpentry & Storage',
    shortLabel: 'Custom Carpentry',
    iconName: 'Hammer',
    tagline: 'Direct workshop rates for bespoke wardrobes, feature walls & kitchen islands',
    description: 'Engage local carpentry workshops directly to cut out middleman markups. Get precision factory-built storage with premium laminates and soft-closing hardware.',
    baseTimeline: '2 - 3.5 Weeks',
    typicalSavingsPct: 30,
    priceBenchmarks: {
      hdb_4room: { min: 14000, max: 26000, idEstimate: { min: 19800, max: 38000 } },
      hdb_5room: { min: 17500, max: 32000, idEstimate: { min: 25000, max: 46000 } },
      condo: { min: 18000, max: 35000, idEstimate: { min: 26000, max: 51000 } },
      landed: { min: 32000, max: 65000, idEstimate: { min: 46000, max: 95000 } },
    },
    scopeChecklist: [
      {
        title: 'Full-Height Master Bedroom Wardrobe',
        detail: 'Floor-to-ceiling casement or sliding wardrobe with internal LED lighting, multi-tier drawers, and trousers rack.',
        standardSpec: 'S$240 - S$340 per foot run (pfr) direct workshop rate'
      },
      {
        title: 'Living Room TV Console & Feature Wall',
        detail: 'Suspended TV console with concealed wire conduits, fluted acoustic paneling, or sintered stone backing.',
        standardSpec: 'Low-VOC high pressure laminates (Jennings / Lamitak)'
      },
      {
        title: 'Hardware & Soft-Closing Mechanics',
        detail: 'Heavy-duty Blumotion or DTC soft-close hinges, full-extension concealed undermount runners rated for 40kg load.',
        standardSpec: '100% genuine Blum hardware with manufacturer guarantee'
      },
      {
        title: 'Low Formaldehyde Health Standard',
        detail: 'E0 or E1 certified core plywood to ensure indoor air quality without harsh pungent chemical emissions.',
        standardSpec: 'Singapore Green Label / E0 plywood compliance'
      }
    ],
    recommendedContractorIds: ['HB-01-0759G', 'HB-01-3456Z', 'HB-01-3344E', 'HB-01-2255E']
  },
  {
    id: 'flooring_paint',
    label: 'Living, Flooring & Painting',
    shortLabel: 'Flooring & Painting',
    iconName: 'Paintbrush',
    tagline: 'Heavy-duty 5mm SPC vinyl, porcelain tiles, false ceiling & anti-mould paint',
    description: 'Refresh your entire living space. Lay sound-insulated waterproof vinyl or elegant porcelain tiles, construct clean false ceilings, and coat walls with anti-mould paint.',
    baseTimeline: '1 - 2.5 Weeks',
    typicalSavingsPct: 25,
    priceBenchmarks: {
      hdb_4room: { min: 6800, max: 13500, idEstimate: { min: 9200, max: 18500 } },
      hdb_5room: { min: 8200, max: 15800, idEstimate: { min: 11000, max: 21500 } },
      condo: { min: 9500, max: 18000, idEstimate: { min: 13000, max: 24500 } },
      landed: { min: 18000, max: 36000, idEstimate: { min: 24500, max: 50000 } },
    },
    scopeChecklist: [
      {
        title: '5mm SPC Vinyl Flooring with IXPE Acoustic Underlay',
        detail: 'Waterproof, scratch-resistant Stone Plastic Composite vinyl with click-lock profile over existing flooring.',
        standardSpec: 'S$4.20 - S$5.80 per square foot supply & install'
      },
      {
        title: 'Whole-House Anti-Mould Painting',
        detail: 'Skim coating of hairline cracks, application of 1 sealer coat + 2 finishing coats of washable paint.',
        standardSpec: 'Nippon Odourless / Dulux All-in-One wash-proof paint'
      },
      {
        title: 'Light Trough & False Ceiling',
        detail: 'Gypsum plaster board false ceiling with cove lighting recess and curtain pelmets in living and bedrooms.',
        standardSpec: 'Boral / Knauf moisture-resistant gypsum boards'
      },
      {
        title: 'Skirting & Profile Transitions',
        detail: 'Matching moisture-proof PVC or solid wood skirtings along all walls and aluminum door threshold trims.',
        standardSpec: 'Concealed pin-nailing with colour-matched silicone bead'
      }
    ],
    recommendedContractorIds: ['HB-01-0273G', 'HB-01-0049B', 'HB-01-0061C', 'HB-01-0615G']
  },
  {
    id: 'electrical_lew',
    label: 'Electrical & Smart Home (LEW)',
    shortLabel: 'Electrical & LEW',
    iconName: 'Zap',
    tagline: 'Licensed Electrical Worker (LEW) rewiring, DB upgrade & smart automation',
    description: 'Ensure safety and compliance. Replace old aging distribution boards with modern safety trip breakers, rewire circuits with fire-rated cables, and install smart switches.',
    baseTimeline: '1 - 2 Weeks',
    typicalSavingsPct: 22,
    priceBenchmarks: {
      hdb_4room: { min: 3800, max: 7800, idEstimate: { min: 4900, max: 10500 } },
      hdb_5room: { min: 4500, max: 8900, idEstimate: { min: 5800, max: 11800 } },
      condo: { min: 5200, max: 9800, idEstimate: { min: 6800, max: 13200 } },
      landed: { min: 12000, max: 26000, idEstimate: { min: 16000, max: 35000 } },
    },
    scopeChecklist: [
      {
        title: 'Distribution Board (DB) & Surge Protection',
        detail: 'Replacement of main consumer unit with ABB / Hager miniature circuit breakers and residual current devices (RCCB).',
        standardSpec: 'Singapore Standard SS CP 5 / SS 638 compliance'
      },
      {
        title: 'Full House Copper Rewiring',
        detail: 'Concealed or PVC-trunked fire-retardant wiring for light points, 13A double sockets, air-con, and oven isolators.',
        standardSpec: 'Keystone / Sigma fire-retardant multi-strand copper cable'
      },
      {
        title: 'Smart Home Switches & Track Lights',
        detail: 'Neutral-wire smart zigbee/Wi-Fi switches compatible with Apple Home, Google Home, and Alexa voice control.',
        standardSpec: 'Safety Mark approved smart dimmer & touch switches'
      },
      {
        title: 'Official EMA Certificate of Compliance',
        detail: 'Licensed Electrical Worker (LEW) testing, earth-loop impedance verification, and CS/5H submission to SP Services.',
        standardSpec: 'Official EMA / SP Powergrid endorsement certificate'
      }
    ],
    recommendedContractorIds: ['HB-01-0086E', 'HB-01-3066H', 'HB-01-2388G', 'HB-01-2689E']
  }
];

const PROPERTY_OPTIONS: { id: PropertyTypeId; label: string; areaApprox: string }[] = [
  { id: 'hdb_4room', label: 'HDB 3/4-Room', areaApprox: 'Approx. 85-100 sqm' },
  { id: 'hdb_5room', label: 'HDB 5-Room / Exec', areaApprox: 'Approx. 110-130 sqm' },
  { id: 'condo', label: 'Condominium', areaApprox: 'Approx. 80-120 sqm' },
  { id: 'landed', label: 'Landed Property', areaApprox: 'Approx. 200+ sqm' },
];

interface ServicePathOneRecommenderProps {
  onOpenQuoteWithContractor?: (contractor: Contractor) => void;
  onRequestQuoteForType?: (serviceTitle: string) => void;
  onNavigateToNearest?: () => void;
  homeLocation?: HomeOwnerLocation;
}

export const ServicePathOneRecommender: React.FC<ServicePathOneRecommenderProps> = ({
  onOpenQuoteWithContractor,
  onRequestQuoteForType,
  onNavigateToNearest,
  homeLocation = PRESET_HOME_LOCATIONS[0],
}) => {
  const [selectedRenovation, setSelectedRenovation] = useState<RenovationTypeId>('full_overhaul');
  const [selectedProperty, setSelectedProperty] = useState<PropertyTypeId>('hdb_4room');
  const [expandedContractorId, setExpandedContractorId] = useState<string | null>(null);

  // Active configuration
  const currentConfig = useMemo(() => {
    return RENOVATION_TYPES.find(r => r.id === selectedRenovation) || RENOVATION_TYPES[0];
  }, [selectedRenovation]);

  // Pricing benchmark for selected combination
  const activePricing = useMemo(() => {
    return currentConfig.priceBenchmarks[selectedProperty];
  }, [currentConfig, selectedProperty]);

  // Estimated direct contractor savings
  const calculatedSavings = useMemo(() => {
    const directMid = (activePricing.min + activePricing.max) / 2;
    const idMid = (activePricing.idEstimate.min + activePricing.idEstimate.max) / 2;
    return Math.round(idMid - directMid);
  }, [activePricing]);

  // Match real contractors from database and calculate proximity
  const recommendedContractors = useMemo<Contractor[]>(() => {
    const all = rawContractors as Contractor[];
    const targetIds = currentConfig.recommendedContractorIds;
    
    // Find matching contractors in priority order
    const matched: Contractor[] = [];
    for (const id of targetIds) {
      const found = all.find(c => c.id === id);
      if (found) {
        matched.push({
          ...found,
          distanceKm: calculateDistanceKm(homeLocation.lat, homeLocation.lng, found.lat, found.lng),
        });
      }
    }

    // If less than 3, backfill with closest certified contractors in database
    if (matched.length < 3) {
      const remaining = all
        .filter(c => !matched.some(m => m.id === c.id))
        .map(c => ({
          ...c,
          distanceKm: calculateDistanceKm(homeLocation.lat, homeLocation.lng, c.lat, c.lng),
        }))
        .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
        .slice(0, 3 - matched.length);
      matched.push(...remaining);
    }

    return matched;
  }, [currentConfig, homeLocation]);

  const getTabIcon = (name: string, active: boolean) => {
    const iconClass = `w-4 h-4 ${active ? 'text-amber-500' : 'text-neutral-500'}`;
    switch (name) {
      case 'Home': return <Home className={iconClass} />;
      case 'UtensilsCrossed': return <UtensilsCrossed className={iconClass} />;
      case 'Bath': return <Bath className={iconClass} />;
      case 'Hammer': return <Hammer className={iconClass} />;
      case 'Paintbrush': return <Paintbrush className={iconClass} />;
      case 'Zap': return <Zap className={iconClass} />;
      default: return <Hammer className={iconClass} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden mb-10 transition-all">
      {/* Top Header Badge & Description */}
      <div className="p-5 sm:p-6 bg-neutral-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-extrabold bg-amber-400 text-neutral-950 px-2.5 py-0.5 rounded tracking-wide uppercase">
              Service Path 1 Interactive Recommender
            </span>
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Direct Contractor Trade Rates (Zero Markup)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Choose Your Renovation Type &amp; Get Direct Recommendations
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
            Homeowners can choose their own verified trade contractors. Select your project scope below to receive instant BOQ specifications, pricing benchmarks, and vetted trade recommendations.
          </p>
        </div>

        {/* Homeowner postal anchor info & Postal Search CTA */}
        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {onNavigateToNearest && (
            <button
              onClick={onNavigateToNearest}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Key in Postal Code (10 Nearest)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-xl p-2.5 sm:p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-left text-xs">
              <span className="text-neutral-400 block text-[10px] uppercase font-semibold">OneMap Location</span>
              <span className="font-bold text-white block">Postal {homeLocation.postalCode}</span>
              <span className="text-neutral-400 text-[11px] truncate max-w-[150px] block">
                Proximity live calculated
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Renovation Type Tabs (Phone scrollable, Desktop pills) */}
      <div className="bg-neutral-100/80 p-2 sm:p-3 border-b border-neutral-200 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {RENOVATION_TYPES.map((type) => {
            const isActive = selectedRenovation === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedRenovation(type.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-neutral-950 shadow-sm border border-neutral-300 font-bold'
                    : 'bg-transparent text-neutral-600 hover:text-neutral-950 hover:bg-white/60 border border-transparent'
                }`}
              >
                {getTabIcon(type.iconName, isActive)}
                <span>{type.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-0.5"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Renovation Type Workspace */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* Title, Tagline & Property Selector row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                Selected Renovation
              </span>
              <span className="text-xs text-neutral-500 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                Est. {currentConfig.baseTimeline}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 mt-1 font-display">
              {currentConfig.label}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 max-w-2xl">
              {currentConfig.description}
            </p>
          </div>

          {/* Property Type Selector */}
          <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200 shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-2 mb-1.5 flex items-center justify-between">
              <span>Select Property Size:</span>
              <span className="text-amber-700 font-bold">{PROPERTY_OPTIONS.find(p => p.id === selectedProperty)?.areaApprox}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {PROPERTY_OPTIONS.map((prop) => (
                <button
                  key={prop.id}
                  onClick={() => setSelectedProperty(prop.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedProperty === prop.id
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {prop.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Financial & Time Benchmark Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Direct Trade Price Benchmark */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-extrabold uppercase text-amber-900 tracking-wider flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-700" />
                Direct Contractor Benchmark
              </span>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-display">
                  S${activePricing.min.toLocaleString()} – S${activePricing.max.toLocaleString()}
                </div>
                <p className="text-[11px] text-amber-900/80 mt-1">
                  Itemized trade pricing based on Singapore BCA &amp; HDB standard rates.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
              <span className="text-neutral-600">ID Firm Market Price:</span>
              <span className="font-bold text-neutral-700 line-through">
                S${activePricing.idEstimate.min.toLocaleString()} – S${activePricing.idEstimate.max.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Homeowner Direct Savings */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-extrabold uppercase text-emerald-900 tracking-wider flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-700" />
                Direct Owner Savings
              </span>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-display">
                  ~S${calculatedSavings.toLocaleString()} saved
                </div>
                <p className="text-[11px] text-emerald-900/80 mt-1">
                  Save approx. {currentConfig.typicalSavingsPct}% by cutting out middleman design firm markups.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs">
              <span className="text-neutral-600">Middleman Markup:</span>
              <span className="font-bold text-emerald-700">0% Commission Fee</span>
            </div>
          </div>

          {/* Turnaround & Warranty */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-extrabold uppercase text-neutral-700 tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-600" />
                Timeline &amp; Warranty Standard
              </span>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
                  {currentConfig.baseTimeline}
                </div>
                <p className="text-[11px] text-neutral-600 mt-1">
                  Standard milestone schedule from permit issuance to final handover.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-200/70 flex items-center justify-between text-xs">
              <span className="text-neutral-600">Workmanship Warranty:</span>
              <span className="font-bold text-neutral-900 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                12 Months Included
              </span>
            </div>
          </div>
        </div>

        {/* Recommended Contractors Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-neutral-950 font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Recommended Verified Contractors for {currentConfig.shortLabel}</span>
              </h4>
              <p className="text-xs text-neutral-500">
                Verified with Singapore Land Authority &amp; HDB RRC Registry. Proximity calculated from your OneMap location.
              </p>
            </div>
            <button
              onClick={() => onRequestQuoteForType?.(currentConfig.label)}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-100/70 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Request Direct Quotes from All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedContractors.map((contractor, idx) => {
              const isExpanded = expandedContractorId === contractor.id;
              const formattedDist = contractor.distanceKm !== undefined ? formatDistance(contractor.distanceKm) : 'Nearby';

              return (
                <div 
                  key={contractor.id}
                  className="bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Match Rank & Proximity Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        Top Match #{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-neutral-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        {formattedDist} ({contractor.region})
                      </span>
                    </div>

                    {/* Company Name */}
                    <h5 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-amber-800 transition-colors line-clamp-1 font-display">
                      {contractor.companyName}
                    </h5>

                    {/* Verified UEN & Registry */}
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1 mb-2.5">
                      <span className="font-mono text-[11px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700">
                        UEN: {contractor.uen}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        HDB RRC Verified
                      </span>
                    </div>

                    {/* Trade Specialization Note */}
                    <div className="bg-neutral-50 rounded-lg p-2.5 border border-neutral-100 text-xs text-neutral-700 mb-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 text-[11px]">Trade Specialty:</span>
                        <span className="font-semibold text-neutral-900 text-[11px]">{currentConfig.shortLabel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 text-[11px]">Area Hub:</span>
                        <span className="font-medium text-neutral-800 text-[11px] truncate max-w-[140px]">{contractor.area}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 text-[11px]">Direct Pricing:</span>
                        <span className="font-bold text-emerald-700 text-[11px]">Trade Rate (0% Markup)</span>
                      </div>
                    </div>

                    {/* Expandable contact & address details */}
                    {isExpanded && (
                      <div className="mb-3 pt-2 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600 animate-in fade-in duration-150">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <a href={`tel:${contractor.contactNo}`} className="text-amber-800 font-bold hover:underline">
                            {contractor.contactNo}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <a href={`mailto:${contractor.email}`} className="truncate hover:underline text-neutral-700">
                            {contractor.email}
                          </a>
                        </div>
                        <div className="flex items-start gap-2">
                          <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight text-neutral-500">
                            {contractor.address}, Singapore {contractor.postalCode}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-neutral-100 space-y-2">
                    <button
                      onClick={() => onOpenQuoteWithContractor?.(contractor)}
                      className="w-full bg-neutral-900 hover:bg-amber-600 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Engage This Contractor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                      onClick={() => setExpandedContractorId(isExpanded ? null : contractor.id)}
                      className="w-full text-neutral-600 hover:text-neutral-900 text-[11px] font-semibold py-1 text-center transition-colors"
                    >
                      {isExpanded ? 'Hide Contact Info' : 'View Direct Contact & Address'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scope & BOQ Specification Checklist */}
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm sm:text-base font-bold text-neutral-900 font-display">
                Homeowner BOQ Checklist: What to Expect for {currentConfig.label}
              </h4>
            </div>
            <span className="text-[11px] font-semibold text-neutral-500 hidden sm:inline">
              Standard Bill of Quantities (BOQ) Protection
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentConfig.scopeChecklist.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white p-3 rounded-lg border border-neutral-200/80 flex items-start gap-2.5 shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-900">
                    {item.title}
                  </h5>
                  <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                    {item.detail}
                  </p>
                  <div className="mt-1.5 text-[10px] font-semibold text-amber-800 bg-amber-50 inline-block px-1.5 py-0.5 rounded">
                    Spec: {item.standardSpec}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
