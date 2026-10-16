import React, { useState } from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import { 
  MessageSquare, 
  MessagesSquare, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  Send, 
  Lock, 
  ExternalLink,
  Users,
  Building,
  Info
} from 'lucide-react';

interface DiscussionTopic {
  id: string;
  title: string;
  description: string;
  category: string;
}

const TOPICS: DiscussionTopic[] = [
  {
    id: 'homestyler-general-community',
    title: 'Homeowner Renovation & Contractor Community Forum',
    description: 'Ask questions, share renovation tips, discuss material costs, and connect with fellow Singapore homeowners.',
    category: 'Community',
  },
  {
    id: 'homestyler-contractor-experiences',
    title: 'Contractor Reviews, Workmanship & Proximity Experiences',
    description: 'Share your feedback, reviews, and experiences engaging HDB-licensed renovation contractors directly.',
    category: 'Contractor Reviews',
  },
  {
    id: 'homestyler-bidding-advice',
    title: 'Competitive Bids & BOQ Quotation Comparison',
    description: 'Seek advice on itemized bill-of-quantities (BOQ), quotation transparency, and contractor pricing.',
    category: 'Bidding Q&A',
  },
  {
    id: 'homestyler-platform-support',
    title: 'Talk to Us: Platform Feedback & Customer Support',
    description: 'Direct inquiries, bug reports, feature requests, or partnership inquiries for the HOMESTYLER team.',
    category: 'Support',
  },
];

export const TalkToUsTab: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<DiscussionTopic>(TOPICS[0]);
  const [showSsoInfo, setShowSsoInfo] = useState<boolean>(false);

  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/#talk-to-us-${activeTopic.id}` 
    : `https://homestyler.sg/#talk-to-us-${activeTopic.id}`;

  const disqusShortname = 'home-styler';

  const disqusConfig = {
    url: currentUrl,
    identifier: activeTopic.id,
    title: activeTopic.title,
    language: 'en',
  };

  return (
    <div className="space-y-6 mb-16 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 text-white rounded-2xl p-5 sm:p-7 border border-neutral-800 shadow-md">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-neutral-950 px-2 py-0.5 rounded">
              Community &amp; Support
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" /> Powered by Disqus Discussion Forum
            </span>
            <span className="text-[11px] text-neutral-400">
              Shortname: <code className="text-amber-300 font-mono">home-styler</code>
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
            Talk to Us &amp; Singapore Homeowner Community
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 leading-relaxed">
            Have questions about contractor quotations, OneMap proximity searches, or renovation permits? Leave a comment in our Disqus community forum below. Our team and fellow homeowners respond daily.
          </p>

          <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                Open to all homeowners &amp; contractors
              </span>
              <span className="text-neutral-600 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Moderated community
              </span>
            </div>

            <button
              onClick={() => setShowSsoInfo(!showSsoInfo)}
              className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1 underline underline-offset-2 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{showSsoInfo ? 'Hide SSO Details' : 'Disqus SSO Info'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SSO Information Accordion if toggled */}
      {showSsoInfo && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 text-neutral-900 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
            <Info className="w-4 h-4 text-amber-600" />
            <span>Disqus Single Sign-On (SSO) Integration</span>
          </div>
          <p className="text-neutral-700 leading-relaxed">
            HOMESTYLER supports standard Disqus user logins (Google, Facebook, Twitter, Disqus accounts). Single Sign-On (SSO) payload configuration with <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-300">remoteAuthS3</code> and <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-300">apiKey</code> can be configured seamlessly for enterprise tenant sign-ins.
          </p>
          <div className="font-mono text-[11px] bg-white p-3 rounded-xl border border-amber-200 overflow-x-auto text-neutral-800">
            {`// SSO Config pattern:
config={{
  url: '${currentUrl}',
  identifier: '${activeTopic.id}',
  title: '${activeTopic.title}',
  language: 'en',
  remoteAuthS3: '', // HMAC-SHA1 signed payload generated server-side
  apiKey: '',       // Disqus application public API key
  sso: {
    name: 'HOMESTYLER',
    button: 'https://homestyler.sg/logo.png',
    icon: 'https://homestyler.sg/favicon.png',
    url: 'https://homestyler.sg/login',
    logout: 'https://homestyler.sg/logout',
  }
}}`}
          </div>
        </div>
      )}

      {/* Discussion Channel Selector */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-neutral-950 text-sm sm:text-base font-display flex items-center gap-2">
            <MessagesSquare className="w-4 h-4 text-amber-500" />
            <span>Select Discussion Thread</span>
          </h3>
          <span className="text-xs text-neutral-500">
            Thread ID: <code className="font-mono text-neutral-700">{activeTopic.id}</code>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {TOPICS.map((topic) => {
            const isSelected = activeTopic.id === topic.id;
            const topicUrl = typeof window !== 'undefined'
              ? `${window.location.origin}/#talk-to-us-${topic.id}`
              : `https://homestyler.sg/#talk-to-us-${topic.id}`;

            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-400/30 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                      {topic.category}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-medium">
                      <CommentCount
                        shortname={disqusShortname}
                        config={{
                          url: topicUrl,
                          identifier: topic.id,
                          title: topic.title,
                        }}
                      >
                        Comments
                      </CommentCount>
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 leading-snug">
                    {topic.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">
                    {topic.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                  <span className={isSelected ? 'text-amber-700 font-bold' : 'text-neutral-400'}>
                    {isSelected ? '● Active Discussion' : 'View Thread'}
                  </span>
                  <MessageSquare className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-500' : 'text-neutral-400'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Embedded Disqus Forum */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-8 shadow-xs">
        <div className="border-b border-neutral-100 pb-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  {activeTopic.category}
                </span>
                <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                  <CommentCount
                    shortname={disqusShortname}
                    config={disqusConfig}
                  >
                    Comments
                  </CommentCount>
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-950 font-display mt-1.5">
                {activeTopic.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                {activeTopic.description}
              </p>
            </div>

            <div className="self-start sm:self-auto shrink-0 text-right">
              <span className="text-[11px] text-neutral-500 block font-mono">Forum: {disqusShortname}</span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Live Embed Active
              </span>
            </div>
          </div>
        </div>

        {/* Disqus React DiscussionEmbed */}
        <div className="disqus-container min-h-[350px]">
          <DiscussionEmbed
            key={activeTopic.id}
            shortname={disqusShortname}
            config={disqusConfig}
          />
        </div>
      </div>

      {/* Alternative Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-2">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-neutral-950 font-display">General Inquiry Hotline</h4>
          <p className="text-xs text-neutral-500 mt-1">
            Questions regarding contractor registrations or quotation bidding systems.
          </p>
          <a
            href="tel:+6561234567"
            className="text-xs font-bold text-neutral-900 hover:text-amber-600 mt-2 block"
          >
            +65 6123 4567 (Mon-Fri 9am-6pm)
          </a>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-2">
            <Send className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-neutral-950 font-display">Email Customer Care</h4>
          <p className="text-xs text-neutral-500 mt-1">
            Send us your floorplans or project requirements for concierge matching.
          </p>
          <a
            href="mailto:support@homestyler.sg"
            className="text-xs font-bold text-neutral-900 hover:text-amber-600 mt-2 block"
          >
            support@homestyler.sg
          </a>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold mb-2">
            <Building className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-neutral-950 font-display">Contractor Onboarding</h4>
          <p className="text-xs text-neutral-500 mt-1">
            Are you an HDB-licensed renovation contractor? Register your workshop today.
          </p>
          <a
            href="#contractor-onboarding"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-2 flex items-center gap-1"
          >
            <span>Partner with THE SIX</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
