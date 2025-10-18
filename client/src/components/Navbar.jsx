import { useState } from "react";
import { Menu } from "./Menu.jsx";

export function Navbar({ currentView, onViewChange }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuSelect = (key) => {
    onViewChange(key);
    setMenuOpen(false);
  };

  // Bottom navbar (suitable for mobile)
  return (
    <>
      <header className="fixed top-0 left-0 w-full flex items-center justify-center bg-blue-600 text-white px-6 py-3 shadow-md z-50">
        <div className=" flex items-center gap-2">
          <img
            src="/mathjalte-notext.png"
            alt="MatHjälten logo"
            className="w-8 h-8 rounded-full border border-white"
          />
          <h1 className="text-lg font-semibold tracking-wide">MatHjälten</h1>
        </div>
      </header>
      <footer className="fixed bottom-0 left-0 w-full flex items-center justify-between bg-blue-600 text-white px-6 py-3 shadow-md z-50">
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-blue-700 rounded">
          ☰
        </button>
      </footer>
      {menuOpen && (
        <Menu
          closeMenu={() => setMenuOpen(false)}
          onSelect={handleMenuSelect}
          currentView={currentView}
        />
      )}
    </>
  );
}
