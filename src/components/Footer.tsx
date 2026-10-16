import React from 'react';
import { Home, ShieldCheck, Heart, ExternalLink, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-neutral-950 font-bold">
                <Home className="w-4 h-4 text-neutral-950" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight font-display">
                HOMESTYLER
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Empowering Singapore home owners to directly engage contractors, obtain competitive bids, and buy home improvement materials with verified location intelligence.
            </p>
            <div className="text-[11px] text-amber-400 font-semibold">
              An Initiative by THE SIX
            </div>
          </div>

          {/* Business Model & Value propositions */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Business Model
            </h4>
            <ul className="space-y-1.5 text-neutral-400 text-xs">
              <li>100% Free for Home Owners</li>
              <li>Commission-Based for Contractors</li>
              <li>Percentage / Fixed Sharing for Marketplaces</li>
              <li>Free Platform Trial Period: 3 Months</li>
              <li>Direct Contractor &amp; Recommendation Choice</li>
            </ul>
          </div>

          {/* Key Services */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Services Offered
            </h4>
            <ul className="space-y-1.5 text-neutral-400 text-xs">
              <li>Full Home Renovation (HDB, Condo, Landed)</li>
              <li>Contractor Bidding &amp; Quotation Engine</li>
              <li>One-Stop Interior Design &amp; 3D Modeling</li>
              <li>Custom Carpentry &amp; Cabinet Fabrication</li>
              <li>Licensed M&amp;E, Plumbing &amp; Electrical</li>
            </ul>
          </div>

          {/* Sub-goal 5 Compliance: OneMap Attribution */}
          <div className="space-y-3 bg-neutral-900/80 p-4 rounded-xl border border-neutral-800">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Geospatial Intelligence
            </h4>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Geocoding and building address verification powered by the Singapore Land Authority (SLA).
            </p>
            {/* EXACT SUB-GOAL 5 ATTRIBUTION STRING: "Data: One Map" */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
              <span className="font-bold text-amber-400 text-xs">
                Data: One Map
              </span>
              <a
                href="https://www.onemap.gov.sg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                <span>Visit OneMap</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} HOMESTYLER by THE SIX. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            {/* Additional exact display for sub-goal 5 */}
            <span className="font-medium text-neutral-400">Data: One Map</span>
            <span>•</span>
            <span>Zero Personal Data Tracking</span>
            <span>•</span>
            <span>No AI Confidential Sharing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
