import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }
    axios.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setValid(true))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setValid(false);
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: "#08080f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🎫</div>
          <div style={{ color: "#C084FC", fontWeight: 700, fontSize: 16, fontFamily: "'Nunito', sans-serif" }}>Memuat...</div>
        </div>
      </div>
    );
  }

  if (!valid) return <Navigate to="/" replace />;
  return <>{children}</>;
}
