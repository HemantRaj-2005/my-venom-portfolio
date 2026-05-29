export interface PlatformConnectionStatus {
  platform: string;
  connected: boolean;
  lastSync: string | null;
  error: string | null;
}

export interface AnalyticsProfile {
  id: string;
  name: string | null;
  bio: string | null;
  roles: string[];
  github: string | null;
  leetcode: string | null;
  codeforces: string | null;
  codechef: string | null;
  geeksforgeeks: string | null;
  hackerrank: string | null;
  atcoder: string | null;
  hackerearth: string | null;
  stackoverflow: string | null;
  devto: string | null;
  kaggle: string | null;
  resumeUrl: string | null;
}

export interface AiInsights {
  developerLevel: string;
  strengths: string[];
  weaknesses: string[];
  dsaAnalysis: string;
  contestForecast: string;
  gitAnalysis: string;
  careerReadiness: string;
  predictions: string;
}

export interface AggregatedStats {
  github?: Record<string, unknown>;
  leetcode?: Record<string, unknown>;
  codeforces?: Record<string, unknown>;
  codechef?: Record<string, unknown>;
  geeksforgeeks?: Record<string, unknown>;
  hackerrank?: Record<string, unknown>;
  hackerearth?: Record<string, unknown>;
  atcoder?: Record<string, unknown>;
  stackoverflow?: Record<string, unknown>;
  devto?: Record<string, unknown>;
  kaggle?: Record<string, unknown>;
  aggregates?: Record<string, unknown>;
  scores?: Record<string, number | null>;
  heatmapStats?: Record<string, unknown>;
  aiInsights?: AiInsights | null;
  aiReportId?: string | null;
  lastSynced?: string;
  isSynced?: boolean;
}

export interface AnalyticsResponse {
  success: boolean;
  profile: AnalyticsProfile;
  stats: AggregatedStats | null;
  isSynced: boolean;
  lastSynced: string | null;
  platformStatus?: PlatformConnectionStatus[];
}
