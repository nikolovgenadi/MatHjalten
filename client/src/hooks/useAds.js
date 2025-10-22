import { useContext } from "react";
import { AdsContext } from "../contexts/AdsContextProvider.js";

export function useAds() {
  const context = useContext(AdsContext);
  if (!context) {
    throw new Error("useAds must be used within an AdsProvider");
  }
  return context;
}
