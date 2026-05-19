import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
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

  return (
    <>
      <Routes>
        <Route path="/" element={<Home openLogin={() => setShowLogin(true)} />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><UserDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
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
