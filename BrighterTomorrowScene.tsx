import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Download, CheckCircle2, Heart, Share2, Sun } from 'lucide-react';

export const BrighterTomorrowScene: React.FC = () => {
  const [hasPledged, setHasPledged] = useState(false);
  const [pledgeCount, setPledgeCount] = useState(14820);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handlePledge = () => {
    if (hasPledged) return;
    setHasPledged(true);
    setPledgeCount((prev) => prev + 1);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#38BDF8', '#818CF8', '#F472B6', '#34D399'],
      });
    } catch (err) {}
  };

  const handleDownloadBriefing = () => {
    setDownloadSuccess(true);
    const briefingContent = `
AIRAWARE AI — DAILY ATMOSPHERIC INTELLIGENCE BRIEFING
Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
Location: Metropolis Ambient Air Basin (EPA 2026 Standards)

CURRENT STATUS:
• Ambient AQI: 38 (Good)
• Fine Particulate (PM2.5): 8.6 µg/m³
• Ground Ozone (O3): 26.8 ppb
• Temperature: 21°C with Northwesterly Dispersion Breeze

RECOMMENDED RECREATION WINDOWS:
• Favorable: 06:30 – 11:30 (Lowest particulate build-up)
• Afternoon Advisory: 16:30 – 18:30 (Commute concentration peak)

DISCLAIMER:
AirAware provides meteorological and sensor-based environmental guidance. Not intended as medical diagnosis or treatment certainty.
    `.trim();

    const blob = new Blob([briefingContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AirAware_Briefing_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-24 text-center z-10 pointer-events-none">
      <div className="max-w-3xl mx-auto flex flex-col items-center pointer-events-auto">
        {/* Subtle badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-subtle text-xs font-medium text-slate-700 mb-8 shadow-sm">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>The Connected Miniature World</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Clear Skies Ahead</span>
        </div>

        {/* Hero Final Headline */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 text-balance leading-[1.15]">
          Small Steps.<br />
          Clearer Skies.<br />
          <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
            A Brighter Tomorrow.
          </span>
        </h2>

        {/* Supporting text */}
        <p className="text-base sm:text-lg text-slate-600 max-w-xl mb-10 leading-relaxed text-balance">
          Every intentional walk, ventilated morning, and clean-commute choice clears the horizon for our communities.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={handleDownloadBriefing}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl btn-clay-primary text-sm font-semibold tracking-wide cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloadSuccess ? 'Briefing Downloaded!' : 'Download Daily Air Briefing'}</span>
          </button>

          <button
            onClick={handlePledge}
            className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
              hasPledged
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'btn-clay-secondary text-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasPledged ? 'fill-emerald-600 text-emerald-600' : 'text-rose-500'}`} />
            <span>{hasPledged ? 'Pledged for Clean Skies!' : 'Join Clean Air Pledge'}</span>
          </button>
        </div>

        {/* Community counter */}
        <div className="mt-12 text-xs text-slate-500 flex items-center gap-2">
          <span className="font-mono font-bold text-slate-800 tabular-nums">
            {pledgeCount.toLocaleString()}
          </span>
          <span>citizens pledging emission reduction this month</span>
        </div>

        {/* Quiet copyright & metadata */}
        <footer className="mt-16 pt-8 border-t border-slate-200/50 w-full text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            AirAware AI &copy; 2026 · Environmental Intelligence & Spatial 3D Platform
          </div>
          <div className="flex items-center gap-4">
            <span>EPA 2026 AQI Compliance</span>
            <span>·</span>
            <span>Zero-Slop Clean Air Architecture</span>
          </div>
        </footer>
      </div>
    </section>
  );
};
