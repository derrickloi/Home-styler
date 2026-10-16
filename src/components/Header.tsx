import React, { useState } from 'react';
import { Home, Hammer, Compass, ShoppingBag, ShieldCheck, Sparkles, Menu, X, Users, CheckCircle2, MapPin, MessagesSquare } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openQuoteModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, openQuoteModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'services', label: 'Services', icon: Hammer },
    { id: 'recommendations', label: 'Nearest 10 Contractors', icon: MapPin },
    { id: 'contractors', label: 'Contractor Roster & Map', icon: Users },
    { id: 'bidding', label: 'Bidding System', icon: Sparkles },
    { id: 'talk-to-us', label: 'Talk to Us', icon: MessagesSquare },
    { id: 'onemap', label: 'OneMap Live', icon: Compass },
    { id: 'marketplace', label: 'Materials Marketplace', icon: ShoppingBag },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top micro-announcement banner */}
      <div className="bg-neutral-900 text-neutral-100 text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none max-w-full">
          <span className="bg-amber-500 text-neutral-950 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">THE SIX</span>
          <span className="flex items-center gap-1 text-neutral-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            100% Free for Home Owners
          </span>
          <span className="hidden sm:inline text-neutral-500">•</span>
          <span className="hidden sm:inline text-neutral-300">Direct Contractor Engagement & Bidding</span>
          <span className="hidden md:inline text-neutral-500">•</span>
          <span className="hidden md:inline text-neutral-400">Singapore Land Authority OneMap Connected</span>
        </div>
        <div className="hidden lg:flex items-center gap-3 text-neutral-300">
          <span>Target: &gt;1,000 Homeowners</span>
          <span className="text-neutral-600">|</span>
          <span className="text-emerald-400 font-semibold">&gt;5 Bids/Month</span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setActiveTab('services')}
              className="cursor-pointer flex items-center gap-2.5"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 font-bold shadow-sm">
                <Home className="w-5 h-5 text-neutral-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-neutral-950 font-display">HOMESTYLER</span>
                  <span className="text-[10px] font-bold bg-neutral-100 border border-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded">SG</span>
                </div>
                <p className="text-[11px] text-neutral-500 font-medium leading-none hidden sm:block">One-Stop Home Improvement & Bids</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={openQuoteModal}
              className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-lg transition-all shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Free Bids</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-neutral-100 mt-2">
            <div className="text-xs text-neutral-500 px-3 py-1 flex items-center justify-between">
              <span>Platform by THE SIX</span>
              <span className="font-semibold text-neutral-800">Zero Cost to Owners</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
