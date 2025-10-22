import { useEffect, useState } from "react";
import { CalendarX2, MapPin, Eye, Trash2, CupSoda, Utensils } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useAds } from "../../hooks/useAds.js";

export default function MyAds() {
  const { user } = useAuth();
  const { ads: allAds, loading, error, removeAd } = useAds();
  const [userAds, setUserAds] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // only show user ads if user is logged in
    if (!user) {
      setMsg("Please log in to view your ads");
      setUserAds([]);
      return;
    }

    if (loading) {
      setMsg("loading...");
      return;
    }

    if (error) {
      setMsg("Failed to load ads");
      return;
    }

    // filter ads to show only user's ads
    const filteredUserAds = allAds.filter((ad) => ad.ownerId === user.id);
    setUserAds(filteredUserAds);
    setMsg("");
  }, [user, allAds, loading, error]);

  async function del(id) {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    const url = import.meta.env.PROD ? `/api/ads/${id}` : `http://localhost:8080/api/ads/${id}`;
    const res = await fetch(url, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      // remove from local state immediately for better UX
      setUserAds(userAds.filter((ad) => ad.id !== id));
      // also remove from global state
      removeAd(id);
    }
  }
  // Show message if not logged in or loading
  if (msg) return <p className="text-center text-gray-500 p-8">{msg}</p>;

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl text-white mb-4">Please log in to view your ads.</h2>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">My Ads</h1>
        <p className="text-white text-sm">Manage your current ads.</p>
      </div>

      {userAds.length > 0 ? (
        <div className="space-y-3">
          {userAds.map((a) => (
            <div key={a.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex gap-3 mb-3">
                {/* image */}
                {a.imageUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={`${import.meta.env.PROD ? "" : "http://localhost:8080"}${a.imageUrl}`}
                      alt={a.title}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {/* title & description & location */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate" title={a.title}>
                    {a.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2" title={a.description}>
                    {a.description}
                  </p>
                  <span
                    className="flex items-center gap-1 text-xs text-gray-500 mt-1 truncate"
                    title={a.locationText}
                  >
                    <MapPin size={14} className="text-blue-600" strokeWidth={1.5} />
                    {a.locationText}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* category */}
                  <span className="flex items-center gap-1 text-gray-600 flex-shrink-0">
                    {a.category === "food" ? (
                      <Utensils size={14} className="text-blue-600" strokeWidth={1.5} />
                    ) : a.category === "drink" ? (
                      <CupSoda size={14} className="text-blue-600" strokeWidth={1.5} />
                    ) : (
                      ""
                    )}
                    <span className="truncate">{a.category || "uncategorized"}</span>
                  </span>

                  {/* exp date */}
                  <span className="flex items-center gap-1 text-gray-600 flex-shrink-0">
                    <CalendarX2 size={14} className="text-blue-600" strokeWidth={1.5} />
                    <span className="truncate">{new Date(a.expiresAt).toLocaleDateString()}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* status */}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      a.status === "available"
                        ? "bg-green-100 text-green-800"
                        : a.status === "reserved"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {a.status}
                  </span>
                  {/* delete button */}
                  <button
                    onClick={() => del(a.id)}
                    className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-xs font-medium"
                    title="Delete this ad"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-white mb-2">You have no created ads yet.</h2>
        </div>
      )}
    </div>
  );
}
