import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modern Glassmorphism Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Floating Rounded Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-70 p-10 shadow-2xl rounded-l-[4rem] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header with high-contrast styling */}
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Alerts</h1>
              <button 
                onClick={onClose} 
                className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all active:scale-90"
              >
                <span className="text-2xl font-bold">&times;</span>
              </button>
            </div>

            <p className="text-[10px] font-black text-gray-400 mb-8 uppercase tracking-[0.2em] border-b border-gray-100 pb-4">
              Preferences
            </p>

            <div className="flex flex-col space-y-4">
              {/* Alert Toggle Item 1 */}
              <label className="flex items-center justify-between p-6 bg-gray-50 rounded-2rem cursor-pointer group hover:bg-red-50 transition-all border border-transparent hover:border-red-100">
                <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-800 uppercase tracking-tight group-hover:text-red-600 transition-colors">Availability</span>
                    <span className="text-[10px] font-medium text-gray-500">Alert me when a book is back</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-2px after:left-2px after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </div>
              </label>

              {/* Alert Toggle Item 2 */}
              <label className="flex items-center justify-between p-6 bg-gray-50 rounded-2rem cursor-pointer group hover:bg-red-50 transition-all border border-transparent hover:border-red-100">
                <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-800 uppercase tracking-tight group-hover:text-red-600 transition-colors">Due Dates</span>
                    <span className="text-[10px] font-medium text-gray-500">24h return reminders</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-2px after:left-2px after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </div>
              </label>

              {/* Alert Toggle Item 3 */}
              <label className="flex items-center justify-between p-6 bg-gray-50 rounded-2rem cursor-pointer group hover:bg-red-50 transition-all border border-transparent hover:border-red-100">
                <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-800 uppercase tracking-tight group-hover:text-red-600 transition-colors">New Books</span>
                    <span className="text-[10px] font-medium text-gray-500">Weekly library updates</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-2px after:left-2px after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </div>
              </label>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}