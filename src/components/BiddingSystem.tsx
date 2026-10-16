import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Clock, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  FileText 
} from 'lucide-react';
import { ProjectQuoteRequest } from '../types';

interface BiddingSystemProps {
  onOpenNewQuote: () => void;
  defaultPostal?: string;
  defaultAddress?: string;
}

export const BiddingSystem: React.FC<BiddingSystemProps> = ({ 
  onOpenNewQuote, 
  defaultPostal = '178903',
  defaultAddress = '90 STAMFORD ROAD (SMU ECON/COMPUTING)' 
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'how_it_works'>('requests');

  // Initial user quote requests showing platform workflow
  const [requests, setRequests] = useState<ProjectQuoteRequest[]>([
    {
      id: 'REQ-101',
      ownerName: 'Homeowner (Stamford Vicinity)',
      propertyType: 'Condominium',
      serviceType: 'Full Renovation & Carpentry',
      postalCode: '178903',
      budgetRange: '$40,000 - $60,000',
      estimatedTimeline: '8 - 10 Weeks',
      description: '3-bedroom condo full kitchen overhaul, master bedroom custom wardrobe, vinyl flooring replacement, and bathroom waterproofing.',
      createdAt: 'Today',
      bidsReceived: 6
    },
    {
      id: 'REQ-102',
      ownerName: 'Homeowner (Landed Property)',
      propertyType: 'Landed Property',
      serviceType: 'Direct Contractor Engagement',
      postalCode: '178903',
      budgetRange: '$90,000 - $140,000',
      estimatedTimeline: '12 - 16 Weeks',
      description: 'Addition & Alteration (A&A), facade repainting, structural tiling, and full M&E rewiring with licensed electrical worker.',
      createdAt: 'Yesterday',
      bidsReceived: 5
    }
  ]);

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 font-display">
              Contractor Bidding &amp; Quotation Engine
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Transparent competitive bidding between contractors so homeowners choose based on need, quality, and price
          </p>
        </div>

        <button
          onClick={onOpenNewQuote}
          className="self-start sm:self-auto bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-all shadow-xs flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Post New Project Lead</span>
        </button>
      </div>

      {/* Target Metric Dashboard (Context from economics sheet) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Active Homeowners</div>
          <div className="text-xl sm:text-2xl font-black text-neutral-900 mt-1 font-display">1,420+</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Target: &gt;1,000 (Achieved)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Monthly Bids Rate</div>
          <div className="text-xl sm:text-2xl font-black text-neutral-900 mt-1 font-display">48 Bids</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Target: &gt;5 bids/month</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Homeowner Cost</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 font-display">$0.00 Free</div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Zero fees for owners</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">OneMap Verified Hub</div>
          <div className="text-xl sm:text-2xl font-black text-neutral-900 mt-1 font-display font-mono">178903</div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Central Renovation Hub</div>
        </div>
      </div>

      {/* Project Leads & Quotations List */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-neutral-900 text-base font-display">
              Live Homeowner Project Leads (Ready for Contractor Bids)
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Contractors view verified projects and submit competitive quotations directly.
            </p>
          </div>

          <div className="flex items-center gap-1 self-start sm:self-auto bg-neutral-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'requests' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              Active Leads ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('how_it_works')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'how_it_works' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              Economics &amp; Rules
            </button>
          </div>
        </div>

        {activeTab === 'requests' ? (
          <div className="divide-y divide-neutral-100">
            {requests.map((req) => (
              <div key={req.id} className="p-4 sm:p-5 hover:bg-neutral-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded">
                        {req.id}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        {req.propertyType}
                      </span>
                      <span className="text-xs font-semibold text-neutral-500">
                        Service: <strong className="text-neutral-800">{req.serviceType}</strong>
                      </span>
                    </div>

                    <p className="text-sm text-neutral-800 mt-2 font-medium">
                      {req.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-neutral-600 mt-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        Postal: <strong className="text-neutral-900 font-mono">{req.postalCode}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        Budget: <strong className="text-neutral-900">{req.budgetRange}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        Timeline: <strong className="text-neutral-900">{req.estimatedTimeline}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-neutral-100">
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        {req.bidsReceived} Bids Submitted
                      </span>
                    </div>
                    <button
                      onClick={onOpenNewQuote}
                      className="text-xs font-bold text-neutral-900 hover:text-amber-600 flex items-center gap-1"
                    >
                      <span>Submit Bid / View</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-xs text-neutral-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                <h4 className="font-bold text-neutral-900 text-sm">For Homeowners (100% Free)</h4>
                <ul className="space-y-1.5 list-disc pl-4 text-neutral-600">
                  <li>Post renovation requirements at zero cost.</li>
                  <li>Receive itemized bids with detailed breakdowns of materials, scope, and warranties.</li>
                  <li>Compare options objectively without high-pressure sales tactics.</li>
                  <li>Direct access to contractors or matched recommendations.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                <h4 className="font-bold text-neutral-900 text-sm">For Contractors &amp; Interior Designers</h4>
                <ul className="space-y-1.5 list-disc pl-4 text-neutral-600">
                  <li>Access qualified homeowner sales leads ready for construction.</li>
                  <li>Pay on a commission basis only when contracts are awarded.</li>
                  <li>Introductory promotion: Free for all partners for first 3 months.</li>
                  <li>Build a verified track record with verified customer reviews.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
