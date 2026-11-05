import React from 'react';
import { ArrowDown, Sparkles, Wind, ShieldCheck, Sun } from 'lucide-react';

interface HeroSceneProps {
  onExploreAir: () => void;
  onMeetCompanion: () => void;
  aqi: number;
  condition: string;
}

export const HeroScene: React.FC<HeroSceneProps> = ({
  onExploreAir,
  onMeetCompanion,
  aqi,
  condition,
}) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center z-10 pointer-events-none">
      <div className="max-w-3xl mx-auto flex flex-col items-center pointer-events-auto">
        {/* Subtle environmental status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-subtle text-xs font-medium text-slate-700 mb-8 shadow-sm">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Metropolis Ambient Air</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="font-semibold text-emerald-700">AQI {aqi} Good</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{condition}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 text-balance leading-[1.12]">
          Breathe Better.<br />
          <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
            Live Brighter.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed text-balance">
          Your personal guide to cleaner-air decisions, smarter daily plans, and a healthier environment.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onExploreAir}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl btn-clay-primary text-sm font-semibold tracking-wide cursor-pointer"
          >
            <Wind className="w-4 h-4" />
            <span>Explore Your Air</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={onMeetCompanion}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl btn-clay-secondary text-sm font-semibold text-slate-800 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Meet Your AI Companion</span>
          </button>
        </div>

        {/* Quiet Trust Signals */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>EPA 2026 AQI Compliance</span>
          </div>
          <span aria-hidden="true" className="text-slate-300 hidden sm:inline">·</span>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-sky-600" />
            <span>High-Accuracy Optical Sensors</span>
          </div>
          <span aria-hidden="true" className="text-slate-300 hidden sm:inline">·</span>
          <div>
            <span>Atmospheric Dispersion Modeling</span>
          </div>
        </div>
      </div>
    </section>
  );
};
