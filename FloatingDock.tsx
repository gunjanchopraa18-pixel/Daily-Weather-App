import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Cloud,
  Building2,
  CalendarDays,
  GraduationCap,
  Sparkles,
  BellRing,
  Sprout,
  Sun
} from 'lucide-react';

interface FloatingDockProps {
  currentSceneIndex: number;
  onSelectScene: (index: number) => void;
  currentAqi: number;
  dataFreshness: string;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  currentSceneIndex,
  onSelectScene,
  currentAqi,
  dataFreshness,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const scenes = [
    { label: 'Sky', icon: Cloud, id: 'sky' },
    { label: 'City Air', icon: Building2, id: 'city' },
    { label: 'Planner', icon: CalendarDays, id: 'plan' },
    { label: 'CampusAir', icon: GraduationCap, id: 'campus' },
    { label: 'Companion', icon: Sparkles, id: 'companion' },
    { label: 'Alerts', icon: BellRing, id: 'alerts' },
    { label: 'Eco Quests', icon: Sprout, id: 'quests' },
    { label: 'Tomorrow', icon: Sun, id: 'tomorrow' },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-4 pointer-events-auto transition-transform duration-300">
      {/* Collapse Toggle Handle */}
      <div className="flex justify-center -mb-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-slate-600 bg-white/90 hover:bg-white border border-slate-200/80 rounded-t-lg shadow-sm backdrop-blur transition-colors cursor-pointer"
          aria-label={isCollapsed ? 'Expand 3D Scene Controls' : 'Collapse HUD for Zen Mode'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Show Scene Explorer</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Zen View</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glass Dock */}
      <div
        className={`glass-panel rounded-2xl p-2.5 transition-all duration-300 ${
          isCollapsed ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Scene selector buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {scenes.map((scene, idx) => {
              const Icon = scene.icon;
              const isActive = currentSceneIndex === idx;
              return (
                <button
                  key={scene.id}
                  onClick={() => onSelectScene(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{scene.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick telemetry readout */}
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 pl-3 border-l border-slate-200/60 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800">AQI {currentAqi}</span>
              <span className="text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded text-[11px] font-medium">
                Good
              </span>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-[11px] text-slate-500">{dataFreshness}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
