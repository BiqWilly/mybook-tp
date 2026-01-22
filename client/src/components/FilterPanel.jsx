import { motion, AnimatePresence } from "framer-motion";

export default function FilterPanel({
  filterOpen,
  setFilterOpen,
  filters,
  setFilters,
}) {
  const resetFilters = () => {
    setFilters({
      year: "",
      genres: [],
    });
  };

  return (
    <AnimatePresence>
      {filterOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFilterOpen(false)}
          />

          <motion.div
            className="fixed top-1/4 left-1/2 -translate-x-1/2 w-80 bg-white z-50 p-6 rounded-lg shadow-lg"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
          >
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-lg">Filter Books</h3>
              <button
                onClick={() => setFilterOpen(false)}
                className="text-red-500 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* year */}
              <div>
                <label className="block mb-1 font-medium">Year</label>
                <select
                  value={filters.year}
                  onChange={(e) =>
                    setFilters({ ...filters, year: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                >
                  <option value="">Any</option>
                  {Array.from({ length: 47 }, (_, i) => 1980 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* genres */}
              <div>
                <label className="block mb-1 font-medium">Genre</label>
                <select
                  multiple
                  value={filters.genres}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      genres: Array.from(
                        e.target.selectedOptions,
                        (opt) => opt.value
                      ),
                    })
                  }
                  className="w-full border p-2 rounded h-24"
                >
                  <option>Self-Improvement</option>
                  <option>Productivity</option>
                  <option>History</option>
                  <option>Business</option>
                  <option>Science</option>
                  <option>Fiction</option>
                </select>
              </div>
            </div>

            {/* actions */}
            <div className="flex justify-between mt-6">
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:underline"
              >
                Reset
              </button>

              <button
                onClick={() => setFilterOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
