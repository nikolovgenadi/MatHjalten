import { Home, Plus, Search, MessageCircle, User } from "lucide-react";

export function BottomNavigation({ currentView, onViewChange }) {
  const navItems = [
    {
      key: "viewads",
      label: "View Ads",
      icon: Home,
      activeIcon: Home,
    },
    {
      key: "search",
      label: "Search",
      icon: Search,
      activeIcon: Search,
    },
    {
      key: "new",
      label: "Post Ad",
      icon: Plus,
      activeIcon: Plus,
    },
    {
      key: "messages",
      label: "Messages",
      icon: MessageCircle,
      activeIcon: MessageCircle,
    },
    {
      key: "profile",
      label: "Profile",
      icon: User,
      activeIcon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-blue-700/90 backdrop-blur-md border-t border-black/20 shadow-lg z-50">
      <div className="flex">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onViewChange(item.key)}
            className={`flex-1 py-3 px-2 text-center transition-colors ${
              currentView === item.key ? "text-white bg-black/25" : "text-white hover:text-blue-200"
            }`}
          >
            <div className="flex flex-col items-center gap-1 sm:gap-1">
              {currentView === item.key ? (
                <item.activeIcon size={20} strokeWidth={2.5} />
              ) : (
                <item.icon size={20} strokeWidth={1.5} />
              )}
              <span className="text-xs font-medium hidden sm:block">{item.label}</span>
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
}
