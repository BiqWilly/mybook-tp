import { useState } from "react";
import FilterPanel from "./FilterPanel";

export default function SearchBar({ onSearchChange, onFilterChange }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    year: "",
    genres: [],
  });

  return (
    <>
      <div className="bg-white h-24 flex items-center justify-between shadow-xl sticky top-20 z-40 px-10 rounded-b-[2.5rem]">
        <div className="flex-1 flex items-center justify-center gap-4">
          {/* Modern Rounded Search Input */}
          <div className="relative w-full max-w-md group">
            <span className="absolute inset-y-0 left-5 flex items-center text-gray-400 group-focus-within:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </span>
            <input
                type="text"
                placeholder="Search for book titles, authors, year..."
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-100 border-none rounded-2xl font-bold text-gray-700 placeholder:text-gray-400 focus:ring-4 focus:ring-red-100 focus:bg-white transition-all outline-none"
            />
          </div>

          {/* Filter Button Matching Profile UI scale */}
          <button
            onClick={() => setFilterOpen(true)}
            className="p-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
            </svg>
          </button>
        </div>

        {/* Legend: Styled like the Status Badges in Profile */}
        <div className="hidden lg:flex items-center gap-8 ml-8">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
            <span className="text-sm font-black text-gray-500 uppercase tracking-widest">Available</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]"></div>
            <span className="text-sm font-black text-gray-500 uppercase tracking-widest">In Queue</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.4)]"></div>
            <span className="text-sm font-black text-gray-500 uppercase tracking-widest">Reserved</span>
          </div>
        </div>
      </div>

      <FilterPanel
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        filters={filters}
        setFilters={(newFilters) => {
          setFilters(newFilters);
          onFilterChange(newFilters);
        }}
      />
    </>
  );
}