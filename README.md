<div align="center">

# 🌤️ AirAware AI
### *Your Daily Weather, Air Quality & Health Companion*

> **Breathe Safer. Plan Smarter. Live Healthier.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-AI%20Studio-blue?style=for-the-badge)](https://ai.studio/apps/c1b6f307-2daf-43d9-9a97-411d89236123)
[![Made With AI](https://img.shields.io/badge/Made%20With-Gemini%20AI-purple?style=for-the-badge)](https://ai.google.dev/)
[![Tech](https://img.shields.io/badge/Tech-React%20%2B%20TypeScript-61DAFB?style=for-the-badge)](https://react.dev/)
[![SDG](https://img.shields.io/badge/SDG-3%20Good%20Health-green?style=for-the-badge)](https://sdgs.un.org/goals/goal3)

**🌐 Live Demo • 📂 GitHub Repo • 🤖 AI Powered • 🌱 Eco Friendly**

</div>

---

## 📑 Table of Contents
- [About](#-about-the-project)
- [Problem](#-problem-statement)
- [Features](#-key-features)
- [Demo](#-how-it-looks)
- [Tech Stack](#️-tech-stack)
- [Methodology](#️-methodology--how-it-works)
- [Project Structure](#-project-structure)
- [How to Run](#-how-to-run-locally)
- [Benefit](#-benefit--impact)
- [SDG](#-sdg)
- [Future Scope](#-future-scope)

---

## 📖 About The Project

**AirAware AI** is an AI-powered web app that does what normal weather apps don't do.

Normal apps only tell you: *"Today is 32°C"*

AirAware AI tells you: *"Today is 32°C, but AQI is 310 - Very Poor. Don't go for morning walk. Wear N95 mask. Best time to go out is after 5 PM. Keep windows closed till 12 PM."*

It is made for India, where air pollution is a daily health risk. It combines **Live Weather + Live AQI + Gemini AI** to give you a complete, personalized day plan.

> **One Line:** Weather App + Health Doctor + Eco Friend = AirAware AI

---

## 🎯 Problem Statement

| Problem | Reality in India |
| :--- | :--- |
| We check temperature, not air | Delhi, Palwal, Noida me AQI 300+ common hai |
| AQI numbers are confusing | Logon ko nahi pata 180 AQI ka matlab kya hai |
| Same advice for everyone | 70 saal ke dada ji aur 20 saal ke ladke ko same advice nahi milna chahiye |
| No daily planning | Kab walk kare, kab bahar jaye, kab mask pehne - koi nahi batata |

**Result:** Log bina jaane polluted air me saans lete rehte hai, jisse asthma, allergy, cough, lung problems badhte hai.

---

## ✨ Key Features

### 🌡️ 1. Live Weather Dashboard
- Real-time temperature, feels-like, humidity, wind speed, visibility
- Hourly + 7-day forecast
- Search any city - Delhi, Mumbai, Palwal, London, New York

### 🌫️ 2. Live AQI Monitor
- Real-time Air Quality Index
- Color-coded: 🟢 Good | 🟡 Moderate | 🟠 Poor | 🔴 Very Poor | 🟣 Severe
- PM2.5, PM10, Ozone, NO2 breakdown

### 🩺 3. AI Health Alerts
- Personalized alerts for different people:
    - 👶 Kids - "Aaj bachon ko bahar mat bhejo"
    - 👵 Elderly - "Aaj walk andar hi karo"
    - 😮‍💨 Asthma Patients - "Inhaler saath rakho"
    - 👷 Outdoor Workers - "Mask pehen ke kaam karo"
- Risk Level: Low / Medium / High

### 📅 4. Plan My Day - AI Day Planner
- AI batata hai best time for:
    - 🚶 Morning Walk
    - 🏋️ Workout / Yoga
    - 🚴 Cycling
    - ✈️ Travel
- Indoor activity suggestions on high pollution days

### 🏙️ 5. City Air Scene - Interactive Visual
- Beautiful animated city scene
- Scene ka colour aur hawa AQI ke hisaab se badalta hai
- Pollution ko aankhon se dekhna possible

### 🌱 6. Eco Quests - Gamification
- Daily tasks: "Aaj cycle se jao", "Carpool karo", "Ek ped lagao"
- Points + Streak system
- Leaderboard jaisa feel

### 🤖 7. AI Companion & Smart Notifications
- Friendly AI companion jo dost ki tarah baat karta hai
- AQI badhne pe instant toast notification

---

## 🎬 How It Looks

| Screen | What You See |
| :--- | :--- |
| **Hero Scene** | Welcome screen with live weather + AQI at a glance |
| **City Air Scene** | Animated city with pollution visual |
| **Plan My Day** | AI ka full day plan - kab kya karna hai |
| **Alerts** | Health alerts with colour + severity |
| **Eco Quests** | Daily eco tasks with points |

> **Live Demo Link:** https://ai.studio/apps/c1b6f307-2daf-43d9-9a97-411d89236123

---

## 🛠️ Tech Stack

| Layer | Tools Used |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite |
| **Styling** | Tailwind CSS, Custom CSS, Animations |
| **AI Engine** | Google Gemini AI API |
| **Data APIs** | Weather API, AQI / Air Pollution API |
| **Deployment** | Google AI Studio, GitHub |
| **Version Control** | Git, GitHub |

---

## ⚙️ Methodology / How It Works

```mermaid
User Enters City → Fetch Weather + AQI Data → Clean & Process Data → Send to Gemini AI → AI Analyzes Health Risk → Generate Alerts + Day Plan → Show in Interactive Scenes

Daily-Weather-App/
├── 📄 App.tsx                  - Main App, sab scenes ko connect karta hai
├── 📄 api.ts                  - Weather + AQI API calls
├── 📄 CityAirScene.tsx         - City air visual scene
├── 📄 HeroScene.tsx            - Home / Hero screen
├── 📄 PlanMyDayScene.tsx       - AI Day Planner
├── 📄 EcoQuestsScene.tsx       - Eco Quests + Points
├── 📄 CompanionScene.tsx       - AI Companion
├── 📄 TopBar.tsx               - Top navigation
├── 📄 FloatingDock.tsx        - Bottom navigation dock
├── 📄 ToastNotification.tsx    - Smart notifications
├── 📄 index.css                - Styling
├── 📄 index.html               - Main HTML
├── 📄 vite.config.ts           - Vite config
└── 📄 package.json             - Dependencies

