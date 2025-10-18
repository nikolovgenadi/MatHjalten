import { useState } from "react";
import { useAuth } from "./hooks/useAuth.js";
import { Navbar } from "./components/Navbar.jsx";
import AdsList from "./pages/ads/AdsList.jsx";
import MyAds from "./pages/ads/MyAds.jsx";
import NewAd from "./pages/ads/NewAd.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

export default function App() {
  const user = useAuth();
  const [currentView, setCurrentView] = useState("viewads");

  // Render the current view component with menu navigation
  const renderCurrentView = () => {
    switch (currentView) {
      case "viewads":
        return <AdsList />;
      case "myads":
        return <MyAds />;
      case "new":
        return <NewAd />;
      case "login":
        return <Login />;
      case "register":
        return <Register />;
      default:
        return <AdsList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 overflow-y-auto pb-20">{renderCurrentView()}</main>

      <Navbar currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
}
