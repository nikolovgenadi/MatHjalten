import { useEffect, useState } from "react";
import { CalendarX2, MapPin, Eye, Trash2, CupSoda, Utensils } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";

export default function MyAds() {
  const { user } = useAuth();
  const [ads, setAds] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // only fetch if user is logged in
    if (!user) {
      setMsg("Please log in to view your ads");
      return;
    }

    const url = import.meta.env.PROD ? "/api/ads/mine" : "http://localhost:8080/api/ads/mine";
    setMsg("loading...");
    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        // backend already filters by user, doublecheck client-side anyway
        const userAds = (data.items || []).filter((ad) => ad.ownerId === user.id);
        setAds(userAds);
        setMsg("");
      })
      .catch(() => setMsg("failed to load"));
  }, [user]);

  async function del(id) {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    const url = import.meta.env.PROD ? `/api/ads/${id}` : `http://localhost:8080/api/ads/${id}`;
    const res = await fetch(url, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      setAds(ads.filter((ad) => ad.id !== id));
    }
  }

  // const viewAd = (id) => {
  //   console.log(`View ad ${id}`);
  // };

  // Show message if not logged in or loading
  if (msg) return <p className="text-center text-gray-500 p-8">{msg}</p>;

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl text-gray-800 mb-4">Authentication Required</h2>
        <p className="text-gray-600">Please log in to view your ads.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">My Ads</h1>
        <p className="text-white text-sm">Manage your current ads.</p>
      </div>

      {ads.length > 0 ? (
        <div className="space-y-3">
          {ads.map((a) => (
            <div key={a.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start gap-3">
                {/* image thumbnail */}
                {a.imageUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={`${import.meta.env.PROD ? "" : "http://localhost:8080"}${a.imageUrl}`}
                      alt={a.title}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate" title={a.title}>
                    {a.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2" title={a.description}>
                    {a.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    <span
                      className="flex items-center gap-1 truncate max-w-[120px]"
                      title={a.locationText}
                    >
                      <MapPin size={18} className="text-blue-600" strokeWidth={1.5} />
                      {a.locationText}
                    </span>
                    <span className="flex items-center gap-1">
                      {a.category === "food" ? (
                        <Utensils size={18} className="text-blue-600" strokeWidth={1.5} />
                      ) : a.category === "drink" ? (
                        <CupSoda size={18} className="text-blue-600" strokeWidth={1.5} />
                      ) : (
                        ""
                      )}{" "}
                      {a.category || "uncategorized"}
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <CalendarX2 size={18} className="text-blue-600" strokeWidth={1.5} />
                      Expires: {new Date(a.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {/* status */}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium text-center ${
                      a.status === "available"
                        ? "bg-green-100 text-green-800"
                        : a.status === "reserved"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {a.status}
                  </span>

                  {/* action buttons */}
                  <div className="flex gap-2">
                    {/* view button - temporarily disabled until view functionality is implemented */}
                    {/* <button
                      onClick={() => console.log("View ad", a.id)}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-xs font-medium"
                      title="View ad details"
                    >
                      <Eye size={18} strokeWidth={1.5} />
                      View
                    </button> */}
                    {/* delete ad button */}
                    <button
                      onClick={() => del(a.id)}
                      className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-xs font-medium"
                      title="Delete this ad"
                    >
                      <Trash2 size={18} strokeWidth={1.5} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No ads yet</h2>
          <p className="text-gray-600 mb-6">You have no created ads yet.</p>
        </div>
      )}
    </div>
  );
}
