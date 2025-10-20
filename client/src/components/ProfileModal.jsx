import { FileText, LogIn, UserPlus, LogOut, X } from "lucide-react";

export function ProfileModal({ isOpen, onClose, user, onViewChange }) {
  if (!isOpen) return null;

  const handleOptionClick = (view) => {
    onViewChange(view);
    onClose();
  };

  return (
    <div onClick={onClose} className="fixed inset-0 flex justify-center items-end bg-black/25 z-40">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-sm h-auto shadow-xl p-4 flex flex-col rounded-t-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
          <button className="text-gray-500 hover:text-gray-800" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {user ? (
            // logged in user options
            <>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-blue-600">{user.name || user.email}</p>
              </div>

              <button
                onClick={() => handleOptionClick("myads")}
                className="w-full flex items-center gap-3 text-xs p-3 rounded transition-colors text-gray-800 hover:text-blue-600 hover:bg-gray-50"
              >
                <FileText size={18} />
                My Ads
              </button>

              <button
                onClick={() => {
                  // Add logout logic here later
                  console.log("Logout clicked");
                  onClose();
                }}
                className="w-full flex items-center gap-3 text-lg p-3 rounded transition-colors text-gray-800 hover:text-red-600 hover:bg-gray-50"
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
