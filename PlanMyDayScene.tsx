import React, { useState } from 'react';
import {
  Activity,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  Calendar,
  Filter
} from 'lucide-react';

export const PlanMyDayScene: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<string>('jogging');
  const [selectedDuration, setSelectedDuration] = useState<string>('45 min');
  const [selectedLocation, setSelectedLocation] = useState<string>('Central Park & Arbor');
  const [preferences, setPreferences] = useState({
    sensitiveLungs: false,
    pollenFilter: false,
    avoidPeakTraffic: true,
  });

  const activities = [
    { id: 'jogging', label: 'Jogging / Running', intensity: 'High ventilation rate' },
    { id: 'cycling', label: 'Cycling', intensity: 'Moderate-high ventilation' },
    { id: 'stroller', label: 'Stroller Walk with Child', intensity: 'Low ventilation, ground sensitivity' },
    { id: 'yoga', label: 'Park Yoga & Breathing', intensity: 'Deep inhale rate' },
    { id: 'gardening', label: 'Community Gardening', intensity: 'Extended outdoor contact' },
    { id: 'dining', label: 'Outdoor Patio Dining', intensity: 'Stationary recreation' },
  ];

  // Evaluated Time Windows based on atmospheric models
  const timeSlots = [
    {
      window: 'Early Morning (06:30 – 08:30)',
      rating: 'Favorable',
      ratingColor: 'text-emerald-800 bg-emerald-100 border-emerald-200',
      aqiRange: 'AQI 28 – 35',
      pm25: '6.4 µg/m³',
      temp: '17°C',
      ozone: 'Low (ground ozone inactive)',
      reasoning: 'Calm morning air before highway commuter build-up. Negligible photochemical ozone formation.',
      sourceType: 'Historical pattern + live overnight sensor baseline',
      isRecommended: true,
    },
    {
      window: 'Midday (11:00 – 13:30)',
      rating: 'Good Window',
      ratingColor: 'text-sky-800 bg-sky-100 border-sky-200',
      aqiRange: 'AQI 38 – 42',
      pm25: '8.6 µg/m³',
      temp: '22°C',
      ozone: 'Moderate (solar UV active)',
      reasoning: 'Strong vertical atmospheric mixing disperses fine particulates, though midday sunlight raises ambient ozone slightly.',
      sourceType: 'Active NWP dispersion forecast',
      isRecommended: true,
    },
    {
      window: 'Late Afternoon (16:30 – 18:30)',
      rating: 'Caution for Sensitive',
      ratingColor: 'text-amber-800 bg-amber-100 border-amber-200',
      aqiRange: 'AQI 54 – 62',
      pm25: '13.8 µg/m³',
      temp: '21°C',
      ozone: 'Elevated near roads',
      reasoning: 'Commuter vehicle emissions coincide with decreasing boundary layer mixing. Particulates accumulate near major avenues.',
      sourceType: 'Ensemble emissions forecast',
      isRecommended: false,
    },
    {
      window: 'Twilight (19:30 – 21:00)',
      rating: 'Moderate',
      ratingColor: 'text-slate-800 bg-slate-100 border-slate-200',
      aqiRange: 'AQI 44 – 48',
      pm25: '10.1 µg/m³',
      temp: '19°C',
      ozone: 'Decreasing rapidly',
      reasoning: 'Traffic winds down, solar radiation ceases, and temperatures cool. Safe for moderate recreation.',
      sourceType: 'Statistical forecast',
      isRecommended: true,
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 z-10 pointer-events-none">
      <div className="max-w-5xl w-full mx-auto pointer-events-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel-subtle text-xs font-semibold text-emerald-800 mb-3">
            <span>Scene 3 · Plan My Day</span>
            <span aria-hidden="true">·</span>
            <span>Park & Greenways</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight text-balance">
            Atmospheric Activity Planning
          </h2>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Discover optimal time windows based on continuous wind dispersal, photochemical ozone, and fine particulates.
          </p>
        </div>

        {/* Interactive Planner Glass Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Configuration Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  1. Select Outdoor Activity
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {activities.map((act) => {
                    const isSelected = selectedActivity === act.id;
                    return (
                      <button
                        key={act.id}
                        onClick={() => setSelectedActivity(act.id)}
                        className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-sky-50/90 border-sky-400 shadow-sm'
                            : 'bg-white/60 border-slate-200/60 hover:bg-white'
                        }`}
                      >
                        <div className="text-xs font-semibold text-slate-900">{act.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{act.intensity}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration and Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Duration
                  </label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full text-xs font-medium bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
                  >
                    <option value="30 min">30 minutes</option>
                    <option value="45 min">45 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2+ hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Target Setting
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full text-xs font-medium bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
                  >
                    <option value="Central Park & Arbor">Central Park & Arbor</option>
                    <option value="Riverside Greenway">Riverside Greenway</option>
                    <option value="Urban Street Loop">Urban Street Loop</option>
                  </select>
                </div>
              </div>

              {/* Environmental Sensitivity Filters */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Personal Environmental Filters
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer p-2 rounded-lg bg-white/40 hover:bg-white/70">
                    <input
                      type="checkbox"
                      checked={preferences.sensitiveLungs}
                      onChange={(e) =>
                        setPreferences({ ...preferences, sensitiveLungs: e.target.checked })
                      }
                      className="rounded text-sky-600 focus:ring-sky-400"
                    />
                    <span>Asthma / Respiratory Sensitivity Protocol</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer p-2 rounded-lg bg-white/40 hover:bg-white/70">
                    <input
                      type="checkbox"
                      checked={preferences.avoidPeakTraffic}
                      onChange={(e) =>
                        setPreferences({ ...preferences, avoidPeakTraffic: e.target.checked })
                      }
                      className="rounded text-sky-600 focus:ring-sky-400"
                    />
                    <span>Avoid Peak Combustion / Commuter Windows</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: "When Should I Go Outside?" Time Slot Comparison */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    When Should I Go Outside? — Slot Comparison
                  </h3>
                </div>
                <span className="text-xs text-slate-500">Updated hourly</span>
              </div>

              <div className="space-y-3">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl border transition-all ${
                      slot.isRecommended
                        ? 'glass-card-interactive bg-white/80 border-slate-200/80'
                        : 'bg-slate-50/60 border-slate-200/50'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{slot.window}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${slot.ratingColor}`}>
                          {slot.rating}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-700">
                        {slot.aqiRange} · {slot.temp}
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {slot.reasoning}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                      <span>PM2.5: <strong className="text-slate-600">{slot.pm25}</strong> · Ozone: <strong className="text-slate-600">{slot.ozone}</strong></span>
                      <span className="italic">{slot.sourceType}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ethical & Medical Transparency Disclaimer */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-start gap-3 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Atmospheric Guidance Disclaimer:</strong> Time recommendations are based on meteorological models and sensor stations. AirAware never guarantees any time or activity is completely pollution-free or medically safe. Consult your physician for personal respiratory guidance.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
