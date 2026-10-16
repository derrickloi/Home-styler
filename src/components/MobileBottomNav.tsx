import React from 'react';
import { Hammer, Compass, Sparkles, Users, ShoppingBag, MapPin, MessagesSquare } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'services', label: 'Services', icon: Hammer },
    { id: 'recommendations', label: 'Nearest 10', icon: MapPin },
    { id: 'contractors', label: 'Roster', icon: Users },
    { id: 'bidding', label: 'Bidding', icon: Sparkles },
    { id: 'talk-to-us', label: 'Talk to Us', icon: MessagesSquare },
    { id: 'marketplace', label: 'Shop', icon: ShoppingBag },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-2 py-1.5 shadow-lg safe-area-pb">
      <div className="grid grid-cols-6 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 rounded-lg transition-all ${
                isActive
                  ? 'text-amber-600 font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
