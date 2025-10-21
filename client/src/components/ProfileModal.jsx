import { FileText, LogIn, UserPlus, LogOut, X } from "lucide-react";

export function ProfileModal({ isOpen, onClose, user, onViewChange, onLogout }) {
  if (!isOpen) return null;

  const handleOptionClick = (view) => {
    onViewChange(view);
    onClose();
  };

  return (
    <div onClick={onClose} className="fixed inset-0 flex justify-end items-end bg-black/25 z-40">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-auto max-w-sm h-auto shadow-xl pb-15 pl-4 rounded-t-lg"
      >
        <div className="space-y-3 column justify-around items-center">
          {user ? (
            // logged in user options
            <>
              <div className="p-3 bg-blue-50 rounded-lg shadow-md border-gray-300">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-blue-600">{user.name || user.email}</p>
              </div>

              <button
                onClick={() => handleOptionClick("myads")}
                className="w-full flex items-center gap-3 text-xs p-3 rounded shadow-md border-gray-300 transition-colors text-gray-800 hover:text-blue-600 hover:bg-gray-50"
              >
                <FileText size={18} />
                My Ads
              </button>

              <button
                onClick={async () => {
                  try {
                    await onLogout();
                    onClose();
                  } catch (error) {
                    console.error("Logout failed:", error);
                    onClose(); // Close modal even if logout fails
                  }
                }}
                className="w-full flex items-center gap-3 text-lg p-3 rounded shadow-md border-gray-300 transition-colors text-gray-800 hover:text-red-600 hover:bg-gray-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            // not logged in options
            <>
              <button
                onClick={() => handleOptionClick("login")}
                className="w-full flex items-center gap-3 text-lg p-3 rounded transition-colors text-gray-800 hover:text-blue-600 hover:bg-gray-50"
              >
                <LogIn size={20} />
                Login
              </button>

              <button
                onClick={() => handleOptionClick("register")}
                className="w-full flex items-center gap-3 text-lg p-3 rounded transition-colors text-gray-800 hover:text-blue-600 hover:bg-gray-50"
              >
                <UserPlus size={20} />
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
