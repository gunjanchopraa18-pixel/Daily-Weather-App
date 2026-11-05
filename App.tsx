import React, { useState, useEffect, useRef } from 'react';
import { AirAwareWorld } from './components/3d/AirAwareWorld';
import { TopBar } from './components/navigation/TopBar';
import { FloatingDock } from './components/ui/FloatingDock';
import { ToastNotification } from './components/ui/ToastNotification';
import { HeroScene } from './components/scenes/HeroScene';
import { CityAirScene } from './components/scenes/CityAirScene';
import { PlanMyDayScene } from './components/scenes/PlanMyDayScene';
import { CampusAirScene } from './components/scenes/CampusAirScene';
import { CompanionScene } from './components/scenes/CompanionScene';
import { AlertsScene } from './components/scenes/AlertsScene';
import { EcoQuestsScene } from './components/scenes/EcoQuestsScene';
import { BrighterTomorrowScene } from './components/scenes/BrighterTomorrowScene';
import { fetchEnvironmentalData, fallbackEnvironmentalData } from './services/api';
import { EnvironmentalDataset, PollutionAlert } from './types';

export default function App() {
  const [envData, setEnvData] = useState<EnvironmentalDataset>(fallbackEnvironmentalData);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [mascotReaction, setMascotReaction] = useState<'happy' | 'thinking' | 'idle'>('idle');
  const [activeAlertToast, setActiveAlertToast] = useState<PollutionAlert | null>(null);

  const sceneIds = ['sky', 'city', 'plan', 'campus', 'companion', 'alerts', 'quests', 'tomorrow'];

  // Load environmental dataset
  useEffect(() => {
    fetchEnvironmentalData().then((data) => {
      if (data) setEnvData(data);
    });
  }, []);

  // Track scroll position to update current scene index & progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const currentScroll = window.scrollY;
      const progress = Math.min(Math.max(currentScroll / totalHeight, 0), 1);
      setScrollProgress(progress);

      // Determine active scene based on element offsets
      const sections = sceneIds.map((id) => document.getElementById(id));
      const scrollPosition = currentScroll + window.innerHeight * 0.45;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPosition) {
          setCurrentSceneIndex(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSceneFromDock = (index: number) => {
    const targetId = sceneIds[index];
    if (targetId) {
      navigateToSection(targetId);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-900 selection:bg-sky-200 selection:text-sky-900">
      {/* 1. CONTINUOUS ANIMATED 3D WORLD (PERSISTENT CANVAS) */}
      <AirAwareWorld
        currentSceneIndex={currentSceneIndex}
        scrollProgress={scrollProgress}
        mascotReaction={mascotReaction}
      />

      {/* 2. TOP BAR CONTRACT NAVIGATION */}
      <TopBar
        activeSection={sceneIds[currentSceneIndex] || 'sky'}
        onNavigate={navigateToSection}
      />

      {/* 3. TOAST NOTIFICATION FOR REAL-TIME ALERTS */}
      <ToastNotification
        alert={activeAlertToast}
        onClose={() => setActiveAlertToast(null)}
      />

      {/* 4. MAIN SCROLL-DRIVEN SCENES (8 CONNECTED STAGES) */}
      <main className="relative z-10 w-full">
        {/* Scene 1: The Sky */}
        <div id="sky">
          <HeroScene
            aqi={envData.current.aqi}
            condition={envData.current.weather.condition}
            onExploreAir={() => navigateToSection('city')}
            onMeetCompanion={() => navigateToSection('companion')}
          />
        </div>

        {/* Scene 2: The City */}
        <div id="city">
          <CityAirScene
            currentAir={envData.current}
            forecast={envData.hourlyForecast}
            location={envData.location}
            source={envData.source}
            standard={envData.standard}
            dataFreshness={envData.dataFreshness}
          />
        </div>

        {/* Scene 3: Plan My Day */}
        <div id="plan">
          <PlanMyDayScene />
        </div>

        {/* Scene 4: The Campus */}
        <div id="campus">
          <CampusAirScene stations={envData.campusStations} />
        </div>

        {/* Scene 5: The Personal AI Companion */}
        <div id="companion">
          <CompanionScene
            currentAqi={envData.current.aqi}
            pm25={envData.current.pollutants.pm25.value}
            temp={envData.current.weather.temp}
            location={envData.location}
            onMascotReact={(reaction) => setMascotReaction(reaction)}
          />
        </div>

        {/* Scene 6: Pollution Alerts */}
        <div id="alerts">
          <AlertsScene
            onTriggerAlertToast={(alert) => setActiveAlertToast(alert)}
          />
        </div>

        {/* Scene 7: Eco Quests and Rewards */}
        <div id="quests">
          <EcoQuestsScene />
        </div>

        {/* Scene 8: Final Scene — A Brighter Tomorrow */}
        <div id="tomorrow">
          <BrighterTomorrowScene />
        </div>
      </main>

      {/* 5. COLLAPSIBLE BOTTOM FLOATING DOCK */}
      <FloatingDock
        currentSceneIndex={currentSceneIndex}
        onSelectScene={handleSelectSceneFromDock}
        currentAqi={envData.current.aqi}
        dataFreshness={envData.dataFreshness}
      />
    </div>
  );
}
