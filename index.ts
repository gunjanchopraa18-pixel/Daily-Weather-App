export type AqiCategory = 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';

export interface PollutantDetail {
  value: number;
  unit: string;
  limit: number;
  quality: string;
  sourceNote: string;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  uvIndex: number;
  visibility: string;
}

export interface CurrentAirData {
  aqi: number;
  category: AqiCategory;
  categoryColor: string;
  dominantPollutant: string;
  summary: string;
  pollutants: {
    pm25: PollutantDetail;
    pm10: PollutantDetail;
    no2: PollutantDetail;
    o3: PollutantDetail;
    co: PollutantDetail;
  };
  weather: WeatherData;
}

export interface HourlyForecastItem {
  time: string;
  aqi: number;
  temp: number;
  category: AqiCategory;
  pm25: number;
  type: 'measured' | 'forecast';
  confidence?: string;
}

export interface CampusStation {
  id: string;
  name: string;
  aqi: number;
  category: AqiCategory;
  pm25: number;
  distance: string;
  status: string;
  hardware: string;
  coverage: string;
  coords?: { x: number; y: number };
}

export interface EnvironmentalDataset {
  location: string;
  timestamp: string;
  dataFreshness: string;
  source: string;
  standard: string;
  current: CurrentAirData;
  hourlyForecast: HourlyForecastItem[];
  campusStations: CampusStation[];
}

export interface UserPreferences {
  sensitiveLungs: boolean;
  outdoorExerciser: boolean;
  hasChildren: boolean;
  commuter: boolean;
}

export interface CompanionMessage {
  id: string;
  sender: 'user' | 'companion';
  text: string;
  timestamp: string;
  structuredData?: {
    assessment: string;
    dataUsed: string[];
    reasoning: string;
    preferencesApplied: string[];
    uncertainties: string[];
  };
}

export interface PollutionAlert {
  id: string;
  title: string;
  type: 'increase' | 'forecast_deterioration' | 'improvement' | 'outdated_sensor';
  aqiChange: string;
  description: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'positive';
  isForecast: boolean;
}

export interface EcoQuest {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'transit' | 'nature' | 'energy' | 'community';
  progress: number; // 0 to 100
  targetCount: number;
  currentCount: number;
  unit: string;
  status: 'active' | 'completed' | 'pending_verification';
  evidenceSubmitted?: {
    date: string;
    note: string;
    status: 'approved' | 'pending' | 'rejected';
  };
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number;
  icon: string;
  description: string;
  redeemed: boolean;
}
