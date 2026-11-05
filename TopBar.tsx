import React from 'react';
import { Wind, Sparkles } from 'lucide-react';

interface TopBarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ activeSection, onNavigate }) => {
  const navItems = [
    { id: 'sky', label: 'The Sky' },
    { id: 'city', label: 'City Air' },
    { id: 'plan', label: 'Plan My Day' },
    { id: 'campus', label: 'CampusAir' },
    { id: 'companion', label: 'AI Companion' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'quests', label: 'Eco Quests' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-6 py-3 rounded-2xl glass-panel shadow-sm">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onNavigate('sky')}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-400 flex items-center justify-center text-white shadow-sm">
            <Wind className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            AirAware AI
          </span>
        </button>

        {/* Zone 2: Single-line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
                  isActive
                    ? 'text-sky-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('companion')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ask Nimbus</span>
          </button>
        </div>
      </div>
    </header>
  );
};
