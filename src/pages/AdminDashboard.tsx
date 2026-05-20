import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const dummyEvents = [
  { id: 1, title: "Coldplay: Music of the Spheres", category: "Konser", location: "Jakarta", venue: "GBK Stadium", event_date: "2026-06-14T19:00:00", status: "active", total_tickets: 50000, sold_tickets: 35000, image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop" },
  { id: 2, title: "Jakarta Jazz Festival 2026", category: "Festival", location: "Jakarta", venue: "Ancol Beach City", event_date: "2026-07-22T17:00:00", status: "active", total_tickets: 20000, sold_tickets: 8500, image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=200&fit=crop" },
  { id: 3, title: "Soundrenaline 2026", category: "Festival", location: "Bali", venue: "GWK", event_date: "2026-08-30T14:00:00", status: "active", total_tickets: 30000, sold_tickets: 12000, image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=200&fit=crop" },
];

const dummyBookings = [
  { id: 1, booking_code: "TKT-2026-AX9K2L", user: { name: "Ayu Rahayu", email: "ayu@gmail.com" }, event: { title: "Coldplay Jakarta" }, ticket: { name: "VIP" }, quantity: 2, total_price: 3000000, status: "paid", created_at: "2026-05-10T10:00:00" },
  { id: 2, booking_code: "TKT-2026-BZ7M4N", user: { name: "Bagas Hendra", email: "bagas@gmail.com" }, event: { title: "Jazz Festival" }, ticket: { name: "Festival" }, quantity: 3, total_price: 1350000, status: "paid", created_at: "2026-05-11T14:00:00" },
  { id: 3, booking_code: "TKT-2026-CY5P8Q", user: { name: "Citra Ningrum", email: "citra@gmail.com" }, event: { title: "Soundrenaline" }, ticket: { name: "VVIP" }, quantity: 1, total_price: 3000000, status: "cancelled", created_at: "2026-05-12T09:00:00" },
];

const monthlyData = [
  { month: "Jan", revenue: 12000000 }, { month: "Feb", revenue: 18000000 },
  { month: "Mar", revenue: 25000000 }, { month: "Apr", revenue: 20000000 },
  { month: "Mei", revenue: 35000000 }, { month: "Jun", revenue: 28000000 },
];

const emptyForm = { title: "", description: "", category: "Konser", location: "", venue: "", event_date: "", total_tickets: "", image: "" };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "bookings" | "report">("overview");
  const [events, setEvents] = useState(dummyEvents);
  const [bookings, setBookings] = useState(dummyBookings);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [searchEvent, setSearchEvent] = useState("");
  const [searchBooking, setSearchBooking] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animateBars, setAnimateBars] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkWidth = () => setSidebarOpen(window.innerWidth >= 768);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    fetchEvents();
    fetchBookings();
    setTimeout(() => setAnimateBars(true), 500);

    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => { window.removeEventListener("resize", checkWidth); document.removeEventListener("click", handleClick); };
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/admin/events", { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.data?.data?.length > 0) setEvents(res.data.data.data);
    } catch { }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/admin/bookings", { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.data?.data?.length > 0) setBookings(res.data.data.data);
    } catch { }
  };

  const handleSaveEvent = async () => {
    if (!form.title || !form.location || !form.venue || !form.event_date) { toast.error("Semua field wajib diisi!"); return; }
    setLoading(true);
    try {
      if (editEvent) {
        await axios.put(`/api/admin/events/${editEvent.id}`, form, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Event berhasil diupdate! ✅");
      } else {
        await axios.post("/api/admin/events", form, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Event berhasil dibuat! 🎉");
      }
      setShowModal(false); setForm(emptyForm); setEditEvent(null);
      fetchEvents();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan!");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/admin/events/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Event berhasil dihapus!");
      setDeleteConfirm(null);
      fetchEvents();
    } catch { toast.error("Gagal menghapus!"); }
  };

  const handleLogout = async () => {
    try { await axios.post("/api/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } }); } catch { }
    localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/?login=true");
  };

  // ── FIX REVENUE NaN: pastikan total_price selalu number ──
  const toNum = (v: any) => Number(v) || 0;
  const totalRevenue = bookings.filter(b => b.status === "paid").reduce((s, b) => s + toNum(b.total_price), 0);
  const paidBookings = bookings.filter(b => b.status === "paid").length;
  const formatPrice = (p: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);
  const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchEvent.toLowerCase()));
  const filteredBookings = bookings.filter(b =>
    b.booking_code.toLowerCase().includes(searchBooking.toLowerCase()) ||
    b.user.name.toLowerCase().includes(searchBooking.toLowerCase())
  );
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // ── DOWNLOAD LAPORAN CSV ──
  const downloadCSV = () => {
    const headers = ["Kode Booking", "Nama User", "Email", "Event", "Tiket", "Qty", "Total", "Status", "Tanggal"];
    const rows = bookings.map(b => [
      b.booking_code,
      b.user.name,
      b.user.email,
      b.event.title,
      b.ticket.name,
      b.quantity,
      toNum(b.total_price),
      b.status,
      formatDate(b.created_at),
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-tiketin-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Laporan berhasil didownload! 📊");
  };

  // ── DOWNLOAD LAPORAN TXT (summary) ──
  const downloadSummary = () => {
    const lines = [
      "===== LAPORAN TIKETIN =====",
      `Tanggal: ${new Date().toLocaleDateString("id-ID")}`,
      "",
      `Total Revenue: ${formatPrice(totalRevenue)}`,
      `Total Booking: ${bookings.length}`,
      `Booking Berhasil: ${paidBookings}`,
      `Booking Dibatal: ${bookings.length - paidBookings}`,
      `Total Event Aktif: ${events.length}`,
      `Konversi: ${bookings.length > 0 ? Math.round((paidBookings / bookings.length) * 100) : 0}%`,
      "",
      "===== DETAIL BOOKING =====",
      ...bookings.map(b => `${b.booking_code} | ${b.user.name} | ${b.event.title} | ${b.ticket.name} | ${formatPrice(toNum(b.total_price))} | ${b.status}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ringkasan-tiketin-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Ringkasan berhasil didownload! 📄");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3FF", fontFamily: "'Nunito', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');

        @keyframes slide-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes wiggle { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
        @keyframes modal-in { from{opacity:0;transform:scale(0.93) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slide-in { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @keyframes dropdown-in { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

        .wiggle { animation:wiggle 2s ease-in-out infinite; }
        .gradient-text { background:linear-gradient(135deg,#7C3AED,#F59E0B); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

        .sidebar-item { display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:14px; cursor:pointer; font-weight:700; font-size:14px; transition:all 0.2s; color:#6B7280; margin-bottom:4px; }
        .sidebar-item:hover { background:#EDE9FE; color:#7C3AED; }
        .sidebar-item.active { background:linear-gradient(135deg,#7C3AED,#9333EA); color:white; box-shadow:0 6px 20px rgba(124,58,237,0.3); }

        .stat-card { border-radius:16px; padding:16px; border:1.5px solid #EDE9FE; background:white; transition:all 0.3s; animation:slide-up 0.5s ease both; box-shadow:0 2px 12px rgba(124,58,237,0.06); }
        .stat-card:hover { border-color:#7C3AED; transform:translateY(-3px); }

        .btn-primary { background:linear-gradient(135deg,#7C3AED,#9333EA); color:white; border:none; border-radius:12px; font-weight:800; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(124,58,237,0.35); }
        .btn-primary:disabled { opacity:0.6; cursor:not-allowed; transform:none; }

        .btn-ghost { background:white; color:#7C3AED; border:1.5px solid #DDD6FE; border-radius:12px; font-weight:700; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .btn-ghost:hover { background:#EDE9FE; }

        .btn-danger { background:#FEF2F2; color:#DC2626; border:1.5px solid #FECACA; border-radius:12px; font-weight:800; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .btn-danger:hover { background:#DC2626; color:white; border-color:#DC2626; }

        .btn-download { background:linear-gradient(135deg,#059669,#047857); color:white; border:none; border-radius:12px; font-weight:800; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .btn-download:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(5,150,105,0.35); }

        .tab-btn { padding:9px 16px; border-radius:50px; border:none; font-weight:800; font-size:12px; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; white-space:nowrap; }
        .tab-btn.active { background:linear-gradient(135deg,#7C3AED,#9333EA); color:white; box-shadow:0 4px 14px rgba(124,58,237,0.3); }
        .tab-btn:not(.active) { background:white; color:#9CA3AF; border:1.5px solid #E5E7EB; }
        .tab-btn:not(.active):hover { color:#7C3AED; background:#F5F3FF; }

        .input-field { width:100%; padding:11px 14px; border-radius:12px; border:1.5px solid #DDD6FE; background:#FAFAFA; color:#1F2937; font-size:14px; font-weight:600; outline:none; box-sizing:border-box; font-family:'Nunito',sans-serif; transition:border-color 0.2s; }
        .input-field:focus { border-color:#7C3AED; background:white; }
        .input-field::placeholder { color:#9CA3AF; }

        .status-paid { background:#ECFDF5; color:#059669; border:1px solid #A7F3D0; border-radius:50px; padding:3px 8px; font-size:10px; font-weight:800; display:inline-block; }
        .status-cancelled { background:#FEF2F2; color:#DC2626; border:1px solid #FECACA; border-radius:50px; padding:3px 8px; font-size:10px; font-weight:800; display:inline-block; }
        .status-active { background:#EDE9FE; color:#7C3AED; border:1px solid #DDD6FE; border-radius:50px; padding:3px 8px; font-size:10px; font-weight:800; display:inline-block; }

        .modal-box { animation:modal-in 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .modal-overlay { position:fixed; inset:0; background:rgba(109,40,217,0.15); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:200; padding:16px; }
        .dropdown-menu { animation:dropdown-in 0.2s ease; }

        .sidebar-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:90; backdrop-filter:blur(4px); }
        .mobile-sidebar { animation:slide-in 0.3s ease; }

        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
        .overview-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .report-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

        @media (max-width:768px) {
          .stats-grid { grid-template-columns:repeat(2,1fr) !important; }
          .overview-grid { grid-template-columns:1fr !important; }
          .report-grid { grid-template-columns:1fr !important; }
          .admin-content { padding:14px !important; }
          .admin-navbar { padding:0 14px !important; }
          .hide-mobile { display:none !important; }
          .event-card-mobile { flex-direction:column !important; }
          .tabs-scroll { overflow-x:auto; padding-bottom:4px; }
        }

        .bottom-nav { display:none; }
        @media (max-width:768px) {
          .bottom-nav { display:flex !important; position:fixed; bottom:0; left:0; right:0; background:white; border-top:1.5px solid #EDE9FE; z-index:80; padding:8px 0 12px; box-shadow:0 -4px 20px rgba(124,58,237,0.1); }
        }
      `}</style>

      {/* SIDEBAR OVERLAY mobile */}
      {sidebarOpen && isMobile && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <div className={sidebarOpen && isMobile ? "mobile-sidebar" : ""} style={{
        width: 230, background: "white", borderRight: "1.5px solid #EDE9FE",
        minHeight: "100vh", padding: "20px 12px", flexShrink: 0,
        boxShadow: "4px 0 20px rgba(124,58,237,0.06)",
        position: isMobile ? "fixed" : "relative",
        top: 0, left: 0, zIndex: 100, height: "100vh", overflowY: "auto",
        display: isMobile && !sidebarOpen ? "none" : "block",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, paddingLeft: 4 }}>
          <div className="wiggle" style={{ display: "inline-block", flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#7C3AED,#F59E0B)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎫</div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif" }} className="gradient-text">TiketIn Admin</div>
          {isMobile && <button onClick={() => setSidebarOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9CA3AF" }}>✕</button>}
        </div>

        <div style={{ fontSize: 10, fontWeight: 800, color: "#9CA3AF", letterSpacing: "2px", marginBottom: 8, paddingLeft: 8 }}>MENU</div>
        {[
          { icon: "📊", label: "Overview", tab: "overview" },
          { icon: "🎪", label: "Kelola Event", tab: "events" },
          { icon: "🎫", label: "Booking", tab: "bookings" },
          { icon: "📈", label: "Laporan", tab: "report" },
        ].map(item => (
          <div key={item.tab} className={`sidebar-item ${activeTab === item.tab ? "active" : ""}`}
            onClick={() => { setActiveTab(item.tab as any); if (isMobile) setSidebarOpen(false); }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}

        <div style={{ marginTop: 12 }}>
          <div className="sidebar-item" onClick={handleLogout} style={{ color: "#DC2626" }}
            onMouseOver={e => (e.currentTarget.style.background = "#FEF2F2")}
            onMouseOut={e => (e.currentTarget.style.background = "transparent")}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>🚪</span>
            <span>Logout</span>
          </div>
        </div>

        <div style={{ marginTop: 24, background: "linear-gradient(135deg,#7C3AED,#9333EA)", borderRadius: 18, padding: "16px 14px", boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.85)", marginBottom: 4 }}>⚡ Admin Panel</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "white" }}>{events.length}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>total event aktif</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, minWidth: 0, paddingBottom: isMobile ? 72 : 0 }}>

        {/* NAVBAR */}
        <div className="admin-navbar" style={{ background: "white", borderBottom: "1.5px solid #EDE9FE", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Hamburger — hanya di mobile */}
            {isMobile && (
              <button onClick={e => { e.stopPropagation(); setSidebarOpen(!sidebarOpen); }} style={{ background: "#F5F3FF", border: "1.5px solid #DDD6FE", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 16, color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>☰</button>
            )}
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#1F2937" }}>Admin Dashboard</div>
              <div style={{ fontSize: 10, color: "#7C3AED", fontWeight: 700 }}>⚡ Full Access</div>
            </div>
          </div>

          {/* ── AVATAR DROPDOWN — ganti tombol 🏠 ── */}
          <div ref={userMenuRef} style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
            <div onClick={() => setShowUserMenu(!showUserMenu)} style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F3FF", border: "1.5px solid #DDD6FE", borderRadius: 12, padding: "7px 12px", cursor: "pointer", userSelect: "none" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "white", flexShrink: 0 }}>
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="hide-mobile">
                <div style={{ fontSize: 12, fontWeight: 800, color: "#1F2937" }}>{user?.name?.split(" ")[0] || "Admin"}</div>
                <div style={{ fontSize: 9, color: "#7C3AED", fontWeight: 800 }}>⚡ Administrator</div>
              </div>
              <span style={{ color: "#9CA3AF", fontSize: 10, marginLeft: 2 }}>{showUserMenu ? "▲" : "▼"}</span>
            </div>

            {/* Dropdown */}
            {showUserMenu && (
              <div className="dropdown-menu" style={{ position: "absolute", right: 0, top: 50, width: 180, background: "white", borderRadius: 16, padding: 8, zIndex: 200, boxShadow: "0 8px 32px rgba(124,58,237,0.18)", border: "1.5px solid #EDE9FE" }}>
                <div style={{ padding: "8px 12px", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#1F2937" }}>{user?.name || "Admin"}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{user?.email || "admin@tiketin.com"}</div>
                </div>
                <div style={{ height: 1, background: "#EDE9FE", marginBottom: 4 }} />
                
                <button onClick={() => { handleLogout(); setShowUserMenu(false); }} style={{ width: "100%", textAlign: "left", padding: "9px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#DC2626", fontFamily: "'Nunito',sans-serif", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}
                  onMouseOver={e => (e.currentTarget.style.background = "#FEF2F2")}
                  onMouseOut={e => (e.currentTarget.style.background = "none")}>
                  🚪 <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="admin-content" style={{ padding: "20px 24px" }}>

          {/* TABS */}
          <div className="tabs-scroll" style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[
              { id: "overview", label: "📊 Overview" },
              { id: "events", label: "🎪 Event" },
              { id: "bookings", label: "🎫 Booking" },
              { id: "report", label: "📈 Laporan" },
            ].map(t => (
              <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id as any)}>{t.label}</button>
            ))}
          </div>

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1F2937", marginBottom: 2 }}>Halo, {user?.name}! 👋</h2>
                <p style={{ color: "#9CA3AF", fontWeight: 600, fontSize: 13 }}>Ringkasan platform TiketIn hari ini</p>
              </div>

              <div className="stats-grid" style={{ marginBottom: 20 }}>
                {[
                  { label: "Revenue", value: formatPrice(totalRevenue), icon: "💰", color: "#D97706", bg: "#FFFBEB" },
                  { label: "Booking", value: bookings.length, icon: "🎫", color: "#7C3AED", bg: "#F5F3FF" },
                  { label: "Sukses", value: paidBookings, icon: "✅", color: "#059669", bg: "#ECFDF5" },
                  { label: "Event", value: events.length, icon: "🎪", color: "#7C3AED", bg: "#EDE9FE" },
                ].map((s, i) => (
                  <div key={i} className="stat-card" style={{ background: s.bg }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: i === 0 ? 13 : 26, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700, marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="overview-grid">
                <div style={{ background: "white", borderRadius: 16, padding: 18, border: "1.5px solid #EDE9FE", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 900, color: "#1F2937", marginBottom: 14 }}>🎪 Event Terbaru</h3>
                  {events.slice(0, 3).map((ev, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < 2 ? "1px solid #F3F4F6" : "none" }}>
                      <img src={ev.image} style={{ width: 40, height: 32, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} alt={ev.title} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#1F2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</div>
                        <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>{Math.round((ev.sold_tickets / ev.total_tickets) * 100)}% terjual</div>
                      </div>
                      <span className="status-active">Aktif</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: "white", borderRadius: 16, padding: 18, border: "1.5px solid #EDE9FE", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 900, color: "#1F2937", marginBottom: 14 }}>🎫 Booking Terbaru</h3>
                  {bookings.slice(0, 3).map((b, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < 2 ? "1px solid #F3F4F6" : "none" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12, color: "white", flexShrink: 0 }}>{b.user.name.charAt(0)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#1F2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.user.name}</div>
                        <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>{b.booking_code}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 900, color: "#7C3AED" }}>{formatPrice(toNum(b.total_price))}</div>
                        <span className={`status-${b.status}`}>{b.status === "paid" ? "✅" : "❌"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── KELOLA EVENT ── */}
          {activeTab === "events" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1F2937", marginBottom: 2 }}>🎪 Kelola Event</h2>
                  <p style={{ color: "#9CA3AF", fontWeight: 600, fontSize: 12 }}>{events.length} event</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input style={{ background: "white", border: "1.5px solid #DDD6FE", borderRadius: 12, padding: "8px 14px", color: "#1F2937", fontSize: 13, fontWeight: 600, outline: "none", fontFamily: "'Nunito',sans-serif", width: 180 }} placeholder="🔍 Cari event..." value={searchEvent} onChange={e => setSearchEvent(e.target.value)} />
                  <button className="btn-primary" onClick={() => { setShowModal(true); setEditEvent(null); setForm(emptyForm); }} style={{ padding: "9px 18px", fontSize: 13 }}>+ Tambah</button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredEvents.map((ev) => (
                  <div key={ev.id} style={{ background: "white", borderRadius: 16, border: "1.5px solid #EDE9FE", overflow: "hidden", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                    <div className="event-card-mobile" style={{ display: "flex" }}>
                      <img src={ev.image} style={{ width: 110, height: 90, objectFit: "cover", flexShrink: 0 }} alt={ev.title} />
                      <div style={{ flex: 1, padding: "12px 14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 900, color: "#1F2937", lineHeight: 1.3, marginBottom: 2 }}>{ev.title}</div>
                            <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>📍 {ev.venue} · {formatDate(ev.event_date)}</div>
                          </div>
                          <span style={{ background: "#EDE9FE", color: "#7C3AED", borderRadius: 50, padding: "2px 8px", fontSize: 10, fontWeight: 800, flexShrink: 0, marginLeft: 8 }}>{ev.category}</span>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 3 }}>{ev.sold_tickets.toLocaleString()} / {ev.total_tickets.toLocaleString()} tiket</div>
                          <div style={{ height: 5, background: "#EDE9FE", borderRadius: 99 }}>
                            <div style={{ height: "100%", width: `${Math.min((ev.sold_tickets / ev.total_tickets) * 100, 100)}%`, background: "linear-gradient(90deg,#7C3AED,#F59E0B)", borderRadius: 99 }} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          {deleteConfirm === ev.id ? (
                            <>
                              <button className="btn-danger" onClick={() => handleDelete(ev.id)} style={{ padding: "5px 12px", fontSize: 11 }}>Hapus</button>
                              <button className="btn-ghost" onClick={() => setDeleteConfirm(null)} style={{ padding: "5px 12px", fontSize: 11 }}>Batal</button>
                            </>
                          ) : (
                            <>
                              <button className="btn-primary" onClick={() => { setEditEvent(ev); setForm({ title: ev.title, description: "", category: ev.category, location: ev.location, venue: ev.venue, event_date: ev.event_date.slice(0, 16), total_tickets: ev.total_tickets.toString(), image: ev.image }); setShowModal(true); }} style={{ padding: "5px 12px", fontSize: 11 }}>✏️ Edit</button>
                              <button className="btn-danger" onClick={() => setDeleteConfirm(ev.id)} style={{ padding: "5px 12px", fontSize: 11 }}>🗑️</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BOOKING ── */}
          {activeTab === "bookings" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1F2937", marginBottom: 2 }}>🎫 Semua Booking</h2>
                  <p style={{ color: "#9CA3AF", fontWeight: 600, fontSize: 12 }}>{bookings.length} transaksi</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <input style={{ background: "white", border: "1.5px solid #DDD6FE", borderRadius: 12, padding: "8px 14px", color: "#1F2937", fontSize: 13, fontWeight: 600, outline: "none", fontFamily: "'Nunito',sans-serif", width: 200 }} placeholder="🔍 Cari..." value={searchBooking} onChange={e => setSearchBooking(e.target.value)} />
                  <button className="btn-download" onClick={downloadCSV} style={{ padding: "9px 16px", fontSize: 12 }}>📥 CSV</button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredBookings.map((b) => (
                  <div key={b.id} style={{ background: "white", borderRadius: 14, border: "1.5px solid #EDE9FE", padding: "14px 16px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#7C3AED", marginBottom: 2 }}>{b.booking_code}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{formatDate(b.created_at)}</div>
                      </div>
                      <span className={`status-${b.status}`}>{b.status === "paid" ? "✅ Sukses" : "❌ Batal"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#1F2937" }}>{b.user.name}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{b.event.title.slice(0, 20)}... · {b.ticket.name} ×{b.quantity}</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: "#7C3AED" }}>{formatPrice(toNum(b.total_price))}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── LAPORAN ── */}
          {activeTab === "report" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1F2937", marginBottom: 2 }}>📈 Laporan & Analitik</h2>
                  <p style={{ color: "#9CA3AF", fontWeight: 600, fontSize: 12 }}>Performa penjualan TiketIn</p>
                </div>
                {/* ── TOMBOL DOWNLOAD ── */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-download" onClick={downloadCSV} style={{ padding: "9px 16px", fontSize: 12 }}>
                    📥 Download CSV
                  </button>
                  <button className="btn-ghost" onClick={downloadSummary} style={{ padding: "9px 16px", fontSize: 12 }}>
                    📄 Ringkasan
                  </button>
                </div>
              </div>

              <div className="report-grid" style={{ marginBottom: 16 }}>
                <div style={{ background: "white", borderRadius: 16, padding: 18, border: "1.5px solid #EDE9FE", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 900, color: "#1F2937", marginBottom: 16 }}>💰 Revenue 6 Bulan</h3>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 130 }}>
                    {monthlyData.map((d, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                        <div style={{ width: "100%", flex: 1, display: "flex", alignItems: "flex-end" }}>
                          <div style={{ width: "100%", height: animateBars ? `${(d.revenue / maxRevenue) * 100}%` : "0%", background: i === monthlyData.length - 1 ? "linear-gradient(180deg,#7C3AED,#9333EA)" : "linear-gradient(180deg,#DDD6FE,#EDE9FE)", borderRadius: "6px 6px 0 0", transition: `height 0.8s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1}s` }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: i === monthlyData.length - 1 ? "#7C3AED" : "#9CA3AF" }}>{d.month}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, padding: "8px 12px", background: "#F5F3FF", borderRadius: 10, fontSize: 11, fontWeight: 800, color: "#7C3AED" }}>
                    Total: {formatPrice(monthlyData.reduce((s, d) => s + d.revenue, 0))}
                  </div>
                </div>

                <div style={{ background: "white", borderRadius: 16, padding: 18, border: "1.5px solid #EDE9FE", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 900, color: "#1F2937", marginBottom: 14 }}>📊 Ringkasan</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { label: "Total Revenue", value: formatPrice(totalRevenue), color: "#D97706" },
                      { label: "Booking Berhasil", value: `${paidBookings} transaksi`, color: "#059669" },
                      { label: "Booking Batal", value: `${bookings.length - paidBookings} transaksi`, color: "#DC2626" },
                      { label: "Event Aktif", value: `${events.length} event`, color: "#7C3AED" },
                      { label: "Konversi", value: `${bookings.length > 0 ? Math.round((paidBookings / bookings.length) * 100) : 0}%`, color: "#7C3AED" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: "#FAFAFA", borderRadius: 10, border: "1px solid #F3F4F6" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#6B7280" }}>{item.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 900, color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ background: "white", borderRadius: 16, padding: 18, border: "1.5px solid #EDE9FE", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: "#1F2937", marginBottom: 14 }}>🏆 Event Terlaris</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[...events].sort((a, b) => b.sold_tickets - a.sold_tickets).map((ev, i) => (
                    <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: i === 0 ? "linear-gradient(135deg,#FFD700,#FFA500)" : i === 1 ? "linear-gradient(135deg,#D0D0D0,#A0A0A0)" : "linear-gradient(135deg,#CD7F32,#A0522D)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 11, color: "white", flexShrink: 0 }}>{i + 1}</div>
                      <img src={ev.image} style={{ width: 44, height: 32, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} alt={ev.title} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#1F2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</div>
                        <div style={{ height: 5, background: "#EDE9FE", borderRadius: 99, marginTop: 5 }}>
                          <div style={{ height: "100%", width: `${(ev.sold_tickets / ev.total_tickets) * 100}%`, background: "linear-gradient(90deg,#7C3AED,#F59E0B)", borderRadius: 99 }} />
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: "#7C3AED" }}>{ev.sold_tickets.toLocaleString()}</div>
                        <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>terjual</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM NAV mobile */}
      <div className="bottom-nav" style={{ justifyContent: "space-around", alignItems: "center" }}>
        {[
          { icon: "📊", label: "Overview", tab: "overview" },
          { icon: "🎪", label: "Event", tab: "events" },
          { icon: "🎫", label: "Booking", tab: "bookings" },
          { icon: "📈", label: "Laporan", tab: "report" },
        ].map((item) => (
          <button key={item.tab} onClick={() => setActiveTab(item.tab as any)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", padding: "4px 12px", fontFamily: "'Nunito',sans-serif" }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: activeTab === item.tab ? "#7C3AED" : "#6B7280" }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* MODAL TAMBAH/EDIT EVENT */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ background: "white", border: "1.5px solid #DDD6FE", borderRadius: 24, padding: "24px 20px", maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(124,58,237,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#1F2937" }}>{editEvent ? "✏️ Edit Event" : "🎪 Tambah Event"}</h3>
              <button onClick={() => setShowModal(false)} style={{ width: 30, height: 30, borderRadius: "50%", background: "#F5F3FF", border: "1.5px solid #DDD6FE", cursor: "pointer", fontSize: 14, color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Judul Event", key: "title", placeholder: "Nama event" },
                { label: "Deskripsi", key: "description", placeholder: "Deskripsi event", textarea: true },
                { label: "Lokasi (Kota)", key: "location", placeholder: "Jakarta, Bali, dll" },
                { label: "Venue", key: "venue", placeholder: "Nama venue" },
                { label: "Total Tiket", key: "total_tickets", placeholder: "Jumlah tiket", type: "number" },
                { label: "URL Gambar", key: "image", placeholder: "https://..." },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>{field.label}</label>
                  {field.textarea ? (
                    <textarea className="input-field" placeholder={field.placeholder} value={(form as any)[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} rows={3} style={{ resize: "vertical" }} />
                  ) : (
                    <input className="input-field" type={field.type || "text"} placeholder={field.placeholder} value={(form as any)[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} />
                  )}
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Kategori</label>
                <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {["Konser", "Festival", "Olahraga", "Pameran", "Lainnya"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tanggal & Waktu</label>
                <input className="input-field" type="datetime-local" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button className="btn-primary" onClick={handleSaveEvent} disabled={loading} style={{ flex: 1, padding: "12px 0", fontSize: 14 }}>
                  {loading ? "⏳ Menyimpan..." : editEvent ? "✅ Update" : "🎉 Tambah"}
                </button>
                <button className="btn-ghost" onClick={() => setShowModal(false)} style={{ padding: "12px 20px", fontSize: 14 }}>Batal</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
