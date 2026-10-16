import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Building2, MapPin, DollarSign, Calendar, ShieldCheck, Hammer } from 'lucide-react';
import { Contractor } from '../types';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
  defaultPostal?: string;
  defaultBuilding?: string;
  defaultMode?: 'choose_own' | 'recommend' | 'general';
  targetContractor?: Contractor | null;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  defaultService = 'Full Home Renovation',
  defaultPostal = '178903',
  defaultBuilding = 'SMU SCHOOL OF ECONOMICS / COMPUTING',
  defaultMode = 'general',
  targetContractor = null,
}) => {
  const [propertyType, setPropertyType] = useState<'HDB' | 'Condominium' | 'Landed Property' | 'Commercial'>('Condominium');
  const [engagementMode, setEngagementMode] = useState<'choose_own' | 'recommend'>(
    targetContractor ? 'choose_own' : (defaultMode === 'choose_own' ? 'choose_own' : 'recommend')
  );
  const [service, setService] = useState(defaultService);
  const [postal, setPostal] = useState(defaultPostal);
  const [budget, setBudget] = useState('$30,000 - $60,000');
  const [timeline, setTimeline] = useState('Within 2-3 Months');
  const [scopeDetails, setScopeDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 font-display">
              Project Lead Successfully Posted!
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
              Your renovation request for <strong>{propertyType}</strong> at postal <strong>{postal}</strong> has been logged to the bidding board.
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
              Mode: {engagementMode === 'choose_own' ? 'Direct Contractor Choice' : 'Curated Recommendation'} • Free for Homeowners ($0)
            </div>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs"
            >
              Back to Overview
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                Zero Cost for Homeowners
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-950 font-display">
              Request Renovation Quotes &amp; Bids
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Direct contractor engagement with verified Singapore Land Authority OneMap address details.
            </p>

            {targetContractor && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between text-xs text-amber-950">
                <div>
                  <div className="font-bold flex items-center gap-1.5 text-neutral-900">
                    <Hammer className="w-3.5 h-3.5 text-amber-600" />
                    <span>Direct Engagement with: {targetContractor.companyName}</span>
                  </div>
                  <div className="text-[11px] text-amber-800 mt-0.5">
                    HDB Ref: {targetContractor.id} • {targetContractor.area} ({targetContractor.distanceKm?.toFixed(1)} km away)
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                  Direct Hire
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Engagement Path Selection (from Key Activities) */}
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Choose Service Engagement Path</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEngagementMode('choose_own')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      engagementMode === 'choose_own'
                        ? 'border-neutral-900 bg-neutral-900 text-white font-bold'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="text-xs">1. Choose Own Contractor</div>
                    <div className="text-[10px] opacity-80 mt-0.5">Direct hiring, zero markup</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEngagementMode('recommend')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      engagementMode === 'recommend'
                        ? 'border-neutral-900 bg-neutral-900 text-white font-bold'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="text-xs">2. Prefer Recommendation</div>
                    <div className="text-[10px] opacity-80 mt-0.5">Matched accredited bids</div>
                  </button>
                </div>
              </div>

              {/* Property Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e: any) => setPropertyType(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-neutral-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="HDB">HDB (BTO / Resale)</option>
                    <option value="Condominium">Condominium</option>
                    <option value="Landed Property">Landed Property</option>
                    <option value="Commercial">Commercial / Office</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Primary Scope</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-neutral-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Full Home Renovation">Full Home Renovation</option>
                    <option value="Kitchen & Bathroom Remodel">Kitchen &amp; Bathroom Remodel</option>
                    <option value="Direct Carpentry & Wardrobes">Direct Carpentry &amp; Wardrobes</option>
                    <option value="One-Stop Interior Design">One-Stop Interior Design</option>
                    <option value="M&E, Electrical & Plumbing">M&amp;E, Electrical &amp; Plumbing</option>
                    <option value="Flooring, Tiling & Painting">Flooring, Tiling &amp; Painting</option>
                  </select>
                </div>
              </div>

              {/* Location & OneMap verified info */}
              <div>
                <label className="block text-neutral-700 font-bold mb-1 flex items-center justify-between">
                  <span>Postal Code &amp; Verified Building</span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> OneMap Verified
                  </span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                    className="w-28 bg-neutral-50 border border-neutral-300 rounded-lg p-2 font-mono font-bold text-neutral-900"
                    placeholder="178903"
                  />
                  <input
                    type="text"
                    readOnly
                    value={defaultBuilding}
                    className="flex-1 bg-neutral-100 border border-neutral-200 rounded-lg p-2 text-neutral-600 text-[11px] truncate"
                  />
                </div>
              </div>

              {/* Budget & Timeline */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Budget Target (SGD)</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-neutral-800 focus:outline-none focus:border-amber-500"
                  >
                    <option>$20,000 - $40,000</option>
                    <option>$40,000 - $60,000</option>
                    <option>$60,000 - $100,000</option>
                    <option>$100,000 - $200,000</option>
                    <option>&gt; $200,000 (Landed Rebuild)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Target Timeline</label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-neutral-800 focus:outline-none focus:border-amber-500"
                  >
                    <option>Immediate (1-4 Weeks)</option>
                    <option>Within 2-3 Months</option>
                    <option>Within 3-6 Months</option>
                    <option>Planning / Key Collection Soon</option>
                  </select>
                </div>
              </div>

              {/* Brief Scope Notes */}
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Project Details or Special Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Demolish kitchen partition wall, install quartz breakfast counter, laminate wardrobe in master bedroom..."
                  value={scopeDetails}
                  onChange={(e) => setScopeDetails(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-neutral-800 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Submit &amp; Open for Contractor Bids</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
