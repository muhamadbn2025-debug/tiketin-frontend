import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const dummyBookings = [
  { id: 1, booking_code: "TKT-2026-AX9K2L", event: { title: "Coldplay: Music of the Spheres", event_date: "2026-06-14T19:00:00", venue: "GBK Stadium", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop" }, ticket: { name: "VIP", price: 1500000 }, quantity: 2, total_price: 3000000, status: "paid" },
  { id: 2, booking_code: "TKT-2026-BZ7M4N", event: { title: "Jakarta Jazz Festival 2026", event_date: "2026-07-22T17:00:00", venue: "Ancol Beach City", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=200&fit=crop" }, ticket: { name: "Festival", price: 450000 }, quantity: 3, total_price: 1350000, status: "paid" },
  { id: 3, booking_code: "TKT-2026-CY5P8Q", event: { title: "Soundrenaline 2026", event_date: "2026-08-30T14:00:00", venue: "GWK, Bali", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=200&fit=crop" }, ticket: { name: "VVIP", price: 3000000 }, quantity: 1, total_price: 3000000, status: "cancelled" },
];

const upcomingEvents = [
  { id: 1, title: "Coldplay: Music of the Spheres", date: "14 Jun 2026", venue: "GBK Stadium", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop", price: "Rp 750.000", category: "Konser" },
  { id: 2, title: "Jakarta Jazz Festival", date: "22 Jul 2026", venue: "Ancol Beach City", img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=200&fit=crop", price: "Rp 450.000", category: "Festival" },
  { id: 3, title: "We The Fest 2026", date: "12 Sep 2026", venue: "JIEXPO Kemayoran", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=200&fit=crop", price: "Rp 680.000", category: "Festival" },
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(dummyBookings);
  const [events, setEvents] = useState(upcomingEvents);
  const [openMenu, setOpenMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<"tickets" | "events">("tickets");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBookings();
    fetchEvents();
    const handleClick = () => setOpenMenu(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/my-bookings", { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.data?.data?.length > 0) setBookings(res.data.data.data);
    } catch { }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/events");
      if (res.data.data?.data?.length > 0) setEvents(res.data.data.data.slice(0, 3));
    } catch { }
  };

  const handleLogout = async () => {
    try { await axios.post("/api/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } }); } catch { }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const paidBookings = bookings.filter(b => b.status === "paid").length;
  const totalSpent = bookings.filter(b => b.status === "paid").reduce((s, b) => s + b.total_price, 0);
  const formatPrice = (p: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);
  const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3FF", fontFamily: "'Nunito', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Syne:wght@700;800;900&display=swap');

        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes slide-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes wiggle { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
        @keyframes modal-in { from{opacity:0;transform:scale(0.93) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes pop { 0%{transform:scale(0.95);opacity:0} 100%{transform:scale(1);opacity:1} }

        .wiggle { animation:wiggle 2s ease-in-out infinite; }
        .float-anim { animation:float 3s ease-in-out infinite; }

        .gradient-text {
          background:linear-gradient(135deg,#7C3AED,#F59E0B);
          background-size:200% auto; -webkit-background-clip:text;
          -webkit-text-fill-color:transparent; background-clip:text;
        }

        .sidebar-item {
          display:flex; align-items:center; gap:12px; padding:11px 14px;
          border-radius:14px; cursor:pointer; font-weight:700; font-size:14px;
          transition:all 0.2s; color:#6B7280; margin-bottom:4px;
        }
        .sidebar-item:hover { background:#EDE9FE; color:#7C3AED; }
        .sidebar-item.active { background:linear-gradient(135deg,#7C3AED,#9333EA); color:white; box-shadow:0 6px 20px rgba(124,58,237,0.3); }

        .stat-card {
          background:white; border-radius:20px; padding:22px;
          border:1.5px solid #EDE9FE; transition:all 0.3s;
          animation:slide-up 0.5s ease both;
          box-shadow:0 2px 12px rgba(124,58,237,0.06);
        }
        .stat-card:hover { border-color:#7C3AED; transform:translateY(-4px); box-shadow:0 12px 32px rgba(124,58,237,0.12); }

        .ticket-card {
          background:white; border-radius:20px; border:1.5px solid #EDE9FE;
          overflow:hidden; transition:all 0.3s; animation:slide-up 0.4s ease both;
          box-shadow:0 2px 12px rgba(124,58,237,0.06);
        }
        .ticket-card:hover { border-color:#7C3AED; box-shadow:0 8px 32px rgba(124,58,237,0.12); }

        .event-card {
          background:white; border-radius:20px; border:1.5px solid #EDE9FE;
          overflow:hidden; transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow:0 2px 12px rgba(124,58,237,0.06);
        }
        .event-card:hover { transform:translateY(-8px) scale(1.02); border-color:#7C3AED; box-shadow:0 20px 48px rgba(124,58,237,0.15); }
        .event-card:hover .eimg { transform:scale(1.08); }
        .eimg { transition:transform 0.5s ease; width:100%; height:100%; object-fit:cover; }

        .btn-primary { background:linear-gradient(135deg,#7C3AED,#9333EA); color:white; border:none; border-radius:12px; font-weight:800; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(124,58,237,0.35); }

        .btn-ghost { background:white; color:#7C3AED; border:1.5px solid #DDD6FE; border-radius:12px; font-weight:700; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .btn-ghost:hover { background:#EDE9FE; border-color:#7C3AED; }

        .tab-btn { padding:10px 22px; border-radius:50px; border:none; font-weight:800; font-size:13px; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .tab-btn.active { background:linear-gradient(135deg,#7C3AED,#9333EA); color:white; box-shadow:0 4px 14px rgba(124,58,237,0.3); }
        .tab-btn:not(.active) { background:white; color:#9CA3AF; border:1.5px solid #E5E7EB; }
        .tab-btn:not(.active):hover { color:#7C3AED; border-color:#DDD6FE; background:#F5F3FF; }

        .status-paid { background:#ECFDF5; color:#059669; border:1px solid #A7F3D0; border-radius:50px; padding:3px 12px; font-size:12px; font-weight:800; }
        .status-cancelled { background:#FEF2F2; color:#DC2626; border:1px solid #FECACA; border-radius:50px; padding:3px 12px; font-size:12px; font-weight:800; }
        .status-pending { background:#FFFBEB; color:#D97706; border:1px solid #FDE68A; border-radius:50px; padding:3px 12px; font-size:12px; font-weight:800; }

        .modal-box { animation:modal-in 0.3s cubic-bezier(0.34,1.56,0.64,1); }
      `}</style>

      {/* SIDEBAR */}
      <div style={{ width: sidebarOpen ? 240 : 72, background: "white", borderRight: "1.5px solid #EDE9FE", minHeight: "100vh", padding: "24px 14px", flexShrink: 0, transition: "width 0.3s ease", overflow: "hidden", boxShadow: "4px 0 20px rgba(124,58,237,0.06)" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, paddingLeft: 4 }}>
          <div className="wiggle" style={{ display: "inline-block", flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#7C3AED,#F59E0B)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 14px rgba(124,58,237,0.35)" }}>🎫</div>
          </div>
          {sidebarOpen && <div style={{ fontSize: 18, fontWeight: 900, fontFamily: "'Syne',sans-serif" }} className="gradient-text">TiketIn</div>}
        </div>

        {sidebarOpen && <div style={{ fontSize: 10, fontWeight: 800, color: "#9CA3AF", letterSpacing: "2px", marginBottom: 10, paddingLeft: 8 }}>MENU</div>}
        {[
          { icon: "🏠", label: "Dashboard", active: true },
          { icon: "🎫", label: "Tiket Saya", onClick: () => setActiveTab("tickets") },
          { icon: "🎪", label: "Jelajahi Event", onClick: () => setActiveTab("events") },
          { icon: "👤", label: "Profil" },
        ].map((item, i) => (
          <div key={i} className={`sidebar-item ${item.active ? "active" : ""}`} onClick={item.onClick} style={{ justifyContent: sidebarOpen ? "flex-start" : "center" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
            {sidebarOpen && <span>{item.label}</span>}
          </div>
        ))}

        <div style={{ marginTop: 24 }}>
          <div className="sidebar-item" onClick={handleLogout} style={{ justifyContent: sidebarOpen ? "flex-start" : "center", color: "#DC2626" }}
            onMouseOver={e => (e.currentTarget.style.background = "#FEF2F2")}
            onMouseOut={e => (e.currentTarget.style.background = "transparent")}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </div>
        </div>

        {/* Sidebar promo card */}
        {sidebarOpen && (
          <div style={{ marginTop: 32, background: "linear-gradient(135deg,#7C3AED,#9333EA)", borderRadius: 20, padding: "18px 16px", boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🎟️</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "white", marginBottom: 4 }}>Event Baru!</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 600, marginBottom: 12 }}>Coldplay Jakarta — tiket terbatas!</div>
            <button className="btn-primary" onClick={() => setActiveTab("events")} style={{ width: "100%", padding: "8px 0", fontSize: 12, background: "rgba(255,255,255,0.2)" }}>Lihat Event →</button>
          </div>
        )}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* NAVBAR */}
        <div style={{ background: "white", borderBottom: "1.5px solid #EDE9FE", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "#F5F3FF", border: "1.5px solid #DDD6FE", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 16, color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>☰</button>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#1F2937" }}>Dashboard Saya</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>Selamat datang kembali, {user?.name}! 👋</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }} onClick={e => e.stopPropagation()}>
            <button onClick={() => navigate("/")} className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>🏠 Beranda</button>
            <div style={{ position: "relative" }}>
              <div onClick={() => setOpenMenu(!openMenu)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: "#F5F3FF", border: "1.5px solid #DDD6FE", borderRadius: 12, padding: "8px 14px" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "white" }}>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#1F2937" }}>{user?.name || "User"}</div>
                  <div style={{ fontSize: 10, color: "#7C3AED", fontWeight: 700 }}>Member Aktif ✨</div>
                </div>
                <span style={{ color: "#9CA3AF", fontSize: 11 }}>▼</span>
              </div>
              {openMenu && (
                <div style={{ position: "absolute", right: 0, top: 52, width: 180, background: "white", borderRadius: 16, padding: 8, zIndex: 100, boxShadow: "0 8px 32px rgba(124,58,237,0.15)", border: "1.5px solid #EDE9FE" }}>
                  <button onClick={handleLogout} style={{ width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#DC2626", fontFamily: "'Nunito',sans-serif", borderRadius: 10 }}>🚪 Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: "28px 32px" }}>

          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
            {[
              { label: "Total Tiket", value: bookings.length, icon: "🎫", color: "#7C3AED", bg: "#F5F3FF", delay: "0s" },
              { label: "Tiket Aktif", value: paidBookings, icon: "✅", color: "#059669", bg: "#ECFDF5", delay: "0.08s" },
              { label: "Total Spending", value: formatPrice(totalSpent), icon: "💰", color: "#D97706", bg: "#FFFBEB", delay: "0.16s" },
              { label: "Event Dikunjungi", value: paidBookings, icon: "🎪", color: "#7C3AED", bg: "#EDE9FE", delay: "0.24s" },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ animationDelay: s.delay, background: s.bg }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontSize: i === 2 ? 16 : 32, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 700, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <button className={`tab-btn ${activeTab === "tickets" ? "active" : ""}`} onClick={() => setActiveTab("tickets")}>🎫 Tiket Saya ({bookings.length})</button>
            <button className={`tab-btn ${activeTab === "events" ? "active" : ""}`} onClick={() => setActiveTab("events")}>🎪 Jelajahi Event</button>
          </div>

          {/* TIKET SAYA */}
          {activeTab === "tickets" && (
            <div>
              {bookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div className="float-anim" style={{ fontSize: 64, marginBottom: 16 }}>🎫</div>
                  <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8, color: "#1F2937" }}>Belum ada tiket</h3>
                  <p style={{ color: "#9CA3AF", marginBottom: 20, fontWeight: 600 }}>Yuk beli tiket event favoritmu!</p>
                  <button className="btn-primary" onClick={() => setActiveTab("events")} style={{ padding: "12px 28px", fontSize: 14 }}>Cari Event →</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {bookings.map((b, i) => (
                    <div key={b.id} className="ticket-card" style={{ animationDelay: `${i * 0.07}s` }}>
                      <div style={{ display: "flex" }}>
                        <div style={{ width: 180, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                          <img src={b.event.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={b.event.title} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent, rgba(245,243,255,0.6))" }} />
                        </div>
                        <div style={{ flex: 1, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 11, color: "#7C3AED", fontWeight: 800, marginBottom: 6, letterSpacing: "1px" }}>{b.booking_code}</div>
                            <h3 style={{ fontSize: 17, fontWeight: 900, color: "#1F2937", marginBottom: 6 }}>{b.event.title}</h3>
                            <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600, marginBottom: 8 }}>📅 {formatDate(b.event.event_date)} · 📍 {b.event.venue}</div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                              <span style={{ fontSize: 12, background: "#EDE9FE", color: "#7C3AED", border: "1px solid #DDD6FE", borderRadius: 50, padding: "2px 10px", fontWeight: 800 }}>{b.ticket.name}</span>
                              <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 700 }}>×{b.quantity}</span>
                              <span className={`status-${b.status}`}>{b.status === "paid" ? "✅ Aktif" : b.status === "cancelled" ? "❌ Dibatalkan" : "⏳ Pending"}</span>
                            </div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: 20, fontWeight: 900, color: "#7C3AED", marginBottom: 8 }}>{formatPrice(b.total_price)}</div>
                            {b.status === "paid" && (
                              <button className="btn-primary" onClick={() => setSelectedBooking(b)} style={{ padding: "8px 18px", fontSize: 13 }}>📱 Lihat Tiket</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* JELAJAHI EVENT */}
          {activeTab === "events" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {events.map((ev: any, i) => (
                <div key={ev.id || i} className="event-card">
                  <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                    <img src={ev.img || ev.image} className="eimg" alt={ev.title} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(30,10,60,0.7), transparent 55%)" }} />
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#7C3AED,#F59E0B)" }} />
                    <div style={{ position: "absolute", top: 12, left: 12 }}>
                      <span style={{ background: "rgba(124,58,237,0.85)", color: "white", borderRadius: 50, padding: "3px 10px", fontSize: 11, fontWeight: 800 }}>{ev.category}</span>
                    </div>
                  </div>
                  <div style={{ padding: "16px 18px" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: "#1F2937", marginBottom: 6, lineHeight: 1.3 }}>{ev.title}</h3>
                    <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, marginBottom: 14 }}>📅 {ev.date || ev.event_date} · 📍 {ev.venue}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 900, color: "#7C3AED" }}>{ev.price || "Rp 750.000"}</div>
                      <button className="btn-primary" onClick={() => navigate("/")} style={{ padding: "8px 16px", fontSize: 13 }}>Beli Tiket →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* E-TICKET MODAL */}
      {selectedBooking && (
        <div onClick={() => setSelectedBooking(null)} style={{ position: "fixed", inset: 0, background: "rgba(109,40,217,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ background: "white", border: "1.5px solid #DDD6FE", borderRadius: 28, padding: 32, maxWidth: 420, width: "100%", margin: "0 20px", boxShadow: "0 32px 80px rgba(124,58,237,0.2)" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: "#7C3AED", fontWeight: 800, letterSpacing: "1px", marginBottom: 8 }}>{selectedBooking.booking_code}</div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#1F2937", marginBottom: 4 }}>{selectedBooking.event.title}</h3>
              <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>{formatDate(selectedBooking.event.event_date)} · {selectedBooking.event.venue}</div>
            </div>

            {/* QR */}
            <div style={{ background: "linear-gradient(135deg,#F5F3FF,#EDE9FE)", borderRadius: 20, padding: 20, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #DDD6FE" }}>
              <div style={{ width: 180, height: 180, background: "linear-gradient(135deg,#7C3AED,#F59E0B)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, boxShadow: "0 8px 32px rgba(124,58,237,0.3)" }}>🎫</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Kategori Tiket", value: selectedBooking.ticket.name },
                { label: "Jumlah", value: `×${selectedBooking.quantity}` },
                { label: "Total Bayar", value: formatPrice(selectedBooking.total_price) },
                { label: "Status", value: "✅ Aktif" },
              ].map((item, i) => (
                <div key={i} style={{ background: "#F5F3FF", borderRadius: 12, padding: "12px 14px", border: "1px solid #EDE9FE" }}>
                  <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 800, marginBottom: 4, letterSpacing: "0.5px" }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#1F2937" }}>{item.value}</div>
                </div>
              ))}
            </div>

            <button className="btn-ghost" onClick={() => setSelectedBooking(null)} style={{ width: "100%", padding: "12px 0", fontSize: 14 }}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
