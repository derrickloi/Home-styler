/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { OneMapCard } from './components/OneMapCard';
import { ServicesSection } from './components/ServicesSection';
import { BiddingSystem } from './components/BiddingSystem';
import { ContractorSection } from './components/ContractorSection';
import { MarketplaceSection } from './components/MarketplaceSection';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ShieldCheck, CheckCircle2, Sparkles, Building, Layers, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('services');
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string>('Full Home Renovation');
  const [defaultMode, setDefaultMode] = useState<'choose_own' | 'recommend' | 'general'>('general');

  const handleSelectService = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setDefaultMode('general');
    setQuoteModalOpen(true);
  };

  const handleOpenDirectChoose = () => {
    setSelectedService('Direct Contractor Engagement');
    setDefaultMode('choose_own');
    setQuoteModalOpen(true);
  };

  const handleOpenRecommend = () => {
    setSelectedService('Contractor Recommendation & Matching');
    setDefaultMode('recommend');
    setQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col antialiased pb-16 md:pb-0">
      {/* Top Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openQuoteModal={() => {
          setSelectedService('Full Home Renovation');
          setDefaultMode('general');
          setQuoteModalOpen(true);
        }} 
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Core Location Intelligence Card (Sub-goals 2 & 3: Live OneMap Data with Plain Words) */}
        <OneMapCard />

        {/* View switching based on active navigation tab or full page layout */}
        {activeTab === 'services' && (
          <>
            <ServicesSection 
              onSelectService={handleSelectService}
              onOpenDirectChoose={handleOpenDirectChoose}
              onOpenRecommend={handleOpenRecommend}
            />
            <BiddingSystem 
              onOpenNewQuote={() => setQuoteModalOpen(true)} 
            />
            <ContractorSection />
            <MarketplaceSection />
          </>
        )}

        {activeTab === 'onemap' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
              <h2 className="text-xl font-bold font-display text-neutral-950 mb-2">
                OneMap Geospatial Verification for Singapore Properties
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
                Every project quotation on HOMESTYLER is anchored by official Singapore Land Authority (SLA) OneMap building geocoding to prevent fraudulent leads, verify property classifications, and provide accurate logistics planning for contractors and merchants.
              </p>
              <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-4 text-xs text-neutral-600">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Official SVY21 &amp; WGS84 Geodata
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-neutral-700">
                  <Building className="w-4 h-4 text-neutral-500" />
                  Building Postal Index: 178903
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bidding' && (
          <BiddingSystem 
            onOpenNewQuote={() => setQuoteModalOpen(true)} 
          />
        )}

        {activeTab === 'contractors' && (
          <ContractorSection />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceSection />
        )}
      </main>

      {/* Footer with Sub-goal 5 Compliance */}
      <Footer />

      {/* Quote & Bidding Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultService={selectedService}
        defaultPostal="178903"
        defaultBuilding="SMU SCHOOL OF ECONOMICS / COMPUTING & INFORMATION SYSTEM 2"
        defaultMode={defaultMode}
      />

      {/* Phone Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
