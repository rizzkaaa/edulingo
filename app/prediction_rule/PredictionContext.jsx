"use client";

import { createContext, useContext } from "react";

export const PredictionContext = createContext({
  userName: "",
  userProfile: { avatarUrl: null, initials: "U" },
  loading: true,
});

export function usePrediction() {
  return useContext(PredictionContext);
}
