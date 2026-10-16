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
import { NearestContractorsTab } from './components/NearestContractorsTab';
import { MarketplaceSection } from './components/MarketplaceSection';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { TalkToUsTab } from './components/TalkToUsTab';
import { ShieldCheck, CheckCircle2, Sparkles, Building, Layers, ArrowRight } from 'lucide-react';
import { Contractor } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('services');
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string>('Full Home Renovation');
  const [defaultMode, setDefaultMode] = useState<'choose_own' | 'recommend' | 'general'>('general');
  const [targetContractor, setTargetContractor] = useState<Contractor | null>(null);

  const handleSelectService = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setDefaultMode('general');
    setTargetContractor(null);
    setQuoteModalOpen(true);
  };

  const handleOpenDirectChoose = () => {
    setSelectedService('Direct Contractor Engagement');
    setDefaultMode('choose_own');
    setTargetContractor(null);
    setActiveTab('contractors');
  };

  const handleOpenRecommend = () => {
    setSelectedService('Contractor Recommendation & Matching');
    setDefaultMode('recommend');
    setTargetContractor(null);
    setActiveTab('recommendations');
  };

  const handleOpenQuoteWithContractor = (contractor: Contractor) => {
    setTargetContractor(contractor);
    setSelectedService(`Direct Engagement: ${contractor.companyName}`);
    setDefaultMode('choose_own');
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
            <ContractorSection 
              onOpenQuoteWithContractor={handleOpenQuoteWithContractor}
            />
            <MarketplaceSection />
          </>
        )}

        {/* Dedicated Tab for Keying in Residential Postal Code & Getting 10 Nearest Contractors */}
        {activeTab === 'recommendations' && (
          <NearestContractorsTab
            onOpenQuoteWithContractor={handleOpenQuoteWithContractor}
          />
        )}

        {activeTab === 'contractors' && (
          <ContractorSection 
            onOpenQuoteWithContractor={handleOpenQuoteWithContractor}
          />
        )}

        {activeTab === 'bidding' && (
          <BiddingSystem 
            onOpenNewQuote={() => setQuoteModalOpen(true)} 
          />
        )}

        {activeTab === 'talk-to-us' && (
          <TalkToUsTab />
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

        {activeTab === 'marketplace' && (
          <MarketplaceSection />
        )}
      </main>

      {/* Footer with Sub-goal 5 Compliance */}
      <Footer />

      {/* Quote & Bidding Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => {
          setQuoteModalOpen(false);
          setTargetContractor(null);
        }}
        defaultService={selectedService}
        defaultPostal="178903"
        defaultBuilding="SMU SCHOOL OF ECONOMICS / COMPUTING & INFORMATION SYSTEM 2"
        defaultMode={defaultMode}
        targetContractor={targetContractor}
      />

      {/* Phone Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
