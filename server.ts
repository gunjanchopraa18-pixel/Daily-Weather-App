import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI if key is present
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Mock / High-fidelity environmental dataset
const mockEnvironmentalData = {
  location: "Metropolis Green District",
  timestamp: new Date().toISOString(),
  dataFreshness: "Updated 4 minutes ago",
  source: "Regional EPA CleanAir Network & CAMS Atmospheric Ensemble",
  standard: "US EPA AQI Standard (2026 revisions)",
  current: {
    aqi: 38,
    category: "Good",
    categoryColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    dominantPollutant: "PM2.5",
    summary: "Air quality is considered satisfactory, and air pollution poses little or no risk.",
    pollutants: {
      pm25: { value: 8.6, unit: "µg/m³", limit: 35, quality: "Optimal", sourceNote: "Optical particle counter" },
      pm10: { value: 16.4, unit: "µg/m³", limit: 50, quality: "Good", sourceNote: "Continuous mass sensor" },
      no2: { value: 12.1, unit: "ppb", limit: 53, quality: "Low", sourceNote: "Chemiluminescence analyzer" },
      o3: { value: 26.8, unit: "ppb", limit: 70, quality: "Mild", sourceNote: "UV photometric photometer" },
      co: { value: 0.4, unit: "ppm", limit: 9.0, quality: "Trace", sourceNote: "NDIR infrared" }
    },
    weather: {
      temp: 21,
      feelsLike: 20,
      condition: "Clear Pastel Skies",
      humidity: 46,
      windSpeed: 11,
      windDirection: "NW (Breeze clearing particulates)",
      uvIndex: 3,
      visibility: "16 km"
    }
  },
  hourlyForecast: [
    { time: "06:00", aqi: 28, temp: 16, category: "Good", pm25: 6.2, type: "measured" },
    { time: "08:00", aqi: 45, temp: 18, category: "Good", pm25: 10.1, type: "measured" },
    { time: "10:00", aqi: 41, temp: 20, category: "Good", pm25: 9.3, type: "measured" },
    { time: "12:00", aqi: 38, temp: 22, category: "Good", pm25: 8.6, type: "measured" },
    { time: "14:00", aqi: 42, temp: 23, category: "Good", pm25: 9.5, type: "forecast", confidence: "High (Atmospheric dispersion active)" },
    { time: "16:00", aqi: 52, temp: 22, category: "Moderate", pm25: 12.8, type: "forecast", confidence: "Moderate (Commute peak accumulation)" },
    { time: "18:00", aqi: 58, temp: 21, category: "Moderate", pm25: 14.5, type: "forecast", confidence: "Moderate (Evening traffic + thermal inversion)" },
    { time: "20:00", aqi: 46, temp: 19, category: "Good", pm25: 10.4, type: "forecast", confidence: "High" },
    { time: "22:00", aqi: 36, temp: 18, category: "Good", pm25: 7.9, type: "forecast", confidence: "High" }
  ],
  campusStations: [
    {
      id: "station-campus-north",
      name: "North Quad & Library Arbor",
      aqi: 32,
      category: "Good",
      pm25: 7.1,
      distance: "0.2 km from main hall",
      status: "Active · Calibrated 2h ago",
      hardware: "Reference-Grade BAM-1020",
      coverage: "Direct Quad Footprint (98% confidence)"
    },
    {
      id: "station-campus-stem",
      name: "Science & Engineering Concourse",
      aqi: 39,
      category: "Good",
      pm25: 8.9,
      distance: "0.6 km",
      status: "Active · Calibrated 4h ago",
      hardware: "Laser Optical Particle Monitor",
      coverage: "Perimeter Road Boundary (92% confidence)"
    },
    {
      id: "station-campus-athletics",
      name: "Riverside Athletic Oval & Courts",
      aqi: 29,
      category: "Good",
      pm25: 6.4,
      distance: "1.1 km",
      status: "Active · Calibrated today",
      hardware: "Dual-Channel Beta Attenuation",
      coverage: "Open Field Microclimate (96% confidence)"
    },
    {
      id: "station-campus-dorms",
      name: "Meadowland Student Residences",
      aqi: 35,
      category: "Good",
      pm25: 7.8,
      distance: "1.4 km",
      status: "Active · Calibrated yesterday",
      hardware: "Low-Cost Node with Local Correction",
      coverage: "Stationary Micro-Sensor (85% confidence)"
    }
  ]
};

// API: Air Quality details
app.get('/api/air-quality', (_req, res) => {
  res.json({
    ...mockEnvironmentalData,
    timestamp: new Date().toISOString()
  });
});

// API: AI Companion endpoint powered by Gemini 3.8 Flash
app.post('/api/companion/chat', async (req, res) => {
  const { message, preferences = {}, context = {} } = req.body;

  const currentAqi = context.aqi ?? 38;
  const pm25 = context.pm25 ?? 8.6;
  const temp = context.temp ?? 21;
  const location = context.location ?? "Metropolis Green District";

  const sensitivities = [];
  if (preferences.sensitiveLungs) sensitivities.push("Respiratory Sensitivity / Asthma Awareness");
  if (preferences.outdoorExerciser) sensitivities.push("High-Ventilation Outdoor Athlete");
  if (preferences.hasChildren) sensitivities.push("Protecting Young Children / Stroller Walks");
  if (preferences.commuter) sensitivities.push("Active Urban Transit / Cyclist");

  const systemInstruction = `
You are "Nimbus", the friendly, intelligent, and scientifically grounded 3D cloud companion for AirAware AI.
Your personality is gentle, warm, reassuring, and precise.

CRITICAL ETHICAL & MEDICAL BOUNDARIES:
- You are an environmental guide, NOT a medical doctor.
- NEVER provide medical diagnoses, prescribe treatments, or suggest changing prescription medication or inhaler dosages.
- NEVER claim that any outdoor air is "100% pollution-free" or "guaranteed safe".
- Always clearly disclose your sources, reasoning, preferences considered, and uncertainties.

RESPONSE FORMAT REQUIREMENTS:
Always structure your response with these exact sections in a clean, natural conversational manner:
1. "Gentle Assessment": Empathetic and concise guidance answering the user's question.
2. "Data Used": State specific metrics (AQI ${currentAqi}, PM2.5: ${pm25} µg/m³, Temp: ${temp}°C) and timestamp.
3. "Why This Was Suggested": Explicit environmental reasoning (e.g. wind dispersing particulate, midday ozone trends).
4. "Preferences Considered": How the user's sensitivities (${sensitivities.length > 0 ? sensitivities.join(', ') : 'General public guidelines'}) modified the advice.
5. "Uncertainty & Boundaries": Clear statement of what cannot be guaranteed (e.g. localized woodsmoke, sudden traffic bursts, individual biological variance).
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `User message: "${message || 'How does the air look for outdoor plans today?'}"
Context: Location ${location}, Current AQI ${currentAqi}, PM2.5 ${pm25} µg/m³, Temp ${temp}°C, Time: ${new Date().toLocaleTimeString()}.
User preferences: ${sensitivities.join(', ') || 'Standard profile'}.`,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text,
        timestamp: new Date().toISOString(),
        poweredBy: "Gemini 3.8 Flash",
        status: "success"
      });
    } catch (err: any) {
      console.error("Gemini API error, using structured environmental fallback:", err?.message);
    }
  }

  // Graceful, transparent fallback if Gemini API is offline or key not provided
  const fallbackReply = `
**Gentle Assessment**
The air is pleasantly crisp and well within the "Good" range right now (AQI ${currentAqi}). It's an inviting window for walking through the park, light stretching, or bicycling.

**Data Used**
• EPA AQI: ${currentAqi} (Category: Good)
• PM2.5: ${pm25} µg/m³
• Temperature: ${temp}°C with NW gentle clearing breeze
• Timestamp: ${new Date().toLocaleTimeString()} (Freshness: 4m ago)

**Why This Was Suggested**
The persistent northwestern breeze continues to disperse particulate matter across the valley. Current fine particulate levels are under 10 µg/m³, which means healthy lungs will encounter negligible atmospheric friction today.

**Preferences Considered**
${sensitivities.length > 0
  ? `Adapted for ${sensitivities.join(' and ')}: Even with sensitivity, this morning offers the lowest ambient exposure. If heading near high-traffic arterial roads, opt for green interior paths.`
  : `Applied General Population Baseline: Favorable for all outdoor recreation and open-window ventilation.`}

**Uncertainties & Boundaries**
• Readings represent neighborhood ambient air; hyper-local microclimates (like idling diesel buses or outdoor grills) cannot be measured remotely.
• This is environmental intelligence, not clinical medical advice. Listen to your body and follow personal physician guidelines if symptoms occur.
`.trim();

  res.json({
    reply: fallbackReply,
    timestamp: new Date().toISOString(),
    poweredBy: "AirAware Environmental Intelligence",
    status: "fallback"
  });
});

// Setup Vite in development or static serve in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`AirAware AI server running at http://localhost:${port}`);
  });
}

startServer();
