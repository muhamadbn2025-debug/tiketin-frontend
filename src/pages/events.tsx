import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const dummyEvents = [
  { id: 1, title: "Coldplay: Music of the Spheres", category: "Konser", date: "14 Jun 2026", location: "Jakarta", venue: "GBK Stadium", price: 750000, img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop", badge: "🔥 Hot", left: 15000 },
  { id: 2, title: "Jakarta Jazz Festival 2026", category: "Festival", date: "22 Jul 2026", location: "Jakarta", venue: "Ancol Beach City", price: 450000, img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&h=400&fit=crop", badge: "🎵 Baru", left: 11500 },
  { id: 3, title: "BTS World Tour 2026", category: "Konser", date: "5 Agt 2026", location: "Solo", venue: "Stadion Manahan", price: 1200000, img: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&h=400&fit=crop", badge: "⚡ Limited", left: 89 },
  { id: 4, title: "Dewa 19 Reunion Concert", category: "Konser", date: "19 Agt 2026", location: "Tangerang", venue: "ICE BSD", price: 350000, img: "https://images.unsplash.com/photo-1501386761578-eaa54b595103?w=600&h=400&fit=crop", badge: "🎸 Nostalgia", left: 1200 },
  { id: 5, title: "Soundrenaline 2026", category: "Festival", date: "30 Agt 2026", location: "Bali", venue: "GWK Cultural Park", price: 550000, img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&h=400&fit=crop", badge: "🌴 Bali", left: 876 },
  { id: 6, title: "We The Fest 2026", category: "Festival", date: "12 Sep 2026", location: "Jakarta", venue: "JIEXPO Kemayoran", price: 680000, img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop", badge: "✨ Trending", left: 345 },
  { id: 7, title: "Sheila On 7 Live in Concert", category: "Konser", date: "20 Sep 2026", location: "Yogyakarta", venue: "Jogja Expo Center", price: 275000, img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop", badge: "🎶 Indie", left: 2300 },
  { id: 8, title: "Pameran Seni Nusantara", category: "Pameran", date: "1 Okt 2026", location: "Jakarta", venue: "Museum Nasional", price: 75000, img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop", badge: "🎨 Seni", left: 5000 },
  { id: 9, title: "Indonesia Open Badminton", category: "Olahraga", date: "15 Okt 2026", location: "Jakarta", venue: "Istora Senayan", price: 150000, img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=400&fit=crop", badge: "🏸 Sport", left: 3200 },
  { id: 10, title: "Noah Live Concert 2026", category: "Konser", date: "25 Okt 2026", location: "Bandung", venue: "Stadion GBLA", price: 320000, img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop", badge: "🎵 Pop", left: 4500 },
  { id: 11, title: "Bali Spirit Festival", category: "Festival", date: "5 Nov 2026", location: "Bali", venue: "Ubud Village", price: 890000, img: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&h=400&fit=crop", badge: "🌺 Wellness", left: 650 },
  { id: 12, title: "Java Jazz Festival 2026", category: "Festival", date: "20 Nov 2026", location: "Jakarta", venue: "JIExpo PRJ", price: 750000, img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&h=400&fit=crop", badge: "🎷 Jazz", left: 2800 },
];

const ITEMS_PER_PAGE = 6;
const CATEGORIES = ["Semua", "Konser", "Festival", "Olahraga", "Pameran"];

interface EventsPageProps {
  openLogin: () => void;
}

export default function EventsPage({ openLogin }: EventsPageProps) {
  const navigate = useNavigate();
  const [events, setEvents] = useState(dummyEvents);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/events?per_page=50");
      if (res.data.data?.data?.length > 0) {
        const apiEvents = res.data.data.data.map((e: any) => ({
          id: e.id,
          title: e.title,
          category: e.category,
          date: new Date(e.event_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
          location: e.location,
          venue: e.venue,
          price: e.tickets?.[0]?.price || 0,
          img: e.image || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop",
          badge: "🎫 Event",
          left: e.total_tickets - e.sold_tickets,
        }));
        setEvents(apiEvents);
      }
    } catch { } finally { setLoading(false); }
  };

  // Filter & sort
  const filtered = events
    .filter(e => {
      const matchCat = category === "Semua" || e.category === category;
      const matchSearch = search === "" || e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearch = (val: string) => { setSearch(val); setCurrentPage(1); };
  const handleCategory = (cat: string) => { setCategory(cat); setCurrentPage(1); };
  const handleSort = (val: string) => { setSortBy(val); setCurrentPage(1); };

  const formatPrice = (p: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  const handleBeli = (eventId: number) => {
    if (!isLoggedIn) {
      openLogin();
    } else {
      navigate(`/booking/${eventId}`);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFF", fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');

        @keyframes slide-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }

        .gradient-text {
          background:linear-gradient(135deg,#7C3AED,#EC4899,#F59E0B);
          background-size:200% auto; -webkit-background-clip:text;
          -webkit-text-fill-color:transparent; background-clip:text;
          animation:shimmer 4s linear infinite;
        }

        .event-card {
          background:white; border-radius:20px; border:1.5px solid #EDE9FE;
          overflow:hidden; transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow:0 2px 12px rgba(124,58,237,0.06);
          animation:slide-up 0.4s ease both;
        }
        .event-card:hover { transform:translateY(-8px); border-color:#7C3AED; box-shadow:0 20px 48px rgba(124,58,237,0.15); }
        .event-card:hover .eimg { transform:scale(1.06); }
        .eimg { transition:transform 0.5s ease; width:100%; height:100%; object-fit:cover; }

        .btn-primary { background:linear-gradient(135deg,#7C3AED,#EC4899); color:white; border:none; border-radius:12px; font-weight:800; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(124,58,237,0.35); }

        .cat-btn { padding:8px 18px; border-radius:50px; border:1.5px solid #DDD6FE; font-weight:800; font-size:13px; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; background:white; color:#6B7280; }
        .cat-btn.on { background:linear-gradient(135deg,#7C3AED,#EC4899); color:white; border-color:transparent; box-shadow:0 4px 16px rgba(124,58,237,0.3); }
        .cat-btn:not(.on):hover { border-color:#7C3AED; color:#7C3AED; }

        .page-btn { width:36px; height:36px; border-radius:10px; border:1.5px solid #DDD6FE; background:white; color:#6B7280; font-weight:800; font-size:14px; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; display:flex; align-items:center; justify-content:center; }
        .page-btn:hover { border-color:#7C3AED; color:#7C3AED; }
        .page-btn.active { background:linear-gradient(135deg,#7C3AED,#EC4899); color:white; border-color:transparent; box-shadow:0 4px 12px rgba(124,58,237,0.3); }
        .page-btn:disabled { opacity:0.4; cursor:not-allowed; }

        @media (max-width:768px) {
          .events-grid { grid-template-columns:1fr !important; }
          .hero-section { padding:80px 20px 40px !important; }
          .filter-bar { flex-direction:column !important; gap:10px !important; }
          .filter-bar input { width:100% !important; }
          .cats-scroll { overflow-x:auto; padding-bottom:4px; }
        }
          .hide-mobile { display:inline; }
          .show-mobile { display:none; }
        @media (max-width:480px) {
          .hide-mobile { display:none !important; }
          .show-mobile { display:inline !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 100, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid #EDE9FE", boxShadow: "0 2px 16px rgba(124,58,237,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎫</div>
            <span style={{ fontSize: 18, fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif" }} className="gradient-text">TiketIn</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => navigate("/")} style={{ background: "white", color: "#7C3AED", border: "1.5px solid #DDD6FE", borderRadius: 12, padding: "8px 12px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
              <span className="hide-mobile">🏠 Beranda</span>
              <span className="show-mobile">🏠</span>
            </button>
            {isLoggedIn ? (
              <button onClick={() => navigate("/dashboard")} className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>Dashboard →</button>
            ) : (
              <button onClick={openLogin} className="btn-primary" style={{ padding: "8px 20px", fontSize: 13 }}>Masuk / Daftar</button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero-section" style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899,#F59E0B)", padding: "100px 40px 48px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 50, padding: "6px 18px", marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "white", letterSpacing: "2px" }}>🎪 SEMUA EVENT</span>
        </div>
        <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, color: "white", marginBottom: 12, fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.5px" }}>
          Temukan Event Favoritmu
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.9)", fontWeight: 600, marginBottom: 28 }}>
          {events.length}+ event tersedia — konser, festival, olahraga, dan pameran
        </p>

        {/* Search bar */}
        <div style={{ maxWidth: 560, margin: "0 auto", background: "white", borderRadius: 16, padding: "6px 6px 6px 18px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 16px 48px rgba(0,0,0,0.2)" }}>
          <span style={{ fontSize: 20 }}>🔍</span>
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Cari event, artis, atau kota..."
            style={{ flex: 1, border: "none", outline: "none", fontSize: 15, fontWeight: 600, color: "#1F2937", background: "transparent", fontFamily: "'Nunito',sans-serif", padding: "8px 0" }}
          />
          {search && (
            <button onClick={() => handleSearch("")} style={{ background: "#F5F3FF", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12, color: "#7C3AED", fontWeight: 700 }}>✕ Clear</button>
          )}
          <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 14, borderRadius: 12, flexShrink: 0 }}>Cari</button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{ background: "white", borderBottom: "1.5px solid #EDE9FE", padding: "16px 40px", position: "sticky", top: 56, zIndex: 40, boxShadow: "0 2px 8px rgba(124,58,237,0.06)" }}>
        <div className="filter-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {/* Categories */}
          <div className="cats-scroll" style={{ display: "flex", gap: 8 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} className={`cat-btn ${category === cat ? "on" : ""}`} onClick={() => handleCategory(cat)}>{cat}</button>
            ))}
          </div>

          {/* Sort + hasil */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>{filtered.length} event ditemukan</span>
            <select value={sortBy} onChange={e => handleSort(e.target.value)} style={{ background: "white", border: "1.5px solid #DDD6FE", borderRadius: 12, padding: "8px 14px", color: "#1F2937", fontSize: 13, fontWeight: 700, outline: "none", fontFamily: "'Nunito',sans-serif", cursor: "pointer" }}>
              <option value="default">Urutkan</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="name">A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* EVENT GRID */}
      <div style={{ padding: "32px 40px", maxWidth: 1200, margin: "0 auto" }}>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#9CA3AF" }}>Memuat event...</div>
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: "#1F2937", marginBottom: 8 }}>Event tidak ditemukan</h3>
            <p style={{ color: "#9CA3AF", fontWeight: 600, marginBottom: 20 }}>Coba kata kunci atau kategori lain</p>
            <button onClick={() => { handleSearch(""); handleCategory("Semua"); }} className="btn-primary" style={{ padding: "11px 24px", fontSize: 14 }}>Reset Filter</button>
          </div>
        ) : (
          <div className="events-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {paginated.map((ev, idx) => (
              <div key={ev.id} className="event-card" style={{ animationDelay: `${idx * 0.07}s` }}>
                <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <img src={ev.img} className="eimg" alt={ev.title} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(30,10,60,0.75),transparent 55%)" }} />
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#7C3AED,#EC4899,#F59E0B)" }} />
                  <div style={{ position: "absolute", top: 12, left: 12 }}>
                    <span style={{ background: "rgba(124,58,237,0.9)", color: "white", borderRadius: 50, padding: "3px 10px", fontSize: 11, fontWeight: 900 }}>{ev.badge}</span>
                  </div>
                  <div style={{ position: "absolute", top: 12, right: 12 }}>
                    <span style={{ background: "rgba(245,158,11,0.9)", color: "white", borderRadius: 50, padding: "3px 10px", fontSize: 11, fontWeight: 900 }}>{ev.category}</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 10, left: 12, fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>
                    📅 {ev.date} · 📍 {ev.location}
                  </div>
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: "#1F2937", marginBottom: 4, lineHeight: 1.3 }}>{ev.title}</h3>
                  <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, marginBottom: 12 }}>📍 {ev.venue}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700 }}>Mulai dari</div>
                      <div style={{ fontSize: 17, fontWeight: 900, color: "#7C3AED", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{formatPrice(ev.price)}</div>
                    </div>
                    <div style={{ fontSize: 11, color: ev.left < 100 ? "#DC2626" : "#D97706", fontWeight: 800 }}>
                      {ev.left < 100 ? "🔥" : "⚡"} {ev.left.toLocaleString()} sisa
                    </div>
                  </div>
                  <button onClick={() => handleBeli(ev.id)} className="btn-primary" style={{ width: "100%", padding: "11px 0", fontSize: 14 }}>
                    {isLoggedIn ? "Pesan Tiket →" : "Masuk & Pesan →"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 40 }}>
            <button className="page-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1} title="Halaman pertama">«</button>
            <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc: (number | string)[], p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={i} style={{ color: "#9CA3AF", fontWeight: 700, padding: "0 4px" }}>...</span>
                ) : (
                  <button key={i} className={`page-btn ${currentPage === p ? "active" : ""}`} onClick={() => setCurrentPage(p as number)}>{p}</button>
                )
              )}

            <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
            <button className="page-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} title="Halaman terakhir">»</button>

            <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600, marginLeft: 8 }}>
              Hal {currentPage} dari {totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
