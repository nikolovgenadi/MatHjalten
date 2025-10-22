import { useState, useEffect } from "react";
import { X, MapPin, CalendarX2, Utensils, CupSoda, MessageCircleX } from "lucide-react";
import { useAds } from "../../hooks/useAds.js";

export default function AdDetail({ isOpen, onClose, ad }) {
  const { updateAdStatus } = useAds();
  const [isReserving, setIsReserving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(ad?.status || "available");

  // update currentStatus when ad prop changes
  useEffect(() => {
    if (ad) {
      setCurrentStatus(ad.status);
    }
  }, [ad]);

  if (!isOpen || !ad) return null;

  const handleReserve = async () => {
    if (currentStatus !== "available" || isReserving) return;

    setIsReserving(true);
    try {
      const url = import.meta.env.PROD
        ? `/api/ads/${ad.id}/reserve`
        : `http://localhost:8080/api/ads/${ad.id}/reserve`;

      const response = await fetch(url, {
        method: "PATCH",
        credentials: "include",
      });

      if (response.ok) {
        await response.json();
        setCurrentStatus("reserved");
        // updates ad status in global state
        updateAdStatus(ad.id, "reserved");
      } else {
        console.error("Failed to reserve ad");
        alert("Failed to reserve ad. Please try again.");
      }
    } catch (error) {
      console.error("Error reserving ad:", error);
      alert("Error reserving ad. Please try again.");
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* container with close button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-900 truncate leading-relaxed whitespace-pre-wrap break-words pr-4">
            {ad.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* content */}
        <div className="p-6 space-y-4">
          {/* image */}
          {ad.imageUrl && (
            <div className="mb-6">
              <img
                src={`${import.meta.env.PROD ? "" : "http://localhost:8080"}${ad.imageUrl}`}
                alt={ad.title}
                className="max-w-70vw max-h-40vh object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {ad.description}
            </p>
          </div>

          {/* grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {/* status */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentStatus === "available"
                    ? "bg-green-100 text-green-800"
                    : currentStatus === "reserved"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {currentStatus}
              </span>
            </div>
            {/* category */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-blue-600">
                {ad.category === "food" ? (
                  <Utensils size={18} strokeWidth={1.5} />
                ) : ad.category === "drink" ? (
                  <CupSoda size={18} strokeWidth={1.5} />
                ) : null}
                <span className="font-medium">Category:</span>
              </div>
              <span className="text-gray-700 capitalize">{ad.category || "uncategorized"}</span>
            </div>

            {/* expiry Date */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-blue-600">
                <CalendarX2 size={18} strokeWidth={1.5} />
                <span className="font-medium">Expires:</span>
              </div>
              <span className="text-gray-700">{new Date(ad.expiresAt).toLocaleDateString()}</span>
            </div>

            {/* location */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-blue-600">
                <MapPin size={18} strokeWidth={1.5} />
                <span className="font-medium">Location:</span>
              </div>
              <span
                className="text-gray-700 truncate leading-relaxed whitespace-pre-wrap break-words"
                title={ad.locationText}
              >
                {ad.locationText}
              </span>
            </div>
          </div>

          {/* action buttons */}
          <div className="pt-6 border-t border-gray-200 flex gap-3 justify-end">
            {/* Only show Reserve button if status is available */}
            {currentStatus === "available" && (
              <button
                onClick={handleReserve}
                disabled={isReserving}
                className={`px-6 py-2 rounded-lg font-medium transition-colors text-white ${
                  isReserving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {isReserving ? "Reserving..." : "Reserve"}
              </button>
            )}

            <button className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center gap-2">
              <MessageCircleX size={18} />
              Available soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
