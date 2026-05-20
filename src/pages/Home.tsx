import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import heroVideo from "../assets/1275-145116912.mp4";
import ChatbotWidget from "../components/ChatbotWidget";

interface HomeProps {
  openLogin: () => void;
}

const events = [
  { id: 1, title: "Coldplay: Music of the Spheres", category: "Konser", date: "14 Jun 2026", location: "GBK Stadium, Jakarta", price: "Rp 750.000", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop", badge: "🔥 Hot", left: "234 tiket tersisa" },
  { id: 2, title: "Jakarta Jazz Festival 2026", category: "Festival", date: "22 Jul 2026", location: "Ancol Beach City, Jakarta", price: "Rp 450.000", img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&h=400&fit=crop", badge: "🎵 Baru", left: "512 tiket tersisa" },
  { id: 3, title: "BTS World Tour 2026", category: "Konser", date: "5 Agt 2026", location: "Stadion Manahan, Solo", price: "Rp 1.200.000", img: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&h=400&fit=crop", badge: "⚡ Limited", left: "89 tiket tersisa" },
  { id: 4, title: "Dewa 19 Reunion Concert", category: "Konser", date: "19 Agt 2026", location: "ICE BSD, Tangerang", price: "Rp 350.000", img: "https://images.unsplash.com/photo-1501386761578-eaa54b595103?w=600&h=400&fit=crop", badge: "🎸 Nostalgia", left: "1.200 tiket tersisa" },
  { id: 5, title: "Soundrenaline 2026", category: "Festival", date: "30 Agt 2026", location: "Garuda Wisnu Kencana, Bali", price: "Rp 550.000", img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&h=400&fit=crop", badge: "🌴 Bali", left: "876 tiket tersisa" },
  { id: 6, title: "We The Fest 2026", category: "Festival", date: "12 Sep 2026", location: "JIEXPO Kemayoran, Jakarta", price: "Rp 680.000", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop", badge: "✨ Trending", left: "345 tiket tersisa" },
];

const promos = [
  {
    code: "TIKETBARU", discount: "50%", maxDisc: "Rp 150.000", desc: "Khusus pengguna baru! Diskon 50% untuk pembelian pertamamu", icon: "🎉", color: "#7C3AED", bg: "linear-gradient(135deg,#7C3AED,#9333EA)", validUntil: "31 Des 2026", type: "New User"
  },
  {
    code: "KONSER2026", discount: "30%", maxDisc: "Rp 200.000", desc: "Diskon spesial untuk semua tiket konser kategori VIP", icon: "🎸", color: "#EC4899", bg: "linear-gradient(135deg,#EC4899,#DB2777)", validUntil: "30 Jun 2026", type: "Konser"
  },
  {
    code: "FESTIVAL10", discount: "10%", maxDisc: "Rp 75.000", desc: "Cashback 10% untuk pembelian tiket festival manapun", icon: "🎪", color: "#F59E0B", bg: "linear-gradient(135deg,#F59E0B,#D97706)", validUntil: "31 Agt 2026", type: "Festival"
  },
  {
    code: "GOPAYBACK", discount: "15%", maxDisc: "Rp 100.000", desc: "Cashback GoPay untuk semua transaksi via e-wallet", icon: "📱", color: "#059669", bg: "linear-gradient(135deg,#059669,#047857)", validUntil: "30 Jul 2026", type: "E-Wallet"
  },
  {
    code: "WEEKEND50K", discount: "Rp 50K", maxDisc: "Rp 50.000", desc: "Potongan langsung Rp 50.000 untuk pembelian di hari Sabtu & Minggu", icon: "🌴", color: "#0EA5E9", bg: "linear-gradient(135deg,#0EA5E9,#0284C7)", validUntil: "Setiap Weekend", type: "Weekend"
  },
  {
    code: "BELI2HEMAT", discount: "25%", maxDisc: "Rp 300.000", desc: "Beli 2 tiket sekaligus, hemat 25% untuk tiket kedua", icon: "👥", color: "#8B5CF6", bg: "linear-gradient(135deg,#8B5CF6,#7C3AED)", validUntil: "31 Des 2026", type: "Bundle"
  },
];

const flipCards = [
  { icon: "🎵", title: "Pecinta Musik", subtitle: "Konser, Gig, Festival", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=500&fit=crop", desc: "Dari indie lokal sampai artis internasional — semua tiket tersedia di TiketIn dengan harga resmi tanpa markup dari calo.", color: "#7C3AED" },
  { icon: "🎪", title: "Event Seeker", subtitle: "Festival, Pameran, Sport", img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=500&fit=crop", desc: "Jangan lewatkan satu pun event seru di kotamu. Pantau jadwal, set reminder, dan beli tiket sebelum sold out.", color: "#F59E0B" },
  { icon: "🏢", title: "Event Organizer", subtitle: "Kelola & Jual Tiket", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=500&fit=crop", desc: "Buat event, atur kategori tiket, pantau penjualan real-time, dan akses laporan lengkap melalui dashboard admin.", color: "#EC4899" },
  { icon: "👨‍👩‍👧", title: "Keluarga & Komunitas", subtitle: "Outing, Gathering, Wisata", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop", desc: "Rencanakan outing keluarga atau gathering komunitas dengan mudah. Beli tiket massal dengan harga grup yang spesial.", color: "#059669" },
];

export default function Home({ openLogin }: HomeProps) {
  const [scrollY, setScrollY] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    refs.current[id] = el;
    if (el && !el.id) el.id = id;
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting && e.target.id) setVisible(prev => ({ ...prev, [e.target.id]: true })); });
    }, { threshold: 0.1 });
    Object.values(refs.current).forEach(el => { if (el) observer.observe(el); });
    return () => { window.removeEventListener("scroll", handleScroll); observer.disconnect(); };
  }, []);

  const filtered = events.filter(e => {
    const matchCategory = activeCategory === "Semua" || e.category === activeCategory;
    const matchSearch = searchQuery === "" || e.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFF", color: "#1F2937", fontFamily: "'Nunito',sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
        * { font-family:'Nunito',sans-serif; }
        h1,h2,.display-font { font-family:'Plus Jakarta Sans',sans-serif !important; }

        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes wiggle{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
        @keyframes hero-in{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes orb{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(0.95)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes pop{0%{transform:scale(0.95);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}

        .h1{animation:hero-in 0.9s ease 0.2s both}
        .h2{animation:hero-in 0.9s ease 0.45s both}
        .h3{animation:hero-in 0.9s ease 0.7s both}
        .h4{animation:hero-in 0.9s ease 0.95s both}
        .float-anim{animation:float 3.2s ease-in-out infinite}
        .float-anim2{animation:float2 3.8s ease-in-out infinite 0.6s}
        .wiggle{animation:wiggle 2s ease-in-out infinite}

        .gradient-text{background:linear-gradient(135deg,#7C3AED 0%,#EC4899 50%,#F59E0B 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
        .section-anim{opacity:0;transform:translateY(28px);transition:opacity 0.7s ease,transform 0.7s ease}
        .section-anim.in{opacity:1;transform:translateY(0)}

        .event-card{background:white;border-radius:20px;border:1.5px solid #EDE9FE;overflow:hidden;transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 2px 12px rgba(124,58,237,0.06)}
        .event-card:hover{transform:translateY(-10px) scale(1.02);border-color:#7C3AED;box-shadow:0 20px 48px rgba(124,58,237,0.18)}
        .event-card:hover .eimg{transform:scale(1.08)}
        .eimg{transition:transform 0.5s ease;width:100%;height:100%;object-fit:cover}

        .btn-primary{background:linear-gradient(135deg,#7C3AED,#EC4899);color:white;border:none;border-radius:50px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;transition:all 0.25s}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(124,58,237,0.4);filter:brightness(1.05)}
        .btn-ghost{background:white;color:#7C3AED;border:2px solid #DDD6FE;border-radius:50px;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif;transition:all 0.2s}
        .btn-ghost:hover{background:#F5F3FF;border-color:#7C3AED}

        .flip-wrap{perspective:1400px;cursor:pointer}
        .flip-inner{position:relative;width:100%;height:400px;transform-style:preserve-3d;transition:transform 0.65s cubic-bezier(0.4,0.2,0.2,1)}
        .flip-wrap:hover .flip-inner{transform:rotateY(180deg)}
        .flip-front,.flip-back{position:absolute;inset:0;border-radius:22px;backface-visibility:hidden;overflow:hidden}
        .flip-back{transform:rotateY(180deg)}

        .promo-card{border-radius:20px;overflow:hidden;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 4px 20px rgba(0,0,0,0.1);animation:pop 0.4s ease both;cursor:pointer}
        .promo-card:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 20px 48px rgba(0,0,0,0.15)}

        .copy-btn{background:rgba(255,255,255,0.25);border:1.5px solid rgba(255,255,255,0.5);border-radius:10px;padding:6px 14px;font-size:12px;font-weight:800;color:white;cursor:pointer;font-family:'Nunito',sans-serif;transition:all 0.2s;backdrop-filter:blur(8px)}
        .copy-btn:hover{background:rgba(255,255,255,0.4)}
        .copy-btn.copied{background:rgba(255,255,255,0.9);color:#059669}

        .ticker-wrap{overflow:hidden;background:linear-gradient(135deg,#7C3AED,#EC4899);padding:10px 0}
        .ticker-track{display:flex;animation:ticker 30s linear infinite;width:max-content}
        .ticker-item{display:flex;align-items:center;gap:12px;padding:0 36px;font-size:13px;font-weight:800;white-space:nowrap;color:white}

        .cat-btn{padding:8px 20px;border-radius:50px;border:1.5px solid #DDD6FE;font-weight:800;font-size:13px;cursor:pointer;font-family:'Nunito',sans-serif;transition:all 0.2s;background:white;color:#6B7280}
        .cat-btn.on{background:linear-gradient(135deg,#7C3AED,#EC4899);color:white;border-color:transparent;box-shadow:0 4px 16px rgba(124,58,237,0.3)}
        .cat-btn:not(.on):hover{border-color:#7C3AED;color:#7C3AED}

        .orb-el{position:absolute;border-radius:50%;filter:blur(70px);animation:orb 10s ease-in-out infinite}
        .orb-el2{animation:orb 13s ease-in-out infinite reverse}

        nav a{color:rgba(255,255,255,0.85);text-decoration:none;font-weight:700;font-size:15px;transition:color 0.2s}
        nav a:hover{color:white}
        footer a{color:#9CA3AF;text-decoration:none;font-size:14px;font-weight:600;transition:color 0.2s}
        footer a:hover{color:#7C3AED}

        /* ── RESPONSIVE ── */
        @media (max-width:768px) {
          .nav-container { padding:12px 16px !important; }
          .nav-buttons button:first-child { display:none !important; }
          .nav-buttons button:last-child { padding:9px 14px !important; font-size:13px !important; }
          .hero-content-wrap {
            padding:0 16px !important;
            justify-content:center !important;
            padding-top:0 !important;
          }
          .hero-title { font-size:clamp(20px,5.5vw,32px) !important; margin-bottom:6px !important; }
          .hero-search-box { padding:5px 5px 5px 14px !important; }
          .hero-search-box input { font-size:13px !important; }
          .hero-search-box button { padding:10px 14px !important; font-size:13px !important; }
          .hero-stats { gap:0 !important; border-radius:14px !important; }
          .hero-stats > div { padding:8px 10px !important; }
          .hero-stats > div > div:nth-child(2) { font-size:14px !important; }
          .hero-stats > div > div:nth-child(3) { font-size:9px !important; }
          .stats-bar { padding:24px 20px !important; }
          .stats-grid { grid-template-columns:repeat(2,1fr) !important; gap:16px !important; }
          .stats-grid > div { border-right:none !important; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:16px !important; }
          .section-pad { padding:48px 20px !important; }
          .section-title { font-size:28px !important; }
          .section-desc { font-size:14px !important; }
          .section-header { flex-direction:column !important; align-items:flex-start !important; gap:14px !important; }
          .events-grid { grid-template-columns:1fr !important; }
          .how-grid { grid-template-columns:1fr 1fr !important; gap:12px !important; }
          .flip-grid { grid-template-columns:1fr 1fr !important; gap:12px !important; }
          .flip-inner { height:260px !important; }
          .why-grid { grid-template-columns:1fr !important; gap:32px !important; }
          .why-image { display:none !important; }
          .promo-grid { grid-template-columns:1fr !important; }
          .cta-section { padding:0 20px 48px !important; }
          .cta-box { padding:40px 24px !important; border-radius:24px !important; }
          .cta-title { font-size:28px !important; }
          .cta-desc { font-size:15px !important; }
          .cta-btn { padding:14px 32px !important; font-size:15px !important; }
          .footer-container { padding:32px 20px !important; }
          .footer-inner { flex-direction:column !important; gap:20px !important; text-align:center !important; }
          .footer-links { justify-content:center !important; gap:20px !important; flex-wrap:wrap !important; }
          .why-float-card { display:none !important; }
        }

        @media (max-width:480px) {
          .how-grid { grid-template-columns:1fr !important; }
          .flip-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 100, background: scrollY > 60 ? "rgba(255,255,255,0.96)" : "transparent", backdropFilter: scrollY > 60 ? "blur(20px)" : "none", borderBottom: scrollY > 60 ? "1px solid #EDE9FE" : "none", boxShadow: scrollY > 60 ? "0 2px 16px rgba(124,58,237,0.08)" : "none", transition: "all 0.4s ease" }}>
        <div className="nav-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 80px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="wiggle" style={{ display: "inline-block" }}>
              <div style={{ width: 42, height: 42, background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }}>🎫</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif", color: scrollY > 60 ? "#7C3AED" : "white" }}>TiketIn</div>
              <div style={{ fontSize: 9, color: scrollY > 60 ? "#9CA3AF" : "rgba(255,255,255,0.7)", letterSpacing: "2px", fontWeight: 700 }}>BOOK YOUR MOMENT</div>
            </div>
          </div>
          <div className="nav-buttons" style={{ display: "flex", gap: 12 }}>
            <button onClick={openLogin} className="btn-ghost" style={{ padding: "10px 22px", fontSize: 14, background: scrollY > 60 ? "white" : "rgba(255,255,255,0.15)", borderColor: scrollY > 60 ? "#DDD6FE" : "rgba(255,255,255,0.4)", color: scrollY > 60 ? "#7C3AED" : "white" }}>Masuk</button>
            <button onClick={openLogin} className="btn-primary" style={{ padding: "10px 22px", fontSize: 14 }}>Daftar Gratis 🎉</button>
          </div>
        </div>
      </nav>

      {/* TICKER */}
      <div className="ticker-wrap" style={{ paddingTop: 76 }}>
        <div className="ticker-track">
          {[...Array(2)].map((_, ri) => (
            ["🎵 Coldplay Jakarta", "🎸 Jazz Festival", "⚡ BTS World Tour", "🎪 Soundrenaline Bali", "🎭 We The Fest", "🌟 Dewa 19 Reunion", "🔥 Tiket Terbatas!"].map((item, i) => (
              <div key={`${ri}-${i}`} className="ticker-item"><span>{item}</span><span style={{ opacity: 0.5 }}>•</span></div>
            ))
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "100svh", minHeight: 560, overflow: "hidden" }}>
        <video autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}>
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(124,58,237,0.85) 0%,rgba(236,72,153,0.7) 50%,rgba(245,158,11,0.65) 100%)", zIndex: 1 }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 2, opacity: 0.07, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='2' fill='white'/%3E%3C/svg%3E")` }} />
        <div className="orb-el" style={{ width: 350, height: 350, background: "rgba(255,255,255,0.08)", top: -80, right: -40, zIndex: 2 }} />
        <div className="orb-el2 orb-el" style={{ width: 280, height: 280, background: "rgba(245,158,11,0.12)", bottom: -30, left: -60, zIndex: 2 }} />

        <div className="hero-content-wrap" style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", paddingTop: "clamp(20px,5vh,60px)" }}>

          {/* Badge */}
          <div className="h1" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.35)", borderRadius: 50, padding: "6px 16px", marginBottom: 16, backdropFilter: "blur(8px)" }}>
            <span>🎫</span>
            <span style={{ fontWeight: 800, color: "white", fontSize: 11 }}>Platform Booking Tiket #1 di Indonesia</span>
          </div>

          {/* Title */}
          <h1 className="h2 display-font hero-title" style={{ fontSize: "clamp(24px, 4.5vw, 48px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 10, color: "white", letterSpacing: "-0.5px", textAlign: "center", maxWidth: 600 }}>
            Temukan & Pesan Tiket{" "}
            <span style={{ color: "#FFD700", textShadow: "0 0 20px rgba(255,215,0,0.5)" }}>Event Favoritmu</span>
          </h1>

          {/* Subtitle */}
          <p className="h3" style={{ fontSize: "clamp(12px, 1.8vw, 15px)", color: "rgba(255,255,255,0.88)", marginBottom: 22, fontWeight: 600, textAlign: "center", maxWidth: 480 }}>
            Konser · Festival · Olahraga · Pameran — tiket resmi, harga transparan, anti calo 🛡️
          </p>

          {/* SEARCH BAR */}
          <div className="h4" style={{ width: "100%", maxWidth: 580, marginBottom: 16 }}>
            <div className="hero-search-box" style={{ background: "rgba(255,255,255,0.97)", borderRadius: 18, padding: "5px 5px 5px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 16px 48px rgba(0,0,0,0.25)" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>🔍</span>
              <input
                placeholder="Cari event, konser, atau artis..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
                style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontWeight: 600, color: "#1F2937", background: "transparent", fontFamily: "'Nunito',sans-serif", padding: "8px 0", minWidth: 0 }}
                onFocus={e => e.currentTarget.style.color = "#7C3AED"}
                onBlur={e => e.currentTarget.style.color = "#1F2937"}
              />
              <button
                onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
                style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)", color: "white", border: "none", borderRadius: 13, padding: "11px 18px", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "'Nunito',sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}
              >
                Cari
              </button>
            </div>

            {/* Category pills */}
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {["🎵 Konser", "🎪 Festival", "⚽ Olahraga", "🎭 Pameran"].map((cat, i) => (
                <button key={i}
                  onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.35)", borderRadius: 50, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "white", cursor: "pointer", fontFamily: "'Nunito',sans-serif", backdropFilter: "blur(8px)" }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* STATS */}
          <div className="h4 hero-stats" style={{ display: "flex", gap: 0, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 16, overflow: "hidden" }}>
            {[
              { val: "500K+", label: "Tiket Terjual", icon: "🎫" },
              { val: "1.200+", label: "Event", icon: "🎪" },
              { val: "98%", label: "Puas", icon: "⭐" },
              { val: "0 Calo", label: "Dijamin", icon: "🛡️" },
            ].map((s, i, arr) => (
              <div key={i} style={{ padding: "12px 16px", textAlign: "center", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.2)" : "none" }}>
                <div style={{ fontSize: 12, marginBottom: 2 }}>{s.icon}</div>
                <div style={{ fontSize: "clamp(14px,2vw,20px)", fontWeight: 900, color: "#FFD700", fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontWeight: 700, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar" style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)", padding: "32px 80px" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[{ val: "500K+", label: "Tiket Terjual", icon: "🎫" }, { val: "1.200+", label: "Event Tersedia", icon: "🎪" }, { val: "98%", label: "Kepuasan User", icon: "⭐" }, { val: "0", label: "Tiket Palsu", icon: "🛡️" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.2)" : "none", padding: "8px 0" }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: "white", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{s.val}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* EVENTS */}
      <section id="events" ref={setRef("events")} className="section-pad" style={{ padding: "72px 80px", background: "#FAFAFF" }}>
        <div className={`section-anim ${visible["events"] ? "in" : ""}`}>
          <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <div style={{ display: "inline-block", background: "#EDE9FE", border: "1px solid #DDD6FE", borderRadius: 50, padding: "6px 18px", marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#7C3AED", letterSpacing: "2px", textTransform: "uppercase" }}>Event Pilihan</span>
              </div>
              <h2 className="display-font section-title" style={{ fontSize: 36, fontWeight: 900, marginBottom: 6, color: "#1F2937" }}>Event <span className="gradient-text">Paling Ditunggu</span></h2>
              <p className="section-desc" style={{ fontSize: 15, color: "#6B7280", fontWeight: 600 }}>Jangan sampai kehabisan tiket!</p>
            </div>
            <Link to="/events"><button className="btn-ghost" style={{ padding: "10px 24px", fontSize: 14 }}>Lihat Semua →</button></Link>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            {["Semua", "Konser", "Festival"].map(cat => (
              <button key={cat} className={`cat-btn ${activeCategory === cat ? "on" : ""}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
            ))}
          </div>
          <div className="events-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {filtered.map((ev) => (
              <div key={ev.id} className="event-card">
                <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <img src={ev.img} className="eimg" alt={ev.title} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(30,10,60,0.75) 0%,transparent 55%)" }} />
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#7C3AED,#EC4899,#F59E0B)" }} />
                  <div style={{ position: "absolute", top: 12, left: 12 }}><span style={{ background: "rgba(124,58,237,0.9)", color: "white", borderRadius: 50, padding: "3px 10px", fontSize: 11, fontWeight: 900 }}>{ev.badge}</span></div>
                  <div style={{ position: "absolute", top: 12, right: 12 }}><span style={{ background: "rgba(245,158,11,0.9)", color: "white", borderRadius: 50, padding: "3px 10px", fontSize: 11, fontWeight: 900 }}>{ev.category}</span></div>
                  <div style={{ position: "absolute", bottom: 10, left: 12, fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>📅 {ev.date} · 📍 {ev.location.split(",")[0]}</div>
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: "#1F2937", marginBottom: 4, lineHeight: 1.3 }}>{ev.title}</h3>
                  <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, marginBottom: 12 }}>📍 {ev.location}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700 }}>Mulai dari</div>
                      <div style={{ fontSize: 17, fontWeight: 900, color: "#7C3AED", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{ev.price}</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#D97706", fontWeight: 800 }}>⚡ {ev.left}</div>
                  </div>
                  <button onClick={openLogin} className="btn-primary" style={{ width: "100%", padding: "11px 0", fontSize: 14 }}>Beli Tiket Sekarang</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO & VOUCHER SECTION ── */}
      <section id="promo" ref={setRef("promo")} className="section-pad" style={{ padding: "72px 80px", background: "white" }}>
        <div className={`section-anim ${visible["promo"] ? "in" : ""}`}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#FDF2F8", border: "1px solid #FBCFE8", borderRadius: 50, padding: "6px 18px", marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#EC4899", letterSpacing: "2px", textTransform: "uppercase" }}>🏷️ Promo & Voucher</span>
            </div>
            <h2 className="display-font section-title" style={{ fontSize: 36, fontWeight: 900, marginBottom: 10, color: "#1F2937" }}>Hemat Lebih Banyak <span className="gradient-text">dengan Promo</span></h2>
            <p className="section-desc" style={{ fontSize: 15, color: "#6B7280", fontWeight: 600 }}>Klik untuk copy kode promo, langsung pakai saat checkout! 🎁</p>
          </div>

          <div className="promo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {promos.map((promo, i) => (
              <div key={i} className="promo-card" style={{ background: promo.bg, animationDelay: `${i * 0.07}s` }}
                onClick={() => handleCopy(promo.code)}>
                {/* Top */}
                <div style={{ padding: "22px 22px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ fontSize: 36 }}>{promo.icon}</div>
                    <span style={{ background: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 50, padding: "3px 10px", fontSize: 10, fontWeight: 800, color: "white" }}>{promo.type}</span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "white", fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1, marginBottom: 4 }}>
                    DISKON {promo.discount}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 600, marginBottom: 12 }}>Maks. {promo.maxDisc}</div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 600, lineHeight: 1.6 }}>{promo.desc}</p>
                </div>

                {/* Dashed divider */}
                <div style={{ margin: "0 22px", borderTop: "1.5px dashed rgba(255,255,255,0.35)" }} />

                {/* Bottom — kode */}
                <div style={{ padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 700, marginBottom: 4 }}>KODE PROMO</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "white", letterSpacing: "2px", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{promo.code}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", fontWeight: 600, marginTop: 2 }}>Berlaku: {promo.validUntil}</div>
                  </div>
                  <button className={`copy-btn ${copiedCode === promo.code ? "copied" : ""}`}
                    onClick={e => { e.stopPropagation(); handleCopy(promo.code); }}>
                    {copiedCode === promo.code ? "✅ Disalin!" : "📋 Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Banner bawah */}
          <div style={{ marginTop: 28, background: "linear-gradient(135deg,#F5F3FF,#FDF2F8)", borderRadius: 20, padding: "20px 28px", border: "1.5px solid #EDE9FE", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#1F2937", marginBottom: 4 }}>🎊 Promo member baru — diskon 50% tiket pertamamu!</div>
              <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>Daftar sekarang dan langsung pakai kode <strong style={{ color: "#7C3AED" }}>TIKETBARU</strong> saat checkout</div>
            </div>
            <button onClick={openLogin} className="btn-primary" style={{ padding: "11px 24px", fontSize: 14, borderRadius: 14 }}>Daftar & Klaim →</button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" ref={setRef("how")} className="section-pad" style={{ padding: "72px 80px", background: "#FAFAFF" }}>
        <div className={`section-anim ${visible["how"] ? "in" : ""}`}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#FDF2F8", border: "1px solid #FBCFE8", borderRadius: 50, padding: "6px 18px", marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#EC4899", letterSpacing: "2px", textTransform: "uppercase" }}>Cara Kerja</span>
            </div>
            <h2 className="display-font section-title" style={{ fontSize: 36, fontWeight: 900, marginBottom: 10, color: "#1F2937" }}>Booking Tiket <span className="gradient-text">Semudah 1-2-3</span></h2>
            <p className="section-desc" style={{ fontSize: 15, color: "#6B7280", fontWeight: 600 }}>Proses cepat, aman, dan langsung ke tanganmu</p>
          </div>
          <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {[
              { step: "01", icon: "🔍", title: "Cari Event", desc: "Browse ratusan event konser dan festival terbaik di Indonesia", color: "#7C3AED", bg: "#F5F3FF" },
              { step: "02", icon: "🎫", title: "Pilih Tiket", desc: "Pilih kategori tiket sesuai budget dan preferensimu", color: "#EC4899", bg: "#FDF2F8" },
              { step: "03", icon: "💳", title: "Bayar Aman", desc: "Bayar dengan metode pembayaran yang aman dan terenkripsi", color: "#F59E0B", bg: "#FFFBEB" },
              { step: "04", icon: "📱", title: "E-Ticket Siap!", desc: "E-ticket langsung ke email, tinggal scan QR di pintu masuk", color: "#059669", bg: "#ECFDF5" },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, borderRadius: 20, padding: "24px 20px", textAlign: "center", border: `1.5px solid ${item.color}20`, transition: "all 0.3s", position: "relative" }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: item.color, letterSpacing: "2px", marginBottom: 12, opacity: 0.7 }}>{item.step}</div>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: "#1F2937", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, fontWeight: 600 }}>{item.desc}</p>
                {i < 3 && <div style={{ position: "absolute", top: "45%", right: -10, width: 18, height: 2, background: `linear-gradient(90deg,${item.color},#EC4899)`, zIndex: 10 }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLIP CARDS */}
      <section id="flip" ref={setRef("flip")} className="section-pad" style={{ padding: "72px 80px", background: "white" }}>
        <div className={`section-anim ${visible["flip"] ? "in" : ""}`}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ display: "inline-block", background: "#EDE9FE", border: "1px solid #DDD6FE", borderRadius: 50, padding: "6px 18px", marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#7C3AED", letterSpacing: "2px", textTransform: "uppercase" }}>Untuk Siapa?</span>
            </div>
            <h2 className="display-font section-title" style={{ fontSize: 36, fontWeight: 900, marginBottom: 10, color: "#1F2937" }}>TiketIn untuk <span className="gradient-text">Semua Orang</span></h2>
            <p className="section-desc" style={{ fontSize: 15, color: "#6B7280", fontWeight: 600 }}>Hover kartu untuk tahu lebih lanjut ✨</p>
          </div>
          <div className="flip-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {flipCards.map((card, i) => (
              <div key={i} className="flip-wrap">
                <div className="flip-inner">
                  <div className="flip-front">
                    <img src={card.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={card.title} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(30,10,60,0.8) 0%,rgba(0,0,0,0) 55%)" }} />
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg,${card.color},#EC4899)` }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 16px" }}>
                      <div style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14, padding: "12px 14px" }}>
                        <div style={{ fontSize: 24, marginBottom: 4 }}>{card.icon}</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: "white", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{card.title}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{card.subtitle}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flip-back" style={{ background: "white", border: `1.5px solid ${card.color}30` }}>
                    <div style={{ padding: "26px 22px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden", background: `linear-gradient(135deg,white,${card.color}08)` }}>
                      <div>
                        <div style={{ fontSize: 38, marginBottom: 12 }}>{card.icon}</div>
                        <h3 style={{ fontSize: 20, fontWeight: 900, color: "#1F2937", marginBottom: 10, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{card.title}</h3>
                        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.8, fontWeight: 600 }}>{card.desc}</p>
                      </div>
                      <button onClick={openLogin} className="btn-primary" style={{ padding: "11px 0", fontSize: 13, marginTop: 16, width: "100%", background: `linear-gradient(135deg,${card.color},#EC4899)` }}>Mulai Sekarang →</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY TIKETIN */}
      <section id="why" ref={setRef("why")} className="section-pad" style={{ padding: "72px 80px", background: "#FAFAFF" }}>
        <div className={`section-anim ${visible["why"] ? "in" : ""}`}>
          <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-block", background: "#EDE9FE", border: "1px solid #DDD6FE", borderRadius: 50, padding: "6px 18px", marginBottom: 18 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#7C3AED", letterSpacing: "2px", textTransform: "uppercase" }}>Kenapa TiketIn?</span>
              </div>
              <h2 className="display-font section-title" style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.15, marginBottom: 18, color: "#1F2937" }}>
                Solusi dari<br /><span className="gradient-text">Masalah Nyata</span><br />yang Kamu Rasakan
              </h2>
              <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.8, marginBottom: 28, fontWeight: 600 }}>Antri panjang, calo merajalela, tiket palsu — TiketIn hadir untuk mengakhiri semua masalah itu sekaligus.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { icon: "🛡️", title: "Anti Calo & Tiket Palsu", desc: "Semua tiket terverifikasi dari penyelenggara resmi", color: "#7C3AED", bg: "#F5F3FF" },
                  { icon: "💰", title: "Harga Transparan", desc: "Tidak ada biaya tersembunyi — harga yang tertera yang kamu bayar", color: "#F59E0B", bg: "#FFFBEB" },
                  { icon: "🔔", title: "Notifikasi Real-time", desc: "Dapat info event & reminder sebelum tiket sold out", color: "#EC4899", bg: "#FDF2F8" },
                  { icon: "📊", title: "Dashboard Lengkap", desc: "Kelola semua tiketmu dalam satu tempat yang mudah", color: "#059669", bg: "#ECFDF5" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ width: 42, height: 42, background: item.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, border: `1.5px solid ${item.color}20` }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: "#1F2937", marginBottom: 2 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="why-image" style={{ position: "relative" }}>
              <div className="float-anim" style={{ borderRadius: 28, overflow: "hidden", border: "1.5px solid #EDE9FE", boxShadow: "0 32px 80px rgba(124,58,237,0.2)" }}>
                <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=700&fit=crop" style={{ width: "100%", height: 460, objectFit: "cover", display: "block" }} alt="concert" />
              </div>
              <div className="float-anim2 why-float-card" style={{ position: "absolute", bottom: -20, left: -32, borderRadius: 18, padding: "16px 20px", background: "white", boxShadow: "0 16px 48px rgba(124,58,237,0.15)", border: "1.5px solid #EDE9FE" }}>
                <div style={{ fontSize: 11, color: "#7C3AED", fontWeight: 800, marginBottom: 4 }}>🎫 Tiket Terverifikasi</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#1F2937" }}>Coldplay Jakarta</div>
                <div style={{ fontSize: 12, color: "#7C3AED", fontWeight: 700 }}>14 Juni 2026 · GBK Stadium</div>
                <div style={{ marginTop: 8, height: 5, background: "#EDE9FE", borderRadius: 99 }}>
                  <div style={{ height: "100%", width: "72%", background: "linear-gradient(90deg,#7C3AED,#EC4899)", borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, marginTop: 3 }}>72% tiket terjual</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ padding: "0 80px 72px", background: "#FAFAFF" }}>
        <div className="cta-box" style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899,#F59E0B)", borderRadius: 36, padding: "56px 72px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "0 32px 80px rgba(124,58,237,0.3)" }}>
          <div style={{ position: "absolute", top: -60, left: -60, width: 220, height: 220, background: "rgba(255,255,255,0.07)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: -80, right: -40, width: 300, height: 300, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="float-anim" style={{ fontSize: 48, marginBottom: 14, display: "inline-block" }}>🎫</div>
            <h2 className="display-font cta-title" style={{ fontSize: 44, fontWeight: 900, color: "white", marginBottom: 14, letterSpacing: "-0.5px" }}>Jangan Sampai<br />Kehabisan Tiket!</h2>
            <p className="cta-desc" style={{ fontSize: 16, color: "rgba(255,255,255,0.9)", marginBottom: 30, fontWeight: 600 }}>Daftar sekarang dan langsung dapat kode promo <strong>TIKETBARU</strong> diskon 50%! 🔥</p>
            <button className="cta-btn" onClick={openLogin} style={{ background: "white", color: "#7C3AED", border: "none", padding: "16px 48px", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: "pointer", boxShadow: "0 12px 36px rgba(0,0,0,0.2)", transition: "transform 0.2s", fontFamily: "'Nunito',sans-serif" }}
              onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}>
              Daftar & Klaim Promo Sekarang! 🚀
            </button>
            <div style={{ marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>✅ Gratis · ✅ Aman · ✅ Tiket Resmi · ✅ Tanpa Calo</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-container" style={{ background: "#1F2937", padding: "40px 80px" }}>
        <div className="footer-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎫</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "white" }}>TiketIn</div>
              <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 700, letterSpacing: "1px" }}>© 2026 — Platform Tiket #1 Indonesia</div>
            </div>
          </div>
          <div className="footer-links" style={{ display: "flex", gap: 28 }}>
            {[["Beranda", "/"], ["Event", "/events"], ["Tentang", "/about"], ["Bantuan", "#"]].map(([label, path]) => (
              <a key={label} href={path} style={{ color: "#9CA3AF", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>{label}</a>
            ))}
          </div>
        </div>
        <div style={{ paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", color: "#6B7280", fontSize: 12 }}>
          Dibuat dengan 💜 untuk para pencinta musik & event Indonesia
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  );
}
