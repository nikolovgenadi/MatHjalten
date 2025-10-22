import { useState, useEffect } from "react";
import { AdsContext } from "./AdsContextProvider.js";

export function AdsProvider({ children }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAds = async () => {
    try {
      setLoading(true);
      const url = import.meta.env.PROD ? "/api/ads" : "http://localhost:8080/api/ads";
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      setAds(data.items || []);
      setError("");
    } catch (error) {
      console.error("Error fetching ads:", error);
      setError("Failed to load ads");
    } finally {
      setLoading(false);
    }
  };

  const updateAdStatus = (adId, newStatus) => {
    setAds((prevAds) => prevAds.map((ad) => (ad.id === adId ? { ...ad, status: newStatus } : ad)));
  };

  const addAd = (newAd) => {
    setAds((prevAds) => [newAd, ...prevAds]);
  };

  const removeAd = (adId) => {
    setAds((prevAds) => prevAds.filter((ad) => ad.id !== adId));
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const adsState = {
    ads,
    loading,
    error,
    refetch: fetchAds,
    updateAdStatus,
    addAd,
    removeAd,
  };

  return <AdsContext.Provider value={adsState}>{children}</AdsContext.Provider>;
}
