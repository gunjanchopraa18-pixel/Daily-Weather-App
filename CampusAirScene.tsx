import React, { useState } from 'react';
import { CampusStation } from '../../types';
import {
  GraduationCap,
  MapPin,
  ShieldCheck,
  Radio,
  CheckCircle2,
  Info,
  Layers
} from 'lucide-react';

interface CampusAirSceneProps {
  stations: CampusStation[];
}

export const CampusAirScene: React.FC<CampusAirSceneProps> = ({ stations }) => {
  const [selectedStationId, setSelectedStationId] = useState<string>(stations[0]?.id || '');
  const activeStation = stations.find((s) => s.id === selectedStationId) || stations[0];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 z-10 pointer-events-none">
      <div className="max-w-5xl w-full mx-auto pointer-events-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel-subtle text-xs font-semibold text-indigo-800 mb-3">
            <span>Scene 4 · The Campus</span>
            <span aria-hidden="true">·</span>
            <span>University Micro-Network</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight text-balance">
            CampusAir Micro-Sensor Grid
          </h2>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Hyper-localized air intelligence across academic quadrangles, science concourses, and athletic fields.
          </p>
        </div>

        {/* Main Floating Glass Container */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Interactive Campus Map & Node Grid */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Interactive Campus Grid
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Select a station to inspect sensor hardware
                  </span>
                </div>

                {/* Campus Graphic Map Diagram */}
                <div className="relative w-full h-64 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-sky-50/70 to-emerald-50/70 border border-indigo-100 overflow-hidden p-4 flex flex-col justify-between">
                  {/* Subtle campus pathways grid */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#0284C7" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1="20%" y1="80%" x2="80%" y2="20%" stroke="#0284C7" strokeWidth="2" strokeDasharray="4 4" />
                      <circle cx="50%" cy="50%" r="60" stroke="#0284C7" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>

                  {/* Station Interactive Markers on the Campus Map */}
                  {stations.map((st) => {
                    const isSelected = st.id === selectedStationId;
                    const coords = st.coords || { x: 50, y: 50 };
                    return (
                      <button
                        key={st.id}
                        onClick={() => setSelectedStationId(st.id)}
                        style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl transition-all cursor-pointer group focus:outline-none ${
                          isSelected
                            ? 'bg-sky-600 text-white scale-110 shadow-lg ring-4 ring-sky-300/60 z-20'
                            : 'bg-white/90 text-slate-800 hover:bg-white shadow-sm z-10'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Radio className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-sky-600'}`} />
                          <span className="text-xs font-bold font-mono tabular-nums">
                            {st.aqi}
                          </span>
                        </div>
                        <div className="text-[10px] whitespace-nowrap hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded bg-slate-900 text-white shadow">
                          {st.name}
                        </div>
                      </button>
                    );
                  })}

                  {/* Campus Map Legend */}
                  <div className="z-10 mt-auto flex items-center justify-between text-[11px] text-slate-600 bg-white/70 backdrop-blur px-3 py-1.5 rounded-xl border border-white/80">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-500" />
                      <span>Reference Grade BAM Station</span>
                    </span>
                    <span className="text-slate-400">|</span>
                    <span>Direct Campus Footprint</span>
                  </div>
                </div>
              </div>

              {/* Station List Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {stations.map((st) => {
                  const isSelected = st.id === selectedStationId;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStationId(st.id)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50/90 border-sky-400 shadow-sm'
                          : 'bg-white/60 border-slate-200/60 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {st.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-sky-700">
                          AQI {st.aqi}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {st.distance} · {st.category}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Active Station Deep Dive & Hardware Provenance */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-white/90 to-slate-50/80 border border-slate-200/80 shadow-sm">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Node Telemetry
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded">
                    {activeStation.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {activeStation.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Located {activeStation.distance}
                </p>

                <div className="mt-5 p-4 rounded-xl bg-slate-100/60 border border-slate-200/60 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500">Local AQI Reading</div>
                    <div className="text-4xl font-extrabold text-slate-900 font-mono tabular-nums">
                      {activeStation.aqi}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-500">Fine PM2.5 Concentration</div>
                    <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
                      {activeStation.pm25} <span className="text-xs font-normal">µg/m³</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-xs text-slate-600">
                  <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Sensor Hardware:</span>
                    <strong className="text-slate-800 text-right">{activeStation.hardware}</strong>
                  </div>
                  <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Calibration State:</span>
                    <strong className="text-emerald-700 text-right">{activeStation.status}</strong>
                  </div>
                  <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Microclimate Scope:</span>
                    <strong className="text-slate-800 text-right">{activeStation.coverage}</strong>
                  </div>
                </div>
              </div>

              {/* Data Integrity Transparency Note */}
              <div className="mt-6 p-3 rounded-xl bg-sky-50/70 border border-sky-100 text-[11px] text-sky-900 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Coverage Notice:</strong> Readings reflect specific station coordinates. Nearby buildings or tree canopies may create microclimatic variations.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
