import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import LoginModal from "./components/LoginModal";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ChatbotWidget from "./components/ChatbotWidget";

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  // Buka login modal otomatis kalau ada ?login=true di URL
  // Ini dipakai saat logout dari dashboard → navigate("/?login=true")
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("login") === "true") {
      setShowLogin(true);
      // Bersihkan query param dari URL tanpa reload
      window.history.replaceState({}, "", "/");
    }
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home openLogin={() => setShowLogin(true)} />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <UserDashboard openLogin={() => setShowLogin(true)} />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <ChatbotWidget />
    </>
  );
}

export default AppWrapper;
