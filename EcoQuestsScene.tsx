import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { EcoQuest, RewardItem } from '../../types';
import {
  Sprout,
  Award,
  UploadCloud,
  CheckCircle2,
  Clock,
  Gift,
  TreePine,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const EcoQuestsScene: React.FC = () => {
  const [userPoints, setUserPoints] = useState<number>(340);
  const [selectedQuestForEvidence, setSelectedQuestForEvidence] = useState<EcoQuest | null>(null);
  const [evidenceNote, setEvidenceNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'quests' | 'rewards'>('quests');

  // Weekly Quests
  const [quests, setQuests] = useState<EcoQuest[]>([
    {
      id: 'quest-1',
      title: 'Zero-Emission Commute Sprint',
      description: 'Opt for walking, bicycling, or clean electric rail on 3 daily trips instead of solo automobile transit.',
      points: 120,
      category: 'transit',
      progress: 66,
      targetCount: 3,
      currentCount: 2,
      unit: 'trips',
      status: 'active',
    },
    {
      id: 'quest-2',
      title: 'Urban Canopy Hydration',
      description: 'Water and mulch 2 young neighborhood street trees during morning hours to boost urban particulate absorption.',
      points: 90,
      category: 'nature',
      progress: 100,
      targetCount: 2,
      currentCount: 2,
      unit: 'trees',
      status: 'completed',
      evidenceSubmitted: {
        date: 'Yesterday',
        note: 'Watered two young oaks by the campus bus turnaround.',
        status: 'approved',
      },
    },
    {
      id: 'quest-3',
      title: 'Window Air Sweep Routine',
      description: 'Air out your home exclusively during low-particulate hours (06:00 – 08:30) verified on AirAware.',
      points: 75,
      category: 'energy',
      progress: 33,
      targetCount: 3,
      currentCount: 1,
      unit: 'days',
      status: 'active',
    },
    {
      id: 'quest-4',
      title: 'Micro-Park Cleanup & Litter Sort',
      description: 'Collect and sort recyclable plastic bottles and debris in your local park pathway to prevent micro-dust decomposition.',
      points: 110,
      category: 'community',
      progress: 0,
      targetCount: 1,
      currentCount: 0,
      unit: 'session',
      status: 'active',
    },
  ]);

  // Rewards catalog
  const [rewards, setRewards] = useState<RewardItem[]>([
    {
      id: 'rew-1',
      name: 'Plant a Native Pine via Arbor Day',
      cost: 250,
      icon: '🌲',
      description: 'A verified native sapling planted in a designated regional reforestation preserve.',
      redeemed: false,
    },
    {
      id: 'rew-2',
      name: 'AirAware Thermal Bamboo Flask',
      cost: 400,
      icon: '💧',
      description: 'Durable reusable double-wall insulated flask to eliminate single-use plastics.',
      redeemed: false,
    },
    {
      id: 'rew-3',
      name: 'Solar-Powered Miniature Lantern',
      cost: 500,
      icon: '☀️',
      description: 'Compact garden and patio solar charger lantern.',
      redeemed: false,
    },
    {
      id: 'rew-4',
      name: 'Community Clean Air Steward Badge',
      cost: 150,
      icon: '🏅',
      description: 'Verified digital badge certifying 30 days of active emission mitigation.',
      redeemed: true,
    },
  ]);

  // Evidence submission handler (Instant prototype with simulation review)
  const handleSubmitEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestForEvidence || !evidenceNote.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Simulate verification approval
      setQuests((prev) =>
        prev.map((q) => {
          if (q.id === selectedQuestForEvidence.id) {
            return {
              ...q,
              progress: 100,
              currentCount: q.targetCount,
              status: 'completed',
              evidenceSubmitted: {
                date: 'Just now',
                note: evidenceNote,
                status: 'approved',
              },
            };
          }
          return q;
        })
      );

      setUserPoints((prev) => prev + selectedQuestForEvidence.points);
      setIsSubmitting(false);
      setSelectedQuestForEvidence(null);
      setEvidenceNote('');

      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38BDF8', '#818CF8', '#F472B6', '#34D399', '#FBBF24'],
        });
      } catch (err) {
        // Safe fallback
      }
    }, 1000);
  };

  const handleRedeemReward = (reward: RewardItem) => {
    if (userPoints < reward.cost || reward.redeemed) return;
    setUserPoints((prev) => prev - reward.cost);
    setRewards((prev) =>
      prev.map((r) => (r.id === reward.id ? { ...r, redeemed: true } : r))
    );
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (err) {}
  };

  // Seedling growth level based on completed quests
  const completedCount = quests.filter((q) => q.status === 'completed').length;
  const growthStage = completedCount >= 3 ? 'Thriving Leaf Canopy' : completedCount >= 1 ? 'Healthy Sprout' : 'Germinating Seed';

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 z-10 pointer-events-none">
      <div className="max-w-5xl w-full mx-auto pointer-events-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel-subtle text-xs font-semibold text-emerald-800 mb-3">
            <span>Scene 7 · Eco Quests & Rewards</span>
            <span aria-hidden="true">·</span>
            <span>The Pastel Garden</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight text-balance">
            Nurture Local Skies, Grow Real Impact
          </h2>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Participate in actionable weekly sustainability quests, submit evidence, and redeem environmental rewards.
          </p>
        </div>

        {/* Main Floating Glass Container */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* Header Bar: Points & Stage + Tab Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/70">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
              <button
                onClick={() => setActiveTab('quests')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'quests'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Weekly Quests ({quests.length})
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'rewards'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rewards Catalogue
              </button>
            </div>

            {/* User points balance & Growth state */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <div className="text-xs">
                  <span className="text-slate-500">Garden State: </span>
                  <strong className="text-emerald-800">{growthStage}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold font-mono text-amber-900 tabular-nums">
                  {userPoints} pts
                </span>
              </div>
            </div>
          </div>

          {/* TAB 1: QUESTS LIST */}
          {activeTab === 'quests' && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quests.map((quest) => {
                  const isCompleted = quest.status === 'completed';
                  return (
                    <div
                      key={quest.id}
                      className="p-5 rounded-2xl glass-card-interactive border border-slate-200/80 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {quest.title}
                          </h4>
                          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                            +{quest.points} pts
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                          {quest.description}
                        </p>
                      </div>

                      <div>
                        {/* Progress Bar */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-mono">
                          <span>
                            Progress: {quest.currentCount} / {quest.targetCount} {quest.unit}
                          </span>
                          <span>{quest.progress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${quest.progress}%` }}
                          />
                        </div>

                        {/* Status / Submit Evidence Button */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          {isCompleted ? (
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Completed · Evidence Approved</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedQuestForEvidence(quest)}
                              className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
                            >
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Submit Quest Evidence &rarr;</span>
                            </button>
                          )}
                          <span className="text-[11px] text-slate-400 capitalize">
                            {quest.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: REWARDS CATALOGUE */}
          {activeTab === 'rewards' && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {rewards.map((rew) => {
                  const canRedeem = userPoints >= rew.cost && !rew.redeemed;
                  return (
                    <div
                      key={rew.id}
                      className="p-5 rounded-2xl glass-card-interactive border border-slate-200/80 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-3xl mb-3">{rew.icon}</div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">
                          {rew.name}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {rew.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-800">
                          {rew.cost} pts
                        </span>

                        <button
                          onClick={() => handleRedeemReward(rew)}
                          disabled={!canRedeem}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                            rew.redeemed
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : canRedeem
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {rew.redeemed ? 'Redeemed' : 'Claim Reward'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Prototype Note:</strong> Rewards catalogue demonstrates simulated impact partnerships. Tree plantings and eco gear certificates reflect genuine community offset benchmarks.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* EVIDENCE SUBMISSION MODAL */}
        {selectedQuestForEvidence && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm pointer-events-auto">
            <div className="max-w-md w-full glass-panel rounded-3xl p-6 shadow-2xl border border-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  Submit Evidence
                </h3>
                <button
                  onClick={() => setSelectedQuestForEvidence(null)}
                  className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmitEvidence} className="mt-4 space-y-4">
                <div>
                  <div className="text-xs font-bold text-slate-700">Quest Selected</div>
                  <div className="text-sm font-semibold text-sky-800 mt-0.5">
                    {selectedQuestForEvidence.title}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Activity Reflection or Sensor Notes
                  </label>
                  <textarea
                    rows={3}
                    value={evidenceNote}
                    onChange={(e) => setEvidenceNote(e.target.value)}
                    placeholder="e.g. Cycled 8km via Riverside Greenway avoiding highway traffic; recorded crisp morning air."
                    required
                    className="w-full text-xs p-3 rounded-xl bg-white/90 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center">
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <div className="text-xs text-slate-600 font-medium">Photo Verification (Simulated)</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Click to simulate timestamped camera upload</div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedQuestForEvidence(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !evidenceNote.trim()}
                    className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Verifying...' : 'Submit & Claim Points'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
