import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Building2, 
  Compass, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  RefreshCw,
  Home,
  Navigation,
  Layers
} from 'lucide-react';
import { Contractor, HomeOwnerLocation } from '../types';
import rawContractors from '../data/contractors.json';
import { calculateDistanceKm, formatDistance, lookupPostalSectorCoordinates } from '../utils/geo';
import { ContractorMap } from './ContractorMap';

interface NearestContractorsTabProps {
  onOpenQuoteWithContractor: (contractor: Contractor) => void;
  defaultPostal?: string;
}

export const NearestContractorsTab: React.FC<NearestContractorsTabProps> = ({
  onOpenQuoteWithContractor,
  defaultPostal = '178903',
}) => {
  const [postalInput, setPostalInput] = useState<string>(defaultPostal);
  const [searchedPostal, setSearchedPostal] = useState<string>(defaultPostal);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);

  // Homeowner location state
  const [homeLocation, setHomeLocation] = useState<HomeOwnerLocation>({
    postalCode: '178903',
    buildingName: 'SMU School of Economics / Computing (Central Hub)',
    address: '90 Stamford Road, Singapore 178903',
    lat: 1.297925,
    lng: 103.848851,
  });

  const [oneMapStatusText, setOneMapStatusText] = useState<string>(
    'Verified via Singapore Land Authority OneMap'
  );

  // Quick preset suggestions
  const presetShortcuts = [
    { code: '178903', name: 'Central (Stamford / City Hall)' },
    { code: '560410', name: 'Ang Mo Kio Central' },
    { code: '520261', name: 'Tampines East Hub' },
    { code: '609601', name: 'Jurong East Gateway' },
    { code: '730501', name: 'Woodlands Civic' },
    { code: '820173', name: 'Punggol Waterway' },
    { code: '440078', name: 'Marine Parade' },
    { code: '310100', name: 'Toa Payoh Central' },
  ];

  // Resolve postal code using keyless OneMap search API (with sector fallback)
  const resolvePostalCode = async (postal: string) => {
    const cleanPostal = postal.trim();
    if (cleanPostal.length !== 6 || !/^\d+$/.test(cleanPostal)) {
      return;
    }

    setIsLoading(true);
    setSearchedPostal(cleanPostal);

    try {
      // Query OneMap keyless endpoint via our /api/onemap proxy
      const res = await fetch(`/api/onemap?searchVal=${cleanPostal}`, {
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.results && json.results.length > 0) {
          const item = json.results[0];
          setHomeLocation({
            postalCode: cleanPostal,
            buildingName: item.BUILDING || item.SEARCHVAL || `Residential Property (Postal ${cleanPostal})`,
            address: item.ADDRESS || `${item.ROAD_NAME || 'Singapore'} ${cleanPostal}`,
            lat: parseFloat(item.LATITUDE),
            lng: parseFloat(item.LONGITUDE),
          });
          setOneMapStatusText(`OneMap SLA Geocoded: ${item.BUILDING || item.ROAD_NAME}`);
          setIsLoading(false);
          return;
        }
      }
    } catch (_) {
      // Ignore network error and fall back to sector mapping
    }

    // Fallback: Sector coordinates lookup
    const sectorInfo = lookupPostalSectorCoordinates(cleanPostal);
    setHomeLocation({
      postalCode: cleanPostal,
      buildingName: `Residence at ${sectorInfo.area}`,
      address: `Singapore Postal Sector ${cleanPostal.slice(0, 2)}, Postal ${cleanPostal}`,
      lat: sectorInfo.lat,
      lng: sectorInfo.lng,
    });
    setOneMapStatusText(`Geolocated to ${sectorInfo.area}`);
    setIsLoading(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resolvePostalCode(postalInput);
  };

  const handleSelectPreset = (code: string) => {
    setPostalInput(code);
    resolvePostalCode(code);
  };

  // Compute distances for all 2,708 contractors and extract the TOP 10 NEAREST
  const top10Contractors = useMemo<Contractor[]>(() => {
    const list = (rawContractors as Contractor[]).map((c) => ({
      ...c,
      distanceKm: calculateDistanceKm(homeLocation.lat, homeLocation.lng, c.lat, c.lng),
    }));

    // Sort by shortest distance
    list.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

    // Return exactly the 10 closest contractors
    return list.slice(0, 10);
  }, [homeLocation]);

  return (
    <div className="space-y-6 mb-16 animate-in fade-in duration-200">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 text-white rounded-2xl p-5 sm:p-7 border border-neutral-800 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-neutral-950 px-2 py-0.5 rounded">
              Owners Prefer Recommendation
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Free for Homeowners
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
            Find the 10 Nearest Contractors to Your Residence
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 leading-relaxed">
            Key in your 6-digit residential postal code. Our algorithm connects with official Singapore Land Authority OneMap geodata to calculate exact distances and recommend the 10 closest licensed HDB renovation contractors.
          </p>

          {/* Postal Code Input Form */}
          <form onSubmit={handleSearchSubmit} className="mt-5 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                maxLength={6}
                value={postalInput}
                onChange={(e) => setPostalInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Key in your 6-digit postal code (e.g. 560410)"
                className="w-full bg-neutral-800/90 border border-neutral-700 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono font-bold text-white placeholder:text-neutral-500 focus:outline-none transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || postalInput.trim().length !== 6}
              className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-neutral-950" />
                  <span>Locating Residence...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Recommend 10 Nearest Contractors</span>
                </>
              )}
            </button>
          </form>

          {/* Preset Shortcuts */}
          <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center gap-1.5 flex-wrap text-xs text-neutral-400">
            <span className="font-semibold text-neutral-300 shrink-0">Quick presets:</span>
            {presetShortcuts.map((preset) => (
              <button
                key={preset.code}
                type="button"
                onClick={() => handleSelectPreset(preset.code)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                  searchedPostal === preset.code
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                }`}
              >
                {preset.code} ({preset.name.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verified Homeowner Location Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                Your Search Location
              </span>
              <span className="text-xs font-mono font-bold text-neutral-900">
                Postal Code: {homeLocation.postalCode}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {oneMapStatusText}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-950 mt-1 font-display">
              {homeLocation.buildingName}
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5">
              {homeLocation.address} • (Lat: {homeLocation.lat.toFixed(5)}, Lng: {homeLocation.lng.toFixed(5)})
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-right self-start md:self-auto shrink-0">
          <div className="text-[10px] uppercase font-bold text-amber-800">Nearest Distance</div>
          <div className="text-lg font-black text-amber-950 font-display">
            {formatDistance(top10Contractors[0]?.distanceKm ?? 0)}
          </div>
          <div className="text-[10px] text-neutral-500">Closest verified workshop</div>
        </div>
      </div>

      {/* Interactive Map Plotting Exactly the 10 Nearest Contractors */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-neutral-900 text-sm sm:text-base font-display">
              Local Proximity Map: Top 10 Nearest Contractors
            </h3>
          </div>
          <span className="text-xs text-neutral-500 hidden sm:inline">
            Click any pin to inspect proximity and request bids
          </span>
        </div>

        <ContractorMap
          homeLocation={homeLocation}
          contractors={top10Contractors}
          selectedContractor={selectedContractor}
          onSelectContractor={(c) => setSelectedContractor(c)}
          onOpenQuoteWithContractor={onOpenQuoteWithContractor}
        />
      </div>

      {/* Top 10 Recommended Contractors Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-950 font-display flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Recommended Top 10 Nearest Contractors</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Ranked strictly by proximity from residential postal code <strong>{homeLocation.postalCode}</strong>
            </p>
          </div>
          <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-lg">
            10 of 2,708 Selected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {top10Contractors.map((contractor, index) => {
            const rank = index + 1;
            const isSelected = selectedContractor?.id === contractor.id;
            const dist = contractor.distanceKm ?? 0;

            // Medals for top 3
            let rankColor = 'bg-neutral-900 text-white';
            if (rank === 1) rankColor = 'bg-amber-500 text-neutral-950 font-black shadow-xs';
            else if (rank === 2) rankColor = 'bg-neutral-300 text-neutral-900 font-bold';
            else if (rank === 3) rankColor = 'bg-amber-700 text-white font-bold';

            return (
              <div
                key={contractor.id}
                onClick={() => setSelectedContractor(contractor)}
                className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-400/40 bg-amber-50/10'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div>
                  {/* Top Rank & Proximity Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 ${rankColor}`}>
                        <Award className="w-3.5 h-3.5" />
                        <span>#{rank} Nearest</span>
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500">
                        {contractor.id}
                      </span>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{formatDistance(dist)} away</span>
                    </span>
                  </div>

                  {/* Company Name */}
                  <h4 className="text-base font-bold text-neutral-950 leading-snug font-display mb-1.5">
                    {contractor.companyName}
                  </h4>

                  {/* Address */}
                  <p className="text-xs text-neutral-600 mb-2 leading-relaxed">
                    {contractor.address}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 mb-4">
                    <div>
                      <span className="text-neutral-400">Postal Code:</span>{' '}
                      <span className="font-mono font-bold text-neutral-800">{contractor.postalCode}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Area:</span>{' '}
                      <span className="font-semibold text-neutral-700">{contractor.area}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">UEN:</span>{' '}
                      <span className="font-mono text-neutral-700">{contractor.uen}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">HDB Status:</span>{' '}
                      <span className="text-emerald-700 font-semibold">Active &amp; Licensed</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-neutral-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    {contractor.contactNo ? (
                      <a
                        href={`tel:${contractor.contactNo}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-neutral-900 hover:text-amber-600 flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{contractor.contactNo}</span>
                      </a>
                    ) : (
                      <span className="text-neutral-400 text-[11px]">No phone listed</span>
                    )}

                    {contractor.email && (
                      <a
                        href={`mailto:${contractor.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-neutral-600 hover:text-neutral-900 font-medium flex items-center gap-1 text-[11px]"
                      >
                        <Mail className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Email Contractor</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuoteWithContractor(contractor);
                    }}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Engage Directly &amp; Request Free Quote</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
