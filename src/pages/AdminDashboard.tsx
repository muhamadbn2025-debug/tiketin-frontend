import { useEffect, useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [animateBars, setAnimateBars] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
    fetchBookings();
    setTimeout(() => setAnimateBars(true), 500);
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
    localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/");
  };

  const totalRevenue = bookings.filter(b => b.status === "paid").reduce((s, b) => s + b.total_price, 0);
  const paidBookings = bookings.filter(b => b.status === "paid").length;
  const formatPrice = (p: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);
  const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchEvent.toLowerCase()));
  const filteredBookings = bookings.filter(b => b.booking_code.toLowerCase().includes(searchBooking.toLowerCase()) || b.user.name.toLowerCase().includes(searchBooking.toLowerCase()));

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3FF", fontFamily: "'Nunito', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Syne:wght@700;800;900&display=swap');

        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes slide-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes wiggle { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
        @keyframes modal-in { from{opacity:0;transform:scale(0.93) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }

        .wiggle { animation:wiggle 2s ease-in-out infinite; }
        .float-anim { animation:float 3s ease-in-out infinite; }

        .gradient-text {
          background:linear-gradient(135deg,#7C3AED,#F59E0B);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }

        .sidebar-item {
          display:flex; align-items:center; gap:12px; padding:11px 14px;
          border-radius:14px; cursor:pointer; font-weight:700; font-size:14px;
          transition:all 0.2s; color:#6B7280; margin-bottom:4px;
        }
        .sidebar-item:hover { background:#EDE9FE; color:#7C3AED; }
        .sidebar-item.active { background:linear-gradient(135deg,#7C3AED,#9333EA); color:white; box-shadow:0 6px 20px rgba(124,58,237,0.3); }

        .stat-card {
          border-radius:20px; padding:22px; border:1.5px solid #EDE9FE;
          background:white; transition:all 0.3s; animation:slide-up 0.5s ease both;
          box-shadow:0 2px 12px rgba(124,58,237,0.06);
        }
        .stat-card:hover { border-color:#7C3AED; transform:translateY(-4px); box-shadow:0 12px 32px rgba(124,58,237,0.12); }

        .btn-primary { background:linear-gradient(135deg,#7C3AED,#9333EA); color:white; border:none; border-radius:12px; font-weight:800; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(124,58,237,0.35); }
        .btn-primary:disabled { opacity:0.6; cursor:not-allowed; transform:none; }

        .btn-ghost { background:white; color:#7C3AED; border:1.5px solid #DDD6FE; border-radius:12px; font-weight:700; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .btn-ghost:hover { background:#EDE9FE; }

        .btn-danger { background:#FEF2F2; color:#DC2626; border:1.5px solid #FECACA; border-radius:12px; font-weight:800; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .btn-danger:hover { background:#DC2626; color:white; border-color:#DC2626; }

        .tab-btn { padding:10px 22px; border-radius:50px; border:none; font-weight:800; font-size:13px; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .tab-btn.active { background:linear-gradient(135deg,#7C3AED,#9333EA); color:white; box-shadow:0 4px 14px rgba(124,58,237,0.3); }
        .tab-btn:not(.active) { background:white; color:#9CA3AF; border:1.5px solid #E5E7EB; }
        .tab-btn:not(.active):hover { color:#7C3AED; border-color:#DDD6FE; background:#F5F3FF; }

        .input-field { width:100%; padding:11px 14px; border-radius:12px; border:1.5px solid #DDD6FE; background:#FAFAFA; color:#1F2937; font-size:14px; font-weight:600; outline:none; box-sizing:border-box; font-family:'Nunito',sans-serif; transition:border-color 0.2s; }
        .input-field:focus { border-color:#7C3AED; background:white; }
        .input-field::placeholder { color:#9CA3AF; }

        .table-row { display:grid; padding:14px 18px; border-radius:12px; transition:background 0.2s; }
        .table-row:hover { background:#F5F3FF; }

        .status-paid { background:#ECFDF5; color:#059669; border:1px solid #A7F3D0; border-radius:50px; padding:3px 10px; font-size:11px; font-weight:800; }
        .status-cancelled { background:#FEF2F2; color:#DC2626; border:1px solid #FECACA; border-radius:50px; padding:3px 10px; font-size:11px; font-weight:800; }
        .status-active { background:#EDE9FE; color:#7C3AED; border:1px solid #DDD6FE; border-radius:50px; padding:3px 10px; font-size:11px; font-weight:800; }

        .search-input { background:white; border:1.5px solid #DDD6FE; border-radius:12px; padding:10px 16px; color:#1F2937; font-size:14px; font-weight:600; outline:none; font-family:'Nunito',sans-serif; transition:border-color 0.2s; }
        .search-input:focus { border-color:#7C3AED; }
        .search-input::placeholder { color:#9CA3AF; }

        .modal-box { animation:modal-in 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .modal-overlay { position:fixed; inset:0; background:rgba(109,40,217,0.15); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:200; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{ width: sidebarOpen ? 240 : 72, background: "white", borderRight: "1.5px solid #EDE9FE", minHeight: "100vh", padding: "24px 14px", flexShrink: 0, transition: "width 0.3s ease", overflow: "hidden", boxShadow: "4px 0 20px rgba(124,58,237,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, paddingLeft: 4 }}>
          <div className="wiggle" style={{ display: "inline-block", flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#7C3AED,#F59E0B)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 14px rgba(124,58,237,0.35)" }}>🎫</div>
          </div>
          {sidebarOpen && <div style={{ fontSize: 17, fontWeight: 900, fontFamily: "'Syne',sans-serif" }} className="gradient-text">TiketIn Admin</div>}
        </div>

        {sidebarOpen && <div style={{ fontSize: 10, fontWeight: 800, color: "#9CA3AF", letterSpacing: "2px", marginBottom: 10, paddingLeft: 8 }}>MENU</div>}
        {[
          { icon: "📊", label: "Overview", tab: "overview" },
          { icon: "🎪", label: "Kelola Event", tab: "events" },
          { icon: "🎫", label: "Booking", tab: "bookings" },
          { icon: "📈", label: "Laporan", tab: "report" },
        ].map(item => (
          <div key={item.tab} className={`sidebar-item ${activeTab === item.tab ? "active" : ""}`}
            onClick={() => setActiveTab(item.tab as any)}
            style={{ justifyContent: sidebarOpen ? "flex-start" : "center" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
            {sidebarOpen && <span>{item.label}</span>}
          </div>
        ))}

        <div style={{ marginTop: 16 }}>
          <div className="sidebar-item" onClick={handleLogout} style={{ justifyContent: sidebarOpen ? "flex-start" : "center", color: "#DC2626" }}
            onMouseOver={e => (e.currentTarget.style.background = "#FEF2F2")}
            onMouseOut={e => (e.currentTarget.style.background = "transparent")}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </div>
        </div>

        {sidebarOpen && (
          <div style={{ marginTop: 32, background: "linear-gradient(135deg,#7C3AED,#9333EA)", borderRadius: 20, padding: "18px 16px", boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.85)", marginBottom: 6 }}>⚡ Admin Panel</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "white" }}>{events.length}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>total event aktif</div>
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
              <div style={{ fontSize: 16, fontWeight: 900, color: "#1F2937" }}>Admin Dashboard</div>
              <div style={{ fontSize: 11, color: "#7C3AED", fontWeight: 700 }}>⚡ Full Access</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => navigate("/")} className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>🏠 Beranda</button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F5F3FF", border: "1.5px solid #DDD6FE", borderRadius: 12, padding: "8px 14px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "white" }}>
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1F2937" }}>{user?.name || "Admin"}</div>
                <div style={{ fontSize: 10, color: "#7C3AED", fontWeight: 800 }}>⚡ Administrator</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "28px 32px" }}>

          {/* TABS */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {[
              { id: "overview", label: "📊 Overview" },
              { id: "events", label: "🎪 Kelola Event" },
              { id: "bookings", label: "🎫 Booking" },
              { id: "report", label: "📈 Laporan" },
            ].map(t => (
              <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id as any)}>{t.label}</button>
            ))}
          </div>

          {/* ===== OVERVIEW ===== */}
          {activeTab === "overview" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1F2937", marginBottom: 4 }}>Selamat datang, {user?.name}! 👋</h2>
                <p style={{ color: "#9CA3AF", fontWeight: 600 }}>Berikut ringkasan platform TiketIn hari ini</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Total Revenue", value: formatPrice(totalRevenue), icon: "💰", color: "#D97706", bg: "#FFFBEB", delay: "0s" },
                  { label: "Total Booking", value: bookings.length, icon: "🎫", color: "#7C3AED", bg: "#F5F3FF", delay: "0.08s" },
                  { label: "Booking Sukses", value: paidBookings, icon: "✅", color: "#059669", bg: "#ECFDF5", delay: "0.16s" },
                  { label: "Total Event", value: events.length, icon: "🎪", color: "#7C3AED", bg: "#EDE9FE", delay: "0.24s" },
                ].map((s, i) => (
                  <div key={i} className="stat-card" style={{ animationDelay: s.delay, background: s.bg }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                    <div style={{ fontSize: i === 0 ? 15 : 32, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 700, marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "white", borderRadius: 20, padding: 22, border: "1.5px solid #EDE9FE", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: "#1F2937", marginBottom: 16 }}>🎪 Event Terbaru</h3>
                  {events.slice(0, 3).map((ev, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 2 ? "1px solid #F3F4F6" : "none" }}>
                      <img src={ev.image} style={{ width: 44, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} alt={ev.title} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#1F2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{Math.round((ev.sold_tickets / ev.total_tickets) * 100)}% terjual</div>
                      </div>
                      <span className="status-active">Aktif</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: "white", borderRadius: 20, padding: 22, border: "1.5px solid #EDE9FE", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: "#1F2937", marginBottom: 16 }}>🎫 Booking Terbaru</h3>
                  {bookings.slice(0, 3).map((b, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 2 ? "1px solid #F3F4F6" : "none" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "white", flexShrink: 0 }}>
                        {b.user.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#1F2937" }}>{b.user.name}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{b.booking_code}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: "#7C3AED" }}>{formatPrice(b.total_price)}</div>
                        <span className={`status-${b.status}`}>{b.status === "paid" ? "Sukses" : "Batal"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== KELOLA EVENT ===== */}
          {activeTab === "events" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1F2937", marginBottom: 4 }}>🎪 Kelola Event</h2>
                  <p style={{ color: "#9CA3AF", fontWeight: 600 }}>{events.length} event tersedia</p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <input className="search-input" placeholder="🔍 Cari event..." value={searchEvent} onChange={e => setSearchEvent(e.target.value)} style={{ width: 220 }} />
                  <button className="btn-primary" onClick={() => { setShowModal(true); setEditEvent(null); setForm(emptyForm); }} style={{ padding: "10px 22px", fontSize: 14 }}>+ Tambah Event</button>
                </div>
              </div>

              <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #EDE9FE", overflow: "hidden", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 16, padding: "12px 20px", fontSize: 11, fontWeight: 800, color: "#9CA3AF", letterSpacing: "1px", textTransform: "uppercase", borderBottom: "1px solid #F3F4F6", background: "#FAFAFA" }}>
                  <span>Event</span><span>Kategori</span><span>Tanggal</span><span>Tiket Terjual</span><span>Aksi</span>
                </div>
                {filteredEvents.map((ev, i) => (
                  <div key={ev.id} className="table-row" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 16, borderBottom: i < filteredEvents.length - 1 ? "1px solid #F9FAFB" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <img src={ev.image} style={{ width: 48, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} alt={ev.title} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#1F2937" }}>{ev.title}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>📍 {ev.venue}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ background: "#EDE9FE", color: "#7C3AED", border: "1px solid #DDD6FE", borderRadius: 50, padding: "3px 10px", fontSize: 12, fontWeight: 800 }}>{ev.category}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", fontSize: 13, color: "#6B7280", fontWeight: 600 }}>{formatDate(ev.event_date)}</div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#1F2937" }}>{ev.sold_tickets.toLocaleString()} / {ev.total_tickets.toLocaleString()}</div>
                        <div style={{ height: 5, background: "#EDE9FE", borderRadius: 99, marginTop: 5, width: 100 }}>
                          <div style={{ height: "100%", width: `${Math.min((ev.sold_tickets / ev.total_tickets) * 100, 100)}%`, background: "linear-gradient(90deg,#7C3AED,#F59E0B)", borderRadius: 99 }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {deleteConfirm === ev.id ? (
                        <>
                          <button className="btn-danger" onClick={() => handleDelete(ev.id)} style={{ padding: "7px 14px", fontSize: 12 }}>Hapus</button>
                          <button className="btn-ghost" onClick={() => setDeleteConfirm(null)} style={{ padding: "7px 14px", fontSize: 12 }}>Batal</button>
                        </>
                      ) : (
                        <>
                          <button className="btn-primary" onClick={() => { setEditEvent(ev); setForm({ title: ev.title, description: "", category: ev.category, location: ev.location, venue: ev.venue, event_date: ev.event_date.slice(0, 16), total_tickets: ev.total_tickets.toString(), image: ev.image }); setShowModal(true); }} style={{ padding: "7px 14px", fontSize: 12 }}>✏️ Edit</button>
                          <button className="btn-danger" onClick={() => setDeleteConfirm(ev.id)} style={{ padding: "7px 14px", fontSize: 12 }}>🗑️</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== BOOKING ===== */}
          {activeTab === "bookings" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1F2937", marginBottom: 4 }}>🎫 Semua Booking</h2>
                  <p style={{ color: "#9CA3AF", fontWeight: 600 }}>{bookings.length} total transaksi</p>
                </div>
                <input className="search-input" placeholder="🔍 Cari booking / nama..." value={searchBooking} onChange={e => setSearchBooking(e.target.value)} style={{ width: 260 }} />
              </div>

              <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #EDE9FE", overflow: "hidden", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 1fr 1fr", gap: 12, padding: "12px 20px", fontSize: 11, fontWeight: 800, color: "#9CA3AF", letterSpacing: "1px", textTransform: "uppercase", borderBottom: "1px solid #F3F4F6", background: "#FAFAFA" }}>
                  <span>Kode Booking</span><span>Pengguna</span><span>Event</span><span>Tiket</span><span>Total</span><span>Status</span>
                </div>
                {filteredBookings.map((b, i) => (
                  <div key={b.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 1fr 1fr", gap: 12, padding: "14px 20px", borderBottom: i < filteredBookings.length - 1 ? "1px solid #F9FAFB" : "none", transition: "background 0.2s" }}
                    onMouseOver={e => (e.currentTarget.style.background = "#FAFAFA")}
                    onMouseOut={e => (e.currentTarget.style.background = "transparent")}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#7C3AED" }}>{b.booking_code}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{formatDate(b.created_at)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#1F2937" }}>{b.user.name}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{b.user.email}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", display: "flex", alignItems: "center" }}>{b.event.title.slice(0, 12)}...</div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ background: "#EDE9FE", color: "#7C3AED", border: "1px solid #DDD6FE", borderRadius: 50, padding: "2px 10px", fontSize: 11, fontWeight: 800 }}>{b.ticket.name} ×{b.quantity}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#7C3AED", display: "flex", alignItems: "center" }}>{formatPrice(b.total_price)}</div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span className={`status-${b.status}`}>{b.status === "paid" ? "✅ Sukses" : "❌ Batal"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== LAPORAN ===== */}
          {activeTab === "report" && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1F2937", marginBottom: 4 }}>📈 Laporan & Analitik</h2>
                <p style={{ color: "#9CA3AF", fontWeight: 600 }}>Performa penjualan TiketIn</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                {/* Bar chart */}
                <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1.5px solid #EDE9FE", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: "#1F2937", marginBottom: 20 }}>💰 Revenue 6 Bulan Terakhir</h3>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
                    {monthlyData.map((d, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%" }}>
                        <div style={{ width: "100%", flex: 1, display: "flex", alignItems: "flex-end" }}>
                          <div style={{
                            width: "100%",
                            height: animateBars ? `${(d.revenue / maxRevenue) * 100}%` : "0%",
                            background: i === monthlyData.length - 1 ? "linear-gradient(180deg,#7C3AED,#9333EA)" : "linear-gradient(180deg,#DDD6FE,#EDE9FE)",
                            borderRadius: "8px 8px 0 0",
                            transition: `height 0.8s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1}s`,
                            boxShadow: i === monthlyData.length - 1 ? "0 0 20px rgba(124,58,237,0.3)" : "none"
                          }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: i === monthlyData.length - 1 ? "#7C3AED" : "#9CA3AF" }}>{d.month}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, padding: "10px 14px", background: "#F5F3FF", borderRadius: 12, border: "1px solid #EDE9FE", fontSize: 12, fontWeight: 800, color: "#7C3AED" }}>
                    📈 Total 6 bulan: {formatPrice(monthlyData.reduce((s, d) => s + d.revenue, 0))}
                  </div>
                </div>

                {/* Summary */}
                <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1.5px solid #EDE9FE", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: "#1F2937", marginBottom: 20 }}>📊 Ringkasan</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { label: "Total Revenue", value: formatPrice(totalRevenue), color: "#D97706" },
                      { label: "Booking Berhasil", value: `${paidBookings} transaksi`, color: "#059669" },
                      { label: "Booking Dibatal", value: `${bookings.length - paidBookings} transaksi`, color: "#DC2626" },
                      { label: "Event Aktif", value: `${events.length} event`, color: "#7C3AED" },
                      { label: "Konversi", value: `${Math.round((paidBookings / bookings.length) * 100)}%`, color: "#7C3AED" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: "#FAFAFA", borderRadius: 12, border: "1px solid #F3F4F6" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#6B7280" }}>{item.label}</span>
                        <span style={{ fontSize: 14, fontWeight: 900, color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top events */}
              <div style={{ background: "white", borderRadius: 20, padding: 24, border: "1.5px solid #EDE9FE", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: "#1F2937", marginBottom: 20 }}>🏆 Event Terlaris</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {events.sort((a, b) => b.sold_tickets - a.sold_tickets).map((ev, i) => (
                    <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? "linear-gradient(135deg,#FFD700,#FFA500)" : i === 1 ? "linear-gradient(135deg,#D0D0D0,#A0A0A0)" : "linear-gradient(135deg,#CD7F32,#A0522D)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "white", flexShrink: 0 }}>{i + 1}</div>
                      <img src={ev.image} style={{ width: 48, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} alt={ev.title} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#1F2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</div>
                        <div style={{ height: 6, background: "#EDE9FE", borderRadius: 99, marginTop: 6 }}>
                          <div style={{ height: "100%", width: `${(ev.sold_tickets / ev.total_tickets) * 100}%`, background: "linear-gradient(90deg,#7C3AED,#F59E0B)", borderRadius: 99, transition: "width 1s ease" }} />
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 900, color: "#7C3AED" }}>{ev.sold_tickets.toLocaleString()}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>tiket terjual</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL TAMBAH/EDIT EVENT */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ background: "white", border: "1.5px solid #DDD6FE", borderRadius: 24, padding: 32, maxWidth: 560, width: "100%", margin: "0 20px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(124,58,237,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#1F2937" }}>{editEvent ? "✏️ Edit Event" : "🎪 Tambah Event Baru"}</h3>
              <button onClick={() => setShowModal(false)} style={{ width: 32, height: 32, borderRadius: "50%", background: "#F5F3FF", border: "1.5px solid #DDD6FE", cursor: "pointer", fontSize: 15, color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Judul Event", key: "title", placeholder: "Nama event" },
                { label: "Deskripsi", key: "description", placeholder: "Deskripsi event", textarea: true },
                { label: "Lokasi (Kota)", key: "location", placeholder: "Jakarta, Bali, dll" },
                { label: "Venue", key: "venue", placeholder: "Nama venue" },
                { label: "Total Tiket", key: "total_tickets", placeholder: "Jumlah tiket", type: "number" },
                { label: "URL Gambar", key: "image", placeholder: "https://..." },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", marginBottom: 6, display: "block", letterSpacing: "0.5px" }}>{field.label.toUpperCase()}</label>
                  {field.textarea ? (
                    <textarea className="input-field" placeholder={field.placeholder} value={(form as any)[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} rows={3} style={{ resize: "vertical" }} />
                  ) : (
                    <input className="input-field" type={field.type || "text"} placeholder={field.placeholder} value={(form as any)[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} />
                  )}
                </div>
              ))}

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", marginBottom: 6, display: "block", letterSpacing: "0.5px" }}>KATEGORI</label>
                <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {["Konser", "Festival", "Olahraga", "Pameran", "Lainnya"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", marginBottom: 6, display: "block", letterSpacing: "0.5px" }}>TANGGAL & WAKTU</label>
                <input className="input-field" type="datetime-local" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button className="btn-primary" onClick={handleSaveEvent} disabled={loading} style={{ flex: 1, padding: "13px 0", fontSize: 15 }}>
                  {loading ? "⏳ Menyimpan..." : editEvent ? "✅ Update Event" : "🎉 Tambah Event"}
                </button>
                <button className="btn-ghost" onClick={() => setShowModal(false)} style={{ padding: "13px 24px", fontSize: 15 }}>Batal</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
