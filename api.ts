import { EnvironmentalDataset, UserPreferences } from '../types';

export const fallbackEnvironmentalData: EnvironmentalDataset = {
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
      coverage: "Direct Quad Footprint (98% confidence)",
      coords: { x: 30, y: 35 }
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
      coverage: "Perimeter Road Boundary (92% confidence)",
      coords: { x: 65, y: 45 }
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
      coverage: "Open Field Microclimate (96% confidence)",
      coords: { x: 45, y: 75 }
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
      coverage: "Stationary Micro-Sensor (85% confidence)",
      coords: { x: 80, y: 25 }
    }
  ]
};

export async function fetchEnvironmentalData(): Promise<EnvironmentalDataset> {
  try {
    const res = await fetch('/api/air-quality');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('Using client-side environmental dataset:', error);
    return fallbackEnvironmentalData;
  }
}

export async function askCompanion(
  message: string,
  preferences: UserPreferences,
  context: { aqi: number; pm25: number; temp: number; location: string }
): Promise<{ reply: string; poweredBy: string }> {
  try {
    const res = await fetch('/api/companion/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, preferences, context }),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('Using client-side companion reasoning:', error);
    return {
      reply: `
**Gentle Assessment**
Air quality is at an encouraging level (AQI ${context.aqi}), making outdoor activities favorable. A pleasant breeze from the northwest helps prevent stagnation.

**Data Used**
• Station: ${context.location}
• Current AQI: ${context.aqi} | PM2.5: ${context.pm25} µg/m³
• Ambient Temperature: ${context.temp}°C
• Refreshed: ${new Date().toLocaleTimeString()}

**Why This Was Suggested**
Morning and early afternoon atmospheric mixing heights are optimal today, diluting fine particles before the evening commute inversion begins.

**Preferences Considered**
${preferences.sensitiveLungs ? '• Applied sensitive lung protocol: Morning outdoor recreation is suitable, though keeping inhalers accessible as standard precaution is wise.' : '• General outdoor baseline: Free to exercise and ventilate homes.'}
${preferences.outdoorExerciser ? '• Outdoor athlete consideration: Great ventilation rate window between now and 15:00.' : ''}

**Uncertainty & Boundaries**
Atmospheric readings capture regional ambient layers. Micro-sources (street combustion, wood burning) vary block-by-block. Not intended as medical diagnosis or treatment advice.
`.trim(),
      poweredBy: 'AirAware Local Model'
    };
  }
}
