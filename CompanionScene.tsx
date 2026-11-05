import React, { useState } from 'react';
import { UserPreferences, CompanionMessage } from '../../types';
import { askCompanion } from '../../services/api';
import {
  Sparkles,
  Send,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  User,
  Heart,
  Baby,
  Bike
} from 'lucide-react';

interface CompanionSceneProps {
  currentAqi: number;
  pm25: number;
  temp: number;
  location: string;
  onMascotReact: (reaction: 'happy' | 'thinking' | 'idle') => void;
}

export const CompanionScene: React.FC<CompanionSceneProps> = ({
  currentAqi,
  pm25,
  temp,
  location,
  onMascotReact,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    sensitiveLungs: true,
    outdoorExerciser: false,
    hasChildren: false,
    commuter: false,
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<CompanionMessage[]>([
    {
      id: 'init-1',
      sender: 'companion',
      text: `Hello! I'm **Nimbus**, your environmental intelligence companion. Today's ambient air is clear and refreshing (AQI ${currentAqi}). I'm here to translate chemical atmospheric data into thoughtful, transparent decisions for your day. What are your plans?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const presetQuestions = [
    'Is it a good morning for outdoor exercise?',
    'Should I open the windows to air out my home today?',
    'How will traffic affect the afternoon air quality?',
    'What should I be mindful of with sensitive lungs today?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: CompanionMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversation((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    onMascotReact('thinking');

    try {
      const res = await askCompanion(text, preferences, {
        aqi: currentAqi,
        pm25,
        temp,
        location,
      });

      const companionMsg: CompanionMessage = {
        id: `comp-${Date.now()}`,
        sender: 'companion',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversation((prev) => [...prev, companionMsg]);
      onMascotReact('happy');
      setTimeout(() => onMascotReact('idle'), 3000);
    } catch (err) {
      console.error(err);
      onMascotReact('idle');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 z-10 pointer-events-none">
      <div className="max-w-5xl w-full mx-auto pointer-events-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel-subtle text-xs font-semibold text-sky-800 mb-3">
            <span>Scene 5 · Personal AI Companion</span>
            <span aria-hidden="true">·</span>
            <span>Nimbus 3D Assistant</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight text-balance">
            Contextual Intelligence With Honest Reasoning
          </h2>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Ask any environmental question. Nimbus explains what data was used, why it made suggestions, and what uncertainties remain.
          </p>
        </div>

        {/* Companion Interface Glass Box */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: User Profile & Preferences Filter */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Personal Sensitivities
                </span>
                <p className="text-xs text-slate-500 mb-3">
                  Toggle factors that Nimbus should weigh when giving recommendations:
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        sensitiveLungs: !preferences.sensitiveLungs,
                      })
                    }
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      preferences.sensitiveLungs
                        ? 'bg-rose-50/80 border-rose-300 text-rose-900'
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Sensitive Lungs / Asthma</span>
                    </div>
                    <span>{preferences.sensitiveLungs ? 'Active' : 'Off'}</span>
                  </button>

                  <button
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        outdoorExerciser: !preferences.outdoorExerciser,
                      })
                    }
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      preferences.outdoorExerciser
                        ? 'bg-sky-50/80 border-sky-300 text-sky-900'
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Bike className="w-4 h-4 text-sky-500" />
                      <span>Outdoor Runner / Cyclist</span>
                    </div>
                    <span>{preferences.outdoorExerciser ? 'Active' : 'Off'}</span>
                  </button>

                  <button
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        hasChildren: !preferences.hasChildren,
                      })
                    }
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      preferences.hasChildren
                        ? 'bg-amber-50/80 border-amber-300 text-amber-900'
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Baby className="w-4 h-4 text-amber-500" />
                      <span>Young Children / Strollers</span>
                    </div>
                    <span>{preferences.hasChildren ? 'Active' : 'Off'}</span>
                  </button>
                </div>
              </div>

              {/* Strict Medical Boundaries Box */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <ShieldAlert className="w-4 h-4 text-sky-600" />
                  <span>Ethical AI Boundaries</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Nimbus never prescribes treatments, changes medication routines, or diagnoses medical symptoms. Advice is purely environmental intelligence.
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Chat & Structured Explanation */}
            <div className="lg:col-span-8 flex flex-col h-[520px]">
              {/* Message History */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin">
                {conversation.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-400 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-sky-600 text-white rounded-tr-none shadow-sm'
                            : 'glass-panel rounded-tl-none border border-slate-200/80 text-slate-800 shadow-sm whitespace-pre-line'
                        }`}
                      >
                        {msg.text}
                        <div
                          className={`text-[10px] mt-2 text-right ${
                            isUser ? 'text-sky-200' : 'text-slate-400'
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-1">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 shrink-0">
                      <Sparkles className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="p-3.5 rounded-2xl glass-panel text-xs text-slate-600 border border-slate-200">
                      Nimbus is analyzing atmospheric dispersion models...
                    </div>
                  </div>
                )}
              </div>

              {/* Preset Quick Prompts */}
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                  Suggested Questions:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {presetQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      disabled={isLoading}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white/70 hover:bg-white text-slate-700 border border-slate-200/60 transition-all cursor-pointer truncate max-w-full"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="mt-3 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask Nimbus about air quality, outdoor plans, or atmospheric patterns..."
                  disabled={isLoading}
                  className="flex-1 text-xs sm:text-sm bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white transition-all cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
