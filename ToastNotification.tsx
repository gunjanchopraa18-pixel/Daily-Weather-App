import React, { useEffect } from 'react';
import { PollutionAlert } from '../../types';
import { BellRing, X, TrendingUp, Clock, TrendingDown, Radio } from 'lucide-react';

interface ToastNotificationProps {
  alert: PollutionAlert | null;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ alert, onClose }) => {
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [alert, onClose]);

  if (!alert) return null;

  return (
    <div className="fixed top-20 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div className="glass-panel rounded-2xl p-4 shadow-2xl border border-white flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 shrink-0 mt-0.5">
          {alert.type === 'increase' && <TrendingUp className="w-4 h-4 text-rose-600" />}
          {alert.type === 'forecast_deterioration' && <Clock className="w-4 h-4 text-amber-600" />}
          {alert.type === 'improvement' && <TrendingDown className="w-4 h-4 text-emerald-600" />}
          {alert.type === 'outdated_sensor' && <Radio className="w-4 h-4 text-sky-600" />}
        </div>

        <div className="flex-1 pr-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {alert.isForecast ? 'Forecast Alert' : 'Observed Alert'}
            </span>
            <span className="text-xs font-mono font-bold text-slate-800">
              {alert.aqiChange}
            </span>
          </div>

          <h4 className="text-xs font-bold text-slate-900 mt-0.5">
            {alert.title}
          </h4>

          <p className="text-[11px] text-slate-600 mt-1 leading-snug">
            {alert.description}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
