export function Menu({ closeMenu, onSelect, currentView }) {
  const items = [
    { label: "View Ads", key: "viewads" },
    { label: "My Ads", key: "myads" },
    { label: "Post Ad", key: "new" },
    { label: "Login", key: "login" },
    { label: "Register", key: "register" },
  ];

  return (
    <div
      onClick={() => {
        closeMenu();
      }}
      className="fixed inset-0 flex justify-center items-end bg-black/25 z-40"
    >
      <div className="bg-white w-full max-w-sm h-auto shadow-xl p-4 flex flex-col rounded-t-lg">
        <button className="self-end text-2xl text-gray-500 hover:text-gray-800" onClick={closeMenu}>
          ×
        </button>

        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => {
                  onSelect(item.key);
                  closeMenu();
                }}
                className={`w-full text-left text-lg p-3 rounded transition-colors ${
                  currentView === item.key
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-800 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
