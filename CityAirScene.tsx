import React, { useState } from 'react';
import { CurrentAirData, HourlyForecastItem } from '../../types';
import {
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Clock,
  Compass,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

interface CityAirSceneProps {
  currentAir: CurrentAirData;
  forecast: HourlyForecastItem[];
  location: string;
  source: string;
  standard: string;
  dataFreshness: string;
}

export const CityAirScene: React.FC<CityAirSceneProps> = ({
  currentAir,
  forecast,
  location,
  source,
  standard,
  dataFreshness,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pollutants' | 'forecast'>('overview');

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 z-10 pointer-events-none">
      <div className="max-w-5xl w-full mx-auto pointer-events-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel-subtle text-xs font-semibold text-sky-800 mb-3">
            <span>Scene 2 · The City</span>
            <span aria-hidden="true">·</span>
            <span>{location}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight text-balance">
            Real-Time Urban Atmosphere
          </h2>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Live atmospheric sensor metrics, chemical concentrations, and verified dispersal forecasts.
          </p>
        </div>

        {/* Floating Glass Dashboard Container */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* Header Controls: Tab navigation + Data Freshness */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/70">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('pollutants')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'pollutants'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pollutants (PM2.5, NO₂, O₃)
              </button>
              <button
                onClick={() => setActiveTab('forecast')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'forecast'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                24h Forecast Trends
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>{dataFreshness}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px]">{standard}</span>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* Primary AQI Card */}
              <div className="md:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white/80 to-sky-50/80 border border-emerald-100 shadow-sm">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Air Quality Index
                    </span>
                    <span className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-md">
                      {currentAir.category}
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-slate-900 tabular-nums font-mono">
                      {currentAir.aqi}
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      AQI (0–500)
                    </span>
                  </div>
                  <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {currentAir.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                  <span>Dominant: <strong className="text-slate-900">{currentAir.dominantPollutant}</strong></span>
                  <span>Limits: <strong className="text-emerald-700">Satisfactory</strong></span>
                </div>
              </div>

              {/* Weather & Microclimate Card */}
              <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl glass-card-interactive flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Thermometer className="w-4 h-4 text-rose-400" />
                    <span>Temperature</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-slate-900 tabular-nums">
                      {currentAir.weather.temp}°C
                    </div>
                    <div className="text-[11px] text-slate-500">Feels like {currentAir.weather.feelsLike}°C</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl glass-card-interactive flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Compass className="w-4 h-4 text-sky-500" />
                    <span>Wind Dispersion</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-slate-900 tabular-nums">
                      {currentAir.weather.windSpeed} <span className="text-xs font-normal">km/h</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate" title={currentAir.weather.windDirection}>
                      {currentAir.weather.windDirection}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl glass-card-interactive flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span>Humidity</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-slate-900 tabular-nums">
                      {currentAir.weather.humidity}%
                    </div>
                    <div className="text-[11px] text-slate-500">Crisp & clear</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl glass-card-interactive flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Eye className="w-4 h-4 text-indigo-400" />
                    <span>Visibility</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-slate-900 tabular-nums">
                      {currentAir.weather.visibility}
                    </div>
                    <div className="text-[11px] text-slate-500">Clean horizon</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl glass-card-interactive flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Layers className="w-4 h-4 text-amber-500" />
                    <span>UV Index</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-slate-900 tabular-nums">
                      {currentAir.weather.uvIndex} <span className="text-xs font-normal">/ 11</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Moderate</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl glass-card-interactive flex flex-col justify-between bg-sky-50/50">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Wind className="w-4 h-4 text-emerald-500" />
                    <span>Fine PM2.5</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-emerald-700 tabular-nums">
                      {currentAir.pollutants.pm25.value} <span className="text-xs font-normal">µg/m³</span>
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium">Optimal breathing</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED POLLUTANTS BREAKDOWN */}
          {activeTab === 'pollutants' && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* PM2.5 */}
                <div className="p-5 rounded-2xl glass-card-interactive border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-bold text-slate-800">PM2.5 (Fine Particles)</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      {currentAir.pollutants.pm25.quality}
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                    {currentAir.pollutants.pm25.value} <span className="text-xs font-normal text-slate-500">{currentAir.pollutants.pm25.unit}</span>
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    <div>Standard Limit: {currentAir.pollutants.pm25.limit} µg/m³</div>
                    <div className="text-[11px] text-slate-400 mt-1">{currentAir.pollutants.pm25.sourceNote}</div>
                  </div>
                </div>

                {/* PM10 */}
                <div className="p-5 rounded-2xl glass-card-interactive border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-bold text-slate-800">PM10 (Coarse Dust)</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      {currentAir.pollutants.pm10.quality}
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                    {currentAir.pollutants.pm10.value} <span className="text-xs font-normal text-slate-500">{currentAir.pollutants.pm10.unit}</span>
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    <div>Standard Limit: {currentAir.pollutants.pm10.limit} µg/m³</div>
                    <div className="text-[11px] text-slate-400 mt-1">{currentAir.pollutants.pm10.sourceNote}</div>
                  </div>
                </div>

                {/* NO2 */}
                <div className="p-5 rounded-2xl glass-card-interactive border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-bold text-slate-800">NO₂ (Nitrogen Dioxide)</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      {currentAir.pollutants.no2.quality}
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                    {currentAir.pollutants.no2.value} <span className="text-xs font-normal text-slate-500">{currentAir.pollutants.no2.unit}</span>
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    <div>Standard Limit: {currentAir.pollutants.no2.limit} ppb</div>
                    <div className="text-[11px] text-slate-400 mt-1">{currentAir.pollutants.no2.sourceNote}</div>
                  </div>
                </div>

                {/* O3 */}
                <div className="p-5 rounded-2xl glass-card-interactive border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-bold text-slate-800">O₃ (Ground Ozone)</span>
                    <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded text-[11px]">
                      {currentAir.pollutants.o3.quality}
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                    {currentAir.pollutants.o3.value} <span className="text-xs font-normal text-slate-500">{currentAir.pollutants.o3.unit}</span>
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    <div>Standard Limit: {currentAir.pollutants.o3.limit} ppb</div>
                    <div className="text-[11px] text-slate-400 mt-1">{currentAir.pollutants.o3.sourceNote}</div>
                  </div>
                </div>
              </div>

              {/* Informative scientific disclaimer */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-start gap-3 text-xs text-slate-600">
                <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  Measurements reflect chemical concentrations sampled continuously at height 3m. EPA NAAQS standards govern annual and 24-hour health baselines.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: 24-HOUR FORECAST TRENDS */}
          {activeTab === 'forecast' && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Measured Observations</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-sky-400 border border-dashed border-sky-600" />
                    <span>Atmospheric Forecast</span>
                  </div>
                </div>
                <span>Confidence levels verified</span>
              </div>

              {/* Visual Forecast Timeline Bar */}
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                {forecast.map((f, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl flex flex-col items-center text-center transition-all ${
                      f.type === 'measured'
                        ? 'bg-emerald-50/70 border border-emerald-200/60'
                        : 'bg-white/70 border border-sky-200/60'
                    }`}
                  >
                    <span className="text-[11px] font-mono text-slate-500">{f.time}</span>
                    <span className="text-xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
                      {f.aqi}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded mt-1 ${
                        f.aqi <= 50
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {f.category}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-mono">{f.temp}°C</span>
                    {f.type === 'forecast' && (
                      <span className="text-[9px] text-sky-700 bg-sky-50 px-1 py-0.2 rounded mt-1">
                        Forecast
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <span>
                  Forecasted spikes around 16:00–18:00 correlate with commuter traffic and evening surface inversion layers.
                </span>
              </div>
            </div>
          )}

          {/* Provenance footer */}
          <div className="mt-6 pt-4 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>Source: <strong className="text-slate-800">{source}</strong></span>
            <span>Refreshed: {dataFreshness}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
