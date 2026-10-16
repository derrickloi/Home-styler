import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Search, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Navigation, 
  ArrowRight, 
  Layers, 
  Compass, 
  SlidersHorizontal,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import { Contractor, HomeOwnerLocation, OneMapApiResponse } from '../types';
import rawContractors from '../data/contractors.json';
import { calculateDistanceKm, formatDistance, PRESET_HOME_LOCATIONS, getSectorFallbackLocation } from '../utils/geo';
import { ContractorMap } from './ContractorMap';

interface NearestContractorsTabProps {
  onOpenQuoteWithContractor: (contractor: Contractor) => void;
  onRequestQuoteWithPostal?: (postalCode: string, buildingName: string) => void;
  initialPostal?: string;
}

export const NearestContractorsTab: React.FC<NearestContractorsTabProps> = ({
  onOpenQuoteWithContractor,
  onRequestQuoteWithPostal,
  initialPostal = '178903',
}) => {
  const [postalInput, setPostalInput] = useState<string>(initialPostal);
  const [currentLocation, setCurrentLocation] = useState<HomeOwnerLocation>(PRESET_HOME_LOCATIONS[0]);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [geocodingMessage, setGeocodingMessage] = useState<string>('Verified OneMap Singapore coordinates active');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');

  // Perform geocode for residential postal code
  const handleGeocodePostal = async (postalToLookup: string) => {
    const cleanPostal = postalToLookup.replace(/\D/g, '').trim();
    if (cleanPostal.length !== 6) {
      setGeocodingMessage('Please enter a valid 6-digit Singapore residential postal code.');
      return;
    }

    setIsGeocoding(true);
    setGeocodingMessage(`Verifying postal ${cleanPostal} with Singapore Land Authority (OneMap)...`);

    // First check preset locations
    const matchedPreset = PRESET_HOME_LOCATIONS.find(p => p.postalCode === cleanPostal);
    if (matchedPreset) {
      setCurrentLocation(matchedPreset);
      setGeocodingMessage(`Verified: ${matchedPreset.buildingName}`);
      setIsGeocoding(false);
      return;
    }

    try {
      const res = await fetch(`/api/onemap?postal=${cleanPostal}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        const json: OneMapApiResponse = await res.json();
        if (json.results && json.results.length > 0) {
          const item = json.results[0];
          const lat = parseFloat(item.LATITUDE);
          const lng = parseFloat(item.LONGITUDE);

          if (!isNaN(lat) && !isNaN(lng)) {
            const newLoc: HomeOwnerLocation = {
              postalCode: cleanPostal,
              buildingName: item.BUILDING && item.BUILDING !== 'NIL' ? item.BUILDING : item.SEARCHVAL,
              address: item.ADDRESS,
              lat,
              lng,
            };
            setCurrentLocation(newLoc);
            setGeocodingMessage(`Verified via OneMap SLA: ${newLoc.buildingName}`);
            setIsGeocoding(false);
            return;
          }
        }
      }

      // If OneMap has no exact record or network fallback, use sector centroid
      const fallback = getSectorFallbackLocation(cleanPostal);
      setCurrentLocation(fallback);
      setGeocodingMessage(`Location calibrated for Postal Sector ${cleanPostal.slice(0, 2)} (${fallback.address})`);
    } catch {
      const fallback = getSectorFallbackLocation(cleanPostal);
      setCurrentLocation(fallback);
      setGeocodingMessage(`Location calibrated for Postal Sector ${cleanPostal.slice(0, 2)} (${fallback.address})`);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Run initial geocode if initialPostal passed
  useEffect(() => {
    if (initialPostal && initialPostal !== currentLocation.postalCode) {
      setPostalInput(initialPostal);
      handleGeocodePostal(initialPostal);
    }
  }, [initialPostal]);

  // Calculate distances for all contractors from current homeowner location
  const allContractorsWithDistance = useMemo<Contractor[]>(() => {
    const list = rawContractors as Contractor[];
    return list.map((c) => ({
      ...c,
      distanceKm: calculateDistanceKm(currentLocation.lat, currentLocation.lng, c.lat, c.lng),
    }));
  }, [currentLocation]);

  // Filter by trade if requested
  const filteredByTrade = useMemo(() => {
    if (selectedTrade === 'all') return allContractorsWithDistance;
    return allContractorsWithDistance.filter((c) => {
      const text = `${c.companyName} ${c.area} ${c.sector}`.toLowerCase();
      if (selectedTrade === 'carpentry') {
        return text.includes('furniture') || text.includes('carpentry') || text.includes('wood') || text.includes('design');
      }
      if (selectedTrade === 'wet_works') {
        return text.includes('construction') || text.includes('building') || text.includes('trading') || text.includes('water');
      }
      if (selectedTrade === 'electrical') {
        return text.includes('electrical') || text.includes('water') || text.includes('tech') || text.includes('services');
      }
      if (selectedTrade === 'aluminium') {
        return text.includes('aluminium') || text.includes('glass') || text.includes('metal') || text.includes('iron');
      }
      return true;
    });
  }, [allContractorsWithDistance, selectedTrade]);

  // Strictly select the TOP 10 NEAREST contractors
  const top10Contractors = useMemo<Contractor[]>(() => {
    const sorted = [...filteredByTrade].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    return sorted.slice(0, 10);
  }, [filteredByTrade]);

  // Stats
  const avgDistance = useMemo(() => {
    if (top10Contractors.length === 0) return 0;
    const sum = top10Contractors.reduce((acc, c) => acc + (c.distanceKm || 0), 0);
    return Math.round((sum / top10Contractors.length) * 10) / 10;
  }, [top10Contractors]);

  const copyContact = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Postal Code Input Banner */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-2xl p-5 sm:p-7 shadow-sm border border-neutral-800">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-extrabold bg-amber-400 text-neutral-950 px-2.5 py-0.5 rounded tracking-wide uppercase flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-950" />
              Proximity Match Engine
            </span>
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SLA OneMap Geocoded
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            Find the 10 Nearest Contractors to Your Postal Code
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 leading-relaxed">
            Enter your 6-digit residential postal code. Our algorithm calculates real-time Haversine distances to over 100 accredited Singapore renovation contractors and recommends the 10 closest verified firms.
          </p>

          {/* Postal Code Search Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleGeocodePostal(postalInput);
            }}
            className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-xl"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <MapPin className="w-4 h-4 text-amber-400" />
              </div>
              <input
                type="text"
                value={postalInput}
                onChange={(e) => setPostalInput(e.target.value)}
                maxLength={6}
                placeholder="Key in 6-digit postal code (e.g. 520261)"
                className="w-full pl-10 pr-4 py-3 bg-neutral-800/90 border border-neutral-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl text-white placeholder-neutral-500 font-mono text-sm tracking-wider outline-none transition-all"
              />
            </div>
            
            <button
              type="submit"
              disabled={isGeocoding}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-60 shadow-xs active:scale-[0.98]"
            >
              {isGeocoding ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Recommend 10 Nearest</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Preset Buttons */}
          <div className="mt-4 pt-4 border-t border-neutral-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Popular Singapore Residential Estates:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRESET_HOME_LOCATIONS.map((preset) => (
                <button
                  key={preset.postalCode}
                  type="button"
                  onClick={() => {
                    setPostalInput(preset.postalCode);
                    handleGeocodePostal(preset.postalCode);
                  }}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    currentLocation.postalCode === preset.postalCode
                      ? 'bg-amber-400 text-neutral-950 border-amber-400 font-bold'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  {preset.buildingName.split('(')[0].trim()} ({preset.postalCode})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verified Homeowner Location Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-900">
                {currentLocation.buildingName}
              </span>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded border border-emerald-200">
                Postal {currentLocation.postalCode}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {currentLocation.address} • Coordinates: {currentLocation.lat.toFixed(4)}° N, {currentLocation.lng.toFixed(4)}° E
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-600 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Proximity Radius</span>
            <span className="font-bold text-neutral-900">Avg {avgDistance} km</span>
          </div>
          <button
            onClick={() => onRequestQuoteWithPostal?.(currentLocation.postalCode, currentLocation.buildingName)}
            className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Request Direct Quotes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Roster Controls: Trade Filter & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <h3 className="text-lg sm:text-xl font-bold font-display text-neutral-950">
            Top 10 Nearest Contractors to {currentLocation.postalCode}
          </h3>
          <span className="text-xs font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full border border-neutral-200">
            10 Recommended
          </span>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'split' ? 'bg-white text-neutral-950 font-bold shadow-2xs' : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'grid' ? 'bg-white text-neutral-950 font-bold shadow-2xs' : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              10 Cards List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'map' ? 'bg-white text-neutral-950 font-bold shadow-2xs' : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Interactive Map
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area based on View Mode */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Top 10 Contractors Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5">
            {top10Contractors.map((contractor, idx) => (
              <ContractorListItem
                key={contractor.id}
                contractor={contractor}
                rank={idx + 1}
                isSelected={selectedContractor?.id === contractor.id}
                onSelect={() => setSelectedContractor(contractor)}
                onOpenQuote={() => onOpenQuoteWithContractor(contractor)}
                onCopyContact={copyContact}
                copiedId={copiedId}
              />
            ))}
          </div>

          {/* Right Column: Sticky Interactive Leaflet Map (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
              <div className="p-3 bg-neutral-900 text-white flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>Live Map: 10 Nearest Contractors</span>
                </span>
                <span className="text-neutral-400 text-[11px]">
                  Postal {currentLocation.postalCode}
                </span>
              </div>
              <div className="h-[480px] w-full">
                <ContractorMap
                  homeLocation={currentLocation}
                  contractors={top10Contractors}
                  selectedContractor={selectedContractor}
                  onSelectContractor={(c) => setSelectedContractor(c)}
                  onOpenQuoteWithContractor={onOpenQuoteWithContractor}
                  radiusKm={avgDistance * 1.5}
                />
              </div>
              <div className="p-3 bg-neutral-50 border-t border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
                <span>📍 Amber Pin: Your Residence</span>
                <span>🔵 Blue Pins: 10 Nearest Contractors</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {top10Contractors.map((contractor, idx) => (
            <ContractorListItem
              key={contractor.id}
              contractor={contractor}
              rank={idx + 1}
              isSelected={selectedContractor?.id === contractor.id}
              onSelect={() => setSelectedContractor(contractor)}
              onOpenQuote={() => onOpenQuoteWithContractor(contractor)}
              onCopyContact={copyContact}
              copiedId={copiedId}
            />
          ))}
        </div>
      )}

      {viewMode === 'map' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-neutral-900 text-white flex items-center justify-between text-sm font-semibold">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>Full-Width Map View: 10 Nearest Contractors to Postal {currentLocation.postalCode}</span>
            </div>
            <span className="text-xs text-neutral-400">
              Click any pin for contractor details &amp; direct quote
            </span>
          </div>
          <div className="h-[600px] w-full">
            <ContractorMap
              homeLocation={currentLocation}
              contractors={top10Contractors}
              selectedContractor={selectedContractor}
              onSelectContractor={(c) => setSelectedContractor(c)}
              onOpenQuoteWithContractor={onOpenQuoteWithContractor}
              radiusKm={avgDistance * 2}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface ContractorListItemProps {
  contractor: Contractor;
  rank: number;
  isSelected: boolean;
  onSelect: () => void;
  onOpenQuote: () => void;
  onCopyContact: (text: string, id: string) => void;
  copiedId: string | null;
}

const ContractorListItem: React.FC<ContractorListItemProps> = ({
  contractor,
  rank,
  isSelected,
  onSelect,
  onOpenQuote,
  onCopyContact,
  copiedId,
}) => {
  const formattedDistance = contractor.distanceKm !== undefined ? formatDistance(contractor.distanceKm) : 'Nearby';

  // Distinct styling for top 3
  const isTopThree = rank <= 3;

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-xl border p-4 transition-all cursor-pointer relative shadow-2xs hover:shadow-md ${
        isSelected
          ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20'
          : 'border-neutral-200 hover:border-neutral-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {/* Rank Badge */}
          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
            rank === 1
              ? 'bg-amber-500 text-neutral-950 shadow-xs'
              : rank === 2
              ? 'bg-neutral-800 text-white'
              : rank === 3
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-neutral-100 text-neutral-700'
          }`}>
            #{rank} Nearest
          </span>

          <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
            UEN: {contractor.uen}
          </span>
        </div>

        {/* Proximity Distance */}
        <div className="text-right">
          <span className="text-sm font-extrabold text-amber-700 font-display flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-amber-600" />
            {formattedDistance}
          </span>
          <span className="text-[10px] text-neutral-400 block">{contractor.region} Hub</span>
        </div>
      </div>

      {/* Company Name */}
      <h4 className="text-base font-bold text-neutral-900 font-display hover:text-amber-700 transition-colors">
        {contractor.companyName}
      </h4>

      {/* Address & Sector */}
      <div className="flex items-start gap-1.5 text-xs text-neutral-600 mt-1 mb-3">
        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
        <span className="leading-snug">
          {contractor.address}, Singapore {contractor.postalCode} • <strong className="text-neutral-800">{contractor.area}</strong>
        </span>
      </div>

      {/* Trust Badges */}
      <div className="flex items-center gap-2 flex-wrap mb-3 text-[11px]">
        <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          HDB RRC Verified
        </span>
        <span className="bg-neutral-100 text-neutral-700 font-medium px-2 py-0.5 rounded">
          Sector {contractor.sector}
        </span>
        <span className="bg-amber-50 text-amber-900 font-semibold px-2 py-0.5 rounded border border-amber-200/60">
          Direct Trade Pricing
        </span>
      </div>

      {/* Actions: Phone, Email & Engage */}
      <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <a
            href={`tel:${contractor.contactNo}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 font-bold text-neutral-900 hover:text-amber-700 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-neutral-500" />
            <span>{contractor.contactNo}</span>
          </a>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCopyContact(contractor.contactNo, contractor.id);
            }}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors"
            title="Copy Contact Number"
          >
            {copiedId === contractor.id ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenQuote();
          }}
          className="bg-neutral-900 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-2xs active:scale-[0.98]"
        >
          <span>Engage Contractor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
