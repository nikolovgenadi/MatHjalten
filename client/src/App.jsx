import { useState } from "react";
import { useAuth } from "./hooks/useAuth.js";
import { BottomNavigation } from "./components/BottomNavigation.jsx";
import { SearchFilter } from "./components/SearchFilter.jsx";
import { ProfileModal } from "./components/ProfileModal.jsx";
import { Header } from "./components/Header.jsx";
import AdsList from "./pages/ads/AdsList.jsx";
import MyAds from "./pages/ads/MyAds.jsx";
import NewAd from "./pages/ads/NewAd.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Messages from "./pages/Messages.jsx";
import AdDetail from "./pages/ads/AdDetail.jsx";

export default function App() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState("viewads");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [adDetailModalOpen, setAdDetailModalOpen] = useState(false);

  const [searchFilters, setSearchFilters] = useState({
    searchTerm: "",
    category: "all",
    status: "all",
    sortByExpiry: "nearest",
  });

  const handleViewChange = (view) => {
    if (view === "profile") {
      // no change in current view, just open the profile modal
      setProfileModalOpen(true);
    } else {
      setCurrentView(view);
      setProfileModalOpen(false);

      // reset search filters when navigating to home tab
      if (view === "viewads") {
        setSearchFilters({
          searchTerm: "",
          category: "all",
          status: "all",
          sortByExpiry: "nearest",
        });
      }
    }
  };

  const handleAdSelect = (ad) => {
    setSelectedAd(ad);
    setAdDetailModalOpen(true);
  };

  const handleAdDetailClose = () => {
    setAdDetailModalOpen(false);
    setSelectedAd(null);
  };

  // render current view component
  const renderCurrentView = () => {
    switch (currentView) {
      case "viewads":
        return (
          <>
            <Header />
            <AdsList searchFilters={searchFilters} onAdSelect={handleAdSelect} />
          </>
        );
      case "search":
        return (
          <>
            <SearchFilter onFiltersChange={setSearchFilters} />
            <AdsList searchFilters={searchFilters} onAdSelect={handleAdSelect} />
          </>
        );
      case "myads":
        return <MyAds />;
      case "new":
        return <NewAd />;
      case "login":
        return <Login onSuccess={() => handleViewChange("viewads")} />;
      case "register":
        return <Register onSuccess={() => handleViewChange("viewads")} />;
      case "messages":
        return <Messages />;
      default:
        return <AdsList searchFilters={searchFilters} />;
    }
  };

  return (
    <div className="min-h-screen bg-blue-700 flex flex-col">
      {/* main content */}
      <main className="flex-1 bg-blue-700 overflow-y-auto pb-24">{renderCurrentView()}</main>

      {/* bottom navigation */}
      <BottomNavigation currentView={currentView} onViewChange={handleViewChange} />

      {/* profile modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onViewChange={setCurrentView}
        onLogout={logout}
      />

      {/* ad detail modal */}
      <AdDetail isOpen={adDetailModalOpen} onClose={handleAdDetailClose} ad={selectedAd} />
    </div>
  );
}
