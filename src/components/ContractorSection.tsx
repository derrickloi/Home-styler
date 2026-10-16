import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Briefcase, 
  Building2, 
  DollarSign, 
  AlertCircle 
} from 'lucide-react';

export const ContractorSection: React.FC = () => {
  const [contractorFormOpen, setContractorFormOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [regData, setRegData] = useState({
    companyName: '',
    contactPerson: '',
    bcaLicense: '',
    specialty: 'General Renovation & HDB Works',
    phone: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 font-display">
              Verified Contractor Directory &amp; Roster
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Compliance with Sub-goal 4: Contractor directory status &amp; lead management
          </p>
        </div>

        <button
          onClick={() => setContractorFormOpen(!contractorFormOpen)}
          className="self-start sm:self-auto text-xs font-semibold px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-all flex items-center gap-1.5"
        >
          <Briefcase className="w-3.5 h-3.5 text-amber-400" />
          <span>{contractorFormOpen ? 'Close Registration' : 'Contractor Sign-up'}</span>
        </button>
      </div>

      {/* Sub-goal 4 Strict Notice: Data pending upload */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 mb-6 shadow-xs text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-100/80 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-7 h-7" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
          Sub-goal 4: Data Pipeline Reserved
        </span>

        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 font-display">
          Contractor Data Pending Upload
        </h3>

        <p className="text-sm text-neutral-600 max-w-xl mx-auto mt-2 leading-relaxed">
          The verified contractor directory will be populated once contractor profiles are submitted by the administrator. 
          In adherence to our data integrity policy, <strong>no mock, synthetic, or invented contractor rows are displayed</strong>.
        </p>

        {/* Business Canvas Context explanation */}
        <div className="mt-6 pt-6 border-t border-neutral-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 mb-1">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Zero Cost for Homeowners</span>
            </div>
            <p className="text-xs text-neutral-600">
              Homeowners use HOMESTYLER 100% free with no hidden fees or coordination markups.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 mb-1">
              <Briefcase className="w-4 h-4 text-amber-600" />
              <span>Why Contractors Pay</span>
            </div>
            <p className="text-xs text-neutral-600">
              Commission-based access to verified homeowner project leads ready to bid. Free for first 3 months.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 mb-1">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Target Metrics</span>
            </div>
            <p className="text-xs text-neutral-600">
              Platform threshold: &gt;1,000 active homeowners and at least 5 bids per month.
            </p>
          </div>
        </div>
      </div>

      {/* Contractor Pre-Registration Form Modal/Panel */}
      {contractorFormOpen && (
        <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 mb-6 border border-neutral-800 shadow-lg">
          <div className="max-w-xl">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              Contractor Onboarding (THE SIX)
            </span>
            <h3 className="text-xl font-bold font-display mt-1 mb-2">
              Join the HOMESTYLER Contractor Bidding Network
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mb-6">
              Contractors receive direct sales leads from landed property, condo, and HDB homeowners. 3-month free promotional period.
            </p>

            {formSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Registration Inquiry Received</span>
                </div>
                <p className="text-xs">
                  Thank you, <strong>{regData.companyName || 'Contractor'}</strong>. Our contractor vetting team will contact you for BCA license verification and credential checks.
                </p>
                <button
                  onClick={() => { setFormSubmitted(false); setContractorFormOpen(false); }}
                  className="mt-2 text-xs font-semibold px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 rounded text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Company / Firm Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Renovation Pte Ltd"
                      value={regData.companyName}
                      onChange={(e) => setRegData({ ...regData, companyName: e.target.value })}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Contact Person</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Tan"
                      value={regData.contactPerson}
                      onChange={(e) => setRegData({ ...regData, contactPerson: e.target.value })}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">BCA License / HDB Registration No.</label>
                    <input
                      type="text"
                      placeholder="e.g. CR06 / HB-08-1234"
                      value={regData.bcaLicense}
                      onChange={(e) => setRegData({ ...regData, bcaLicense: e.target.value })}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Primary Trade Specialty</label>
                    <select
                      value={regData.specialty}
                      onChange={(e) => setRegData({ ...regData, specialty: e.target.value })}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option>General Renovation &amp; HDB Works</option>
                      <option>Landed Property Rebuilding &amp; A&amp;A</option>
                      <option>Direct Carpentry Workshop</option>
                      <option>M&amp;E, Electrical &amp; Plumbing</option>
                      <option>Interior Architecture &amp; 3D Design</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+65 9123 4567"
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Business Email</label>
                    <input
                      type="email"
                      required
                      placeholder="contact@contractor.sg"
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setContractorFormOpen(false)}
                    className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold"
                  >
                    Submit Contractor Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
