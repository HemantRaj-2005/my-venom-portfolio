"use client";

import { createContext, useContext } from "react";
import type { AnalyticsResponse } from "@/types/analytics";

export interface AnalyticsContextType {
  stats: AnalyticsResponse["stats"];
  profile: AnalyticsResponse["profile"] | null;
  loading: boolean;
  platformStatus: AnalyticsResponse["platformStatus"];
  playClick: () => void;
  refetch: () => void;
}

export const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}
