import React, { useState } from 'react';
import { PollutionAlert } from '../../types';
import {
  BellRing,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Radio,
  Sliders,
  CheckCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

interface AlertsSceneProps {
  onTriggerAlertToast: (alert: PollutionAlert) => void;
}

export const AlertsScene: React.FC<AlertsSceneProps> = ({ onTriggerAlertToast }) => {
  const [thresholdAqi, setThresholdAqi] = useState<number>(55);
  const [notifyMethod, setNotifyMethod] = useState({
    push: true,
    email: false,
    sms: false,
  });
  const [quietHours, setQuietHours] = useState(true);

  // Prototype environmental alerts
  const sampleAlerts: PollutionAlert[] = [
    {
      id: 'alert-1',
      title: 'Meaningful Increase in PM2.5 Observed',
      type: 'increase',
      aqiChange: '+18 AQI',
      description: 'North Highway monitoring node recorded a sharp rise in fine particulates from 8.2 µg/m³ to 21.4 µg/m³ over the past 45 minutes due to dense diesel freight transit.',
      timestamp: '25 min ago',
      severity: 'warning',
      isForecast: false,
    },
    {
      id: 'alert-2',
      title: 'Forecasted Evening Deterioration',
      type: 'forecast_deterioration',
      aqiChange: 'Expected Peak: 64 AQI',
      description: 'Atmospheric boundary layer is projected to descend at 17:30, trapping local vehicle emissions. Sensitive individuals should plan outdoor exercise before 16:00.',
      timestamp: 'Forecast for 17:30 today',
      severity: 'warning',
      isForecast: true,
    },
    {
      id: 'alert-3',
      title: 'Atmospheric Clearing Front Arrived',
      type: 'improvement',
      aqiChange: '-14 AQI',
      description: 'Northwesterly mountain breeze has cleared the central valley canopy. Current ambient AQI improved to 38 (Good). Excellent time for outdoor recreation.',
      timestamp: '1 hour ago',
      severity: 'positive',
      isForecast: false,
    },
    {
      id: 'alert-4',
      title: 'Sensor Calibration Offline Warning',
      type: 'outdated_sensor',
      aqiChange: 'Stale Data Flag',
      description: 'West Suburb Optical Station #4 is undergoing quarterly zero-point laser recalibration. Readings in that sector are using regional satellite interpolation until 15:00.',
      timestamp: 'Ongoing maintenance',
      severity: 'info',
      isForecast: false,
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 z-10 pointer-events-none">
      <div className="max-w-5xl w-full mx-auto pointer-events-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel-subtle text-xs font-semibold text-rose-800 mb-3">
            <span>Scene 6 · Pollution Alerts</span>
            <span aria-hidden="true">·</span>
            <span>Early Warning System</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight text-balance">
            Atmospheric Drift & Threshold Alerts
          </h2>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Transparent distinction between real observed spikes, meteorological forecasts, and sensor telemetry status.
          </p>
        </div>

        {/* Main Floating Glass Container */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Notification Stream */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Active Alert Scenarios (Simulation)
                </span>
                <span className="text-[11px] text-slate-500">
                  Click any card to preview real toast notification
                </span>
              </div>

              <div className="space-y-3">
                {sampleAlerts.map((alert) => {
                  return (
                    <div
                      key={alert.id}
                      onClick={() => onTriggerAlertToast(alert)}
                      className="p-4 rounded-2xl glass-card-interactive cursor-pointer border border-slate-200/80 group"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {alert.type === 'increase' && (
                            <TrendingUp className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                          {alert.type === 'forecast_deterioration' && (
                            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                          {alert.type === 'improvement' && (
                            <TrendingDown className="w-4 h-4 text-emerald-500 shrink-0" />
                          )}
                          {alert.type === 'outdated_sensor' && (
                            <Radio className="w-4 h-4 text-sky-500 shrink-0" />
                          )}
                          <span className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                            {alert.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              alert.isForecast
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {alert.isForecast ? 'Forecasted' : 'Observed'}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-800">
                            {alert.aqiChange}
                          </span>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        {alert.description}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{alert.timestamp}</span>
                        <span className="text-sky-600 font-medium group-hover:underline">
                          Test Notification &rarr;
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Alert Configuration & Sensitivity Controls */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white/70 border border-slate-200/80 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Alert Sensitivity Threshold
                  </span>
                  <span className="text-xs font-mono font-bold text-sky-700">
                    AQI &gt; {thresholdAqi}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 mb-3">
                  Trigger alerts whenever ambient conditions cross this value:
                </p>

                <input
                  type="range"
                  min="30"
                  max="100"
                  value={thresholdAqi}
                  onChange={(e) => setThresholdAqi(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>30 (Strict)</span>
                  <span>50 (Moderate)</span>
                  <span>100 (Unhealthy)</span>
                </div>
              </div>

              {/* Delivery Channels */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Delivery Channels (Prototype)
                </span>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 cursor-pointer">
                    <span>In-App Spatial Toasts</span>
                    <input
                      type="checkbox"
                      checked={notifyMethod.push}
                      onChange={(e) =>
                        setNotifyMethod({ ...notifyMethod, push: e.target.checked })
                      }
                      className="rounded text-sky-600 focus:ring-sky-400"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 cursor-pointer">
                    <span>Morning Clean Air Digest (Email)</span>
                    <input
                      type="checkbox"
                      checked={notifyMethod.email}
                      onChange={(e) =>
                        setNotifyMethod({ ...notifyMethod, email: e.target.checked })
                      }
                      className="rounded text-sky-600 focus:ring-sky-400"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 cursor-pointer">
                    <span>Respect Quiet Hours (22:00 – 07:00)</span>
                    <input
                      type="checkbox"
                      checked={quietHours}
                      onChange={(e) => setQuietHours(e.target.checked)}
                      className="rounded text-sky-600 focus:ring-sky-400"
                    />
                  </label>
                </div>
              </div>

              {/* Honest Prototype Notice */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Interactive Prototype:</strong> Background device push is simulated here in-browser. All settings update your local simulation state immediately.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
