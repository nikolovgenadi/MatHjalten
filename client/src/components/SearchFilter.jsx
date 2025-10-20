import { useState, useEffect } from "react";
import { Search, Calendar, Filter } from "lucide-react";

export function SearchFilter({ onFiltersChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortByExpiry, setSortByExpiry] = useState("nearest");

  // trigger changes when any filter state changes
  useEffect(() => {
    onFiltersChange({
      searchTerm,
      category,
      status,
      sortByExpiry,
    });
  }, [searchTerm, category, status, sortByExpiry, onFiltersChange]);

  return (
    <div className="bg-white p-4 shadow-sm border-b space-y-4">
      {/* search by user input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search ads by title..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* filters */}
      <div className="flex gap-2 flex-wrap">
        {/* category filter */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="all">All Categories</option>
          <option value="food">Food</option>
          <option value="drink">Drink</option>
        </select>

        {/* status filter */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          {/* not yet applicable */}
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="unavailable">Unavailable</option>
        </select>

        {/* sort */}
        <button
          onClick={() => {
            setSortByExpiry(sortByExpiry === "nearest" ? "furthest" : "nearest");
          }}
          className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
        >
          <Calendar size={16} />
          {sortByExpiry === "nearest" ? "Nearest Expiry" : "Furthest Expiry"}
        </button>
      </div>
    </div>
  );
}
