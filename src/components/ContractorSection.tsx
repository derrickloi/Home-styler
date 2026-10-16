import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  Filter, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  Navigation, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  SlidersHorizontal,
  Home,
  Compass,
  ArrowUpDown
} from 'lucide-react';
import { Contractor, HomeOwnerLocation } from '../types';
import rawContractors from '../data/contractors.json';
import { calculateDistanceKm, formatDistance, PRESET_HOME_LOCATIONS } from '../utils/geo';
import { ContractorMap } from './ContractorMap';

interface ContractorSectionProps {
  onOpenQuoteWithContractor: (contractor: Contractor) => void;
  currentHomeLocation?: HomeOwnerLocation;
}

export const ContractorSection: React.FC<ContractorSectionProps> = ({
  onOpenQuoteWithContractor,
  currentHomeLocation,
}) => {
  // Default to OneMap verified SMU location (Postal 178903) or custom
  const [homeLocation, setHomeLocation] = useState<HomeOwnerLocation>(
    currentHomeLocation || PRESET_HOME_LOCATIONS[0]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [radiusFilter, setRadiusFilter] = useState<number>(0); // 0 means all
  const [sortBy, setSortBy] = useState<'proximity' | 'name'>('proximity');
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [visibleCount, setVisibleCount] = useState(24);
  const [activeViewMode, setActiveViewMode] = useState<'split' | 'map' | 'list'>('split');

  // Compute live proximity distance for all contractors from current homeowner location
  const contractorsWithDistance = useMemo<Contractor[]>(() => {
    return (rawContractors as Contractor[]).map((c) => ({
      ...c,
      distanceKm: calculateDistanceKm(homeLocation.lat, homeLocation.lng, c.lat, c.lng),
    }));
  }, [homeLocation]);

  // Filter & Sort
  const filteredContractors = useMemo(() => {
    return contractorsWithDistance
      .filter((c) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = c.companyName.toLowerCase().includes(q);
          const matchAddress = c.address.toLowerCase().includes(q);
          const matchPostal = c.postalCode.includes(q);
          const matchRef = c.id.toLowerCase().includes(q);
          const matchUen = c.uen.toLowerCase().includes(q);
          if (!matchName && !matchAddress && !matchPostal && !matchRef && !matchUen) return false;
        }

        // Region filter
        if (selectedRegion !== 'all' && c.region !== selectedRegion) {
          return false;
        }

        // Proximity radius filter
        if (radiusFilter > 0 && (c.distanceKm ?? 999) > radiusFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'proximity') {
          return (a.distanceKm ?? 0) - (b.distanceKm ?? 0);
        }
        return a.companyName.localeCompare(b.companyName);
      });
  }, [contractorsWithDistance, searchQuery, selectedRegion, radiusFilter, sortBy]);

  const nearestContractor = filteredContractors[0];

  const handleSelectPresetLocation = (preset: HomeOwnerLocation) => {
    setHomeLocation(preset);
  };

  return (
    <section id="contractors-roster" className="mb-14">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 font-display">
              Verified Contractors &amp; Proximity Map
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {contractorsWithDistance.length} HDB Registered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Official Housing &amp; Development Board (HDB) registered renovation contractors with real-time distance from your property
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <div className="bg-neutral-100 p-1 rounded-lg text-xs font-semibold flex items-center gap-1">
            <button
              onClick={() => setActiveViewMode('split')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeViewMode === 'split' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveViewMode('map')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeViewMode === 'map' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              Full Map
            </button>
            <button
              onClick={() => setActiveViewMode('list')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeViewMode === 'list' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              Directory List
            </button>
          </div>
        </div>
      </div>

      {/* Official Data Source Acknowledgment Badge */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 mb-6 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Official Government Dataset:</strong> Sourced directly from{' '}
            <a 
              href="https://data.gov.sg/datasets/d_9973d2c119ed4dd1560aebf8f0829b86/view" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline font-bold text-amber-900 hover:text-amber-700"
            >
              data.gov.sg (HDB Renovation Contractors)
            </a>. Verified UEN &amp; Directory Reference Numbers.
          </span>
        </div>
        <div className="text-[11px] text-amber-800 font-medium shrink-0 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>2,708 Active Licensed Contractors</span>
        </div>
      </div>

      {/* Homeowner Location Anchoring & Switcher Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 mb-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  Active Reference Point
                </span>
                <span className="text-xs font-mono font-bold text-neutral-800">
                  Postal: {homeLocation.postalCode}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-950 mt-0.5">
                {homeLocation.buildingName}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                {homeLocation.address} • (Lat: {homeLocation.lat.toFixed(4)}, Lng: {homeLocation.lng.toFixed(4)})
              </p>
            </div>
          </div>

          {/* Quick preset changer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-xs font-semibold text-neutral-600 whitespace-nowrap">
              Test other residences:
            </span>
            <select
              value={homeLocation.postalCode}
              onChange={(e) => {
                const found = PRESET_HOME_LOCATIONS.find((p) => p.postalCode === e.target.value);
                if (found) handleSelectPresetLocation(found);
              }}
              className="bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 font-medium focus:outline-none focus:border-amber-500"
            >
              {PRESET_HOME_LOCATIONS.map((preset) => (
                <option key={preset.postalCode} value={preset.postalCode}>
                  {preset.buildingName} ({preset.postalCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick summary stat */}
        {nearestContractor && (
          <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-neutral-700">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>
                Nearest contractor to your home:{' '}
                <strong className="text-neutral-950">{nearestContractor.companyName}</strong> (
                <span className="text-emerald-700 font-bold">{formatDistance(nearestContractor.distanceKm ?? 0)}</span> away)
              </span>
            </div>
            <span className="text-neutral-500 text-[11px]">
              Showing {filteredContractors.length} matching contractors
            </span>
          </div>
        )}
      </div>

      {/* Search & Filters Controls */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 mb-6 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by contractor name, estate (e.g. Defu, Tagore, Ubi), or postal code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Proximity Radius Filter */}
          <div className="md:col-span-3">
            <select
              value={radiusFilter}
              onChange={(e) => setRadiusFilter(Number(e.target.value))}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value={0}>All Singapore Distance</option>
              <option value={3}>Within 3 km (Immediate Proximity)</option>
              <option value={5}>Within 5 km Radius</option>
              <option value={10}>Within 10 km Radius</option>
              <option value={15}>Within 15 km Radius</option>
            </select>
          </div>

          {/* Region Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Regions</option>
              <option value="Central">Central</option>
              <option value="North">North</option>
              <option value="North-East">North-East</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="proximity">Sort: Closest to Home</option>
              <option value="name">Sort: Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area: Map + Roster */}
      <div className="space-y-6">
        {/* Interactive Map */}
        {(activeViewMode === 'split' || activeViewMode === 'map') && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500" />
                Interactive Proximity Map (Homeowner Beacon &amp; Contractor Pins)
              </span>
              <span className="text-xs text-neutral-500">
                Click any pin to view details or click a contractor card below to pan to their location
              </span>
            </div>
            <ContractorMap
              homeLocation={homeLocation}
              contractors={filteredContractors}
              selectedContractor={selectedContractor}
              onSelectContractor={(c) => setSelectedContractor(c)}
              onOpenQuoteWithContractor={onOpenQuoteWithContractor}
            />
          </div>
        )}

        {/* Contractor Cards Roster List */}
        {(activeViewMode === 'split' || activeViewMode === 'list') && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                Contractor Roster (Sorted by Proximity to Postal {homeLocation.postalCode})
              </span>
              <span className="text-xs text-neutral-500">
                Displaying {Math.min(visibleCount, filteredContractors.length)} of {filteredContractors.length} contractors
              </span>
            </div>

            {filteredContractors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center space-y-2">
                <MapPin className="w-8 h-8 text-neutral-400 mx-auto" />
                <h4 className="font-bold text-neutral-900 text-sm">No contractors found within this filter</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try widening the radius filter (e.g. Within 10 km or All Singapore) or clearing the search keyword.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setRadiusFilter(0); setSelectedRegion('all'); }}
                  className="mt-2 text-xs font-semibold px-3 py-1.5 bg-neutral-900 text-white rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContractors.slice(0, visibleCount).map((contractor) => {
                  const isSelected = selectedContractor?.id === contractor.id;
                  const dist = contractor.distanceKm ?? 0;

                  return (
                    <div
                      key={contractor.id}
                      onClick={() => {
                        setSelectedContractor(contractor);
                        if (activeViewMode === 'list') {
                          setActiveViewMode('split');
                        }
                      }}
                      className={`bg-white rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md ${
                        isSelected
                          ? 'border-amber-500 ring-2 ring-amber-400/30 bg-amber-50/10'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div>
                        {/* Top Badges */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200">
                            {contractor.id}
                          </span>
                          {/* Proximity badge */}
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            dist <= 3 
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                              : dist <= 6 
                              ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                              : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                          }`}>
                            <MapPin className="w-3 h-3" />
                            <span>{formatDistance(dist)} away</span>
                          </span>
                        </div>

                        {/* Company Name */}
                        <h4 className="text-sm font-bold text-neutral-950 mb-1 leading-snug font-display line-clamp-1">
                          {contractor.companyName}
                        </h4>

                        {/* Address */}
                        <p className="text-xs text-neutral-600 line-clamp-2 mb-2 leading-relaxed">
                          {contractor.address}
                        </p>

                        <div className="text-[11px] text-neutral-500 space-y-0.5 mb-3">
                          <div>Area: <strong className="text-neutral-700">{contractor.area}</strong></div>
                          <div>Postal: <span className="font-mono font-semibold text-neutral-800">{contractor.postalCode}</span> • UEN: <span className="font-mono">{contractor.uen}</span></div>
                        </div>
                      </div>

                      {/* Contact & Action Row */}
                      <div className="pt-3 border-t border-neutral-100">
                        <div className="flex items-center justify-between gap-2 text-xs mb-2">
                          {contractor.contactNo ? (
                            <a
                              href={`tel:${contractor.contactNo}`}
                              onClick={(e) => e.stopPropagation()}
                              className="font-bold text-neutral-900 hover:text-amber-600 flex items-center gap-1 text-[11px]"
                            >
                              <Phone className="w-3 h-3 text-neutral-500" />
                              <span>{contractor.contactNo}</span>
                            </a>
                          ) : (
                            <span className="text-neutral-400 text-[11px]">No phone listed</span>
                          )}

                          {contractor.email && (
                            <a
                              href={`mailto:${contractor.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-neutral-600 hover:text-neutral-900 text-[11px] flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3 text-neutral-400" />
                              <span>Email</span>
                            </a>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenQuoteWithContractor(contractor);
                          }}
                          className="w-full bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-white text-xs font-bold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Direct Engage &amp; Request Quote</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load more button */}
            {filteredContractors.length > visibleCount && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs border border-neutral-200 shadow-xs transition-all"
                >
                  Load More Contractors ({filteredContractors.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
