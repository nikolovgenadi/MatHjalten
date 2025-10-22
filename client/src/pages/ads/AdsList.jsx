import { useEffect, useState } from "react";
import { CalendarX2, MapPin, CupSoda, Utensils, Eye } from "lucide-react";
import { useAds } from "../../hooks/useAds.js";

export default function AdsList({ searchFilters, onAdSelect }) {
  const { ads, loading, error } = useAds();
  const [filteredItems, setFilteredItems] = useState([]);

  // filter and sort items
  useEffect(() => {
    if (!searchFilters) {
      setFilteredItems(ads);
      return;
    }

    let filtered = ads.filter((item) => {
      //title
      const matchesSearch =
        searchFilters.searchTerm === "" ||
        item.title.toLowerCase().includes(searchFilters.searchTerm.toLowerCase());

      // category
      const matchesCategory =
        searchFilters.category === "all" || item.category === searchFilters.category;

      // status
      const matchesStatus = searchFilters.status === "all" || item.status === searchFilters.status;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // expiry date
    if (searchFilters.sortByExpiry === "nearest") {
      filtered.sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt));
    } else {
      filtered.sort((a, b) => new Date(b.expiresAt) - new Date(a.expiresAt));
    }

    setFilteredItems(filtered);
  }, [searchFilters, ads]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 space-y-4">
      {filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map((a) => (
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
                  <button
                    onClick={() => onAdSelect && onAdSelect(a)}
                    className="text-white bg-blue-600 rounded-full py-1 px-2 text-xs font-medium hover:bg-blue-700 transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-white">
            {searchFilters?.searchTerm ||
            searchFilters?.category !== "all" ||
            searchFilters?.status !== "all"
              ? "No ads match your filters."
              : "No food to be saved yet."}
          </p>
        </div>
      )}
    </div>
  );
}
