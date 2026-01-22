import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NotificationsModal from "./NotificationsModal";

export default function Navbar({
  drawerOpen,
  setDrawerOpen,
  notificationsOpen,
  setNotificationsOpen,
}) {
  const navigate = useNavigate();

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setDrawerOpen(false);
    navigate("/login");
  };

  const handleDrawerClick = (item) => {
    if (item === "Forums") {
      navigate("/forums");
      closeDrawer();
    } else if (item === "Notifications") {
      setNotificationsOpen(true);
      closeDrawer();
    } else if (item === "Home") {
      navigate("/");
      closeDrawer();
    } else if (item === "Profile") {
      navigate("/profile");
      closeDrawer();
    }
  };

  return (
    <>
      <nav className="bg-red-600 shadow-xl h-20 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center">
          {/* Hamburger Menu */}
          <button 
            onClick={() => setDrawerOpen(true)} 
            className="p-3 hover:bg-white/10 rounded-2xl transition-colors flex flex-col space-y-1.5"
          >
            <div className="w-6 h-1 bg-white rounded-full" />
            <div className="w-4 h-1 bg-white rounded-full" />
            <div className="w-6 h-1 bg-white rounded-full" />
          </button>
          
          <span 
            className="ml-6 font-black text-2xl text-white tracking-tighter cursor-pointer uppercase" 
            onClick={() => navigate("/")}
          >
            MyBook TP
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/profile")} 
            className="p-2 bg-white/15 hover:bg-white/25 rounded-2xl transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 20v-1c0-1.105.895-2 2-2h8c1.105 0 2 .895 2 2v1H6z" />
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={closeDrawer} 
            />

            {/* Sidebar Drawer */}
            <motion.div 
              className="fixed top-0 left-0 w-80 h-full bg-white z-70 flex flex-col shadow-2xl rounded-r-[3rem] overflow-hidden" 
              initial={{ x: "-100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Drawer Header */}
              <div className="p-8 bg-red-600 text-white flex justify-between items-center">
                <span className="font-black text-xl tracking-tight uppercase">Menu</span>
                <button 
                  onClick={closeDrawer} 
                  className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                >
                  <span className="text-2xl font-bold">✕</span>
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex flex-col p-6 space-y-2 mt-4">
                {[
                  { name: "Home", icon: "🏠" },
                  { name: "Profile", icon: "👤" },
                  { name: "Notifications", icon: "🔔" },
                  { name: "Forums", icon: "💬" },
                  { name: "About", icon: "ℹ️" }
                ].map((item) => (
                  <button 
                    key={item.name} 
                    onClick={() => handleDrawerClick(item.name)} 
                    className="group px-6 py-4 text-lg font-bold text-gray-700 rounded-2xl flex items-center gap-4 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
                  >
                    <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                    {item.name}
                  </button>
                ))}
              </div>

              {/* Footer Section */}
              <div className="mt-auto p-8 border-t border-gray-100 bg-gray-50">
                {user ? (
                  <div className="flex flex-col space-y-4">
                    <div className="px-4">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Logged in as</p>
                        <p className="font-bold text-gray-800 truncate">{user.name}</p>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="w-full py-4 bg-red-100 text-red-600 font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => navigate("/login")} 
                    className="w-full py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <NotificationsModal isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </>
  );
}