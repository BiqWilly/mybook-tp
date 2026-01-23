import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import NotificationsModal from "./components/NotificationsModal";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import BookDetails from "./pages/BookDetails";
import Forums from "./pages/Forums";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import LibrarianDashboard from "./pages/LibrarianDashboard";

// Security Wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  if (!user) return <Navigate to="/login" replace />;

  // If the page is for admins but the user is a student
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const location = useLocation();

  // Routes where the Navbar is hidden
  const hideNavbarRoutes = ["/login", "/signup", "/onboarding", "/NotFound", "/profile", "/forums", "/admin"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* GLOBAL NAVBAR */}
      {shouldShowNavbar && (
        <Navbar
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          notificationsOpen={notificationsOpen}
          setNotificationsOpen={setNotificationsOpen}
        />
      )}

      {/* PAGES */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><LibrarianDashboard /></ProtectedRoute>}/>

        {/* Protected Routes (User must be logged in) */}
        <Route
          path="/forums"
          element={<ProtectedRoute><Forums /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />
        <Route
          path="/onboarding"
          element={<ProtectedRoute><Onboarding /></ProtectedRoute>}
        />

        {/* Fallback */}
        <Route path="/NotFound" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/NotFound" replace />} />
      </Routes>

      {/* NOTIFICATIONS MODAL (Stand-alone) */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
}

export default App;