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

const testimonials = [
  { avatar: "AR", name: "Ayu Rahayu", role: "Music Lover", city: "Jakarta", color: "#7C3AED", text: "TiketIn bikin hidup aku jauh lebih mudah! Dulu harus antri dari subuh buat tiket Coldplay, sekarang tinggal klik dari rumah dalam hitungan menit.", rating: 5 },
  { avatar: "BH", name: "Bagas Hendra", role: "Event Hunter", city: "Surabaya", color: "#F59E0B", text: "Pernah kena tipu calo bayar 3x harga normal. Sejak pakai TiketIn, semua tiket terjamin asli dan harga transparan. Ga ada drama lagi!", rating: 5 },
  { avatar: "CN", name: "Citra Ningrum", role: "Concert Goer", city: "Bandung", color: "#EC4899", text: "Notifikasi event barunya akurat banget! Aku selalu dapat info duluan sebelum tiket sold out. Fitur reminder-nya juga keren banget.", rating: 5 },
  { avatar: "DM", name: "Dito Mahardika", role: "Festival Addict", city: "Bali", color: "#059669", text: "Beli tiket WTF 3 tahun berturut-turut lewat TiketIn. Prosesnya smooth, e-ticket langsung di email, scan QR di pintu gampang banget!", rating: 5 },
  { avatar: "ER", name: "Eka Rosita", role: "K-Pop Fan", city: "Medan", color: "#7C3AED", text: "Akhirnya bisa nonton idol favorit tanpa was-was soal tiket palsu. TiketIn memberikan ketenangan pikiran yang tidak ternilai!", rating: 5 },
  { avatar: "FP", name: "Fajar Pratama", role: "Jazz Enthusiast", city: "Yogyakarta", color: "#F59E0B", text: "Interface-nya bersih dan mudah dipakai. Booking tiket jazz festival cuma butuh 2 menit. Highly recommended buat semua pecinta musik!", rating: 5 },
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

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFF", color: "#1F2937", fontFamily: "'Nunito',sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
        * { font-family:'Nunito',sans-serif; }
        h1,h2,.display-font { font-family:'Plus Jakarta Sans',sans-serif !important; }

        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes wiggle{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
        @keyframes bounce-slow{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes hero-in{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes orb{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(0.95)}}
        @keyframes card-pop{0%{transform:scale(0.95);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}

        .h1{animation:hero-in 0.9s ease 0.2s both}
        .h2{animation:hero-in 0.9s ease 0.45s both}
        .h3{animation:hero-in 0.9s ease 0.7s both}
        .h4{animation:hero-in 0.9s ease 0.95s both}
        .float-anim{animation:float 3.2s ease-in-out infinite}
        .float-anim2{animation:float2 3.8s ease-in-out infinite 0.6s}
        .wiggle{animation:wiggle 2s ease-in-out infinite}
        .bounce-slow{animation:bounce-slow 2.5s ease-in-out infinite}

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

        .testi-card{background:white;border-radius:20px;padding:24px;border:1.5px solid #EDE9FE;box-shadow:0 4px 16px rgba(124,58,237,0.07);transition:all 0.3s;animation:card-pop 0.4s ease both}
        .testi-card:hover{transform:translateY(-6px);border-color:#C4B5FD;box-shadow:0 16px 40px rgba(124,58,237,0.14)}

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
        nav a.scrolled{color:#374151}
        nav a.scrolled:hover{color:#7C3AED}
        footer a{color:#9CA3AF;text-decoration:none;font-size:14px;font-weight:600;transition:color 0.2s}
        footer a:hover{color:#7C3AED}
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
          <ul className="nav-links" style={{ display: "flex", gap: 36, listStyle: "none", margin: 0, padding: 0 }}>
          </ul>
          <div className="nav-buttons" style={{ display: "flex", gap: 12 }}>
            <button onClick={openLogin} className="btn-ghost nav-btn-masuk" style={{ padding: "10px 22px", fontSize: 14, background: scrollY > 60 ? "white" : "rgba(255,255,255,0.15)", borderColor: scrollY > 60 ? "#DDD6FE" : "rgba(255,255,255,0.4)", color: scrollY > 60 ? "#7C3AED" : "white" }}>Masuk</button>
            <button onClick={openLogin} className="btn-primary nav-btn-daftar" style={{ padding: "10px 22px", fontSize: 14 }}>Daftar Gratis 🎉</button>
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

      {/* HERO */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <video autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}>
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(124,58,237,0.82) 0%,rgba(236,72,153,0.65) 50%,rgba(245,158,11,0.6) 100%)", zIndex: 1 }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 2, opacity: 0.07, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='2' fill='white'/%3E%3C/svg%3E")` }} />
        <div className="orb-el" style={{ width: 450, height: 450, background: "rgba(255,255,255,0.1)", top: -100, right: -50, zIndex: 2 }} />
        <div className="orb-el2 orb-el" style={{ width: 350, height: 350, background: "rgba(245,158,11,0.15)", bottom: -40, left: -80, zIndex: 2 }} />

        {/* HERO CONTENT — centered layout */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 20px" }}>

          {/* Badge */}
          <div className="h1" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.35)", borderRadius: 50, padding: "6px 18px", marginBottom: 20, backdropFilter: "blur(8px)" }}>
            <span>🎫</span>
            <span style={{ fontWeight: 800, color: "white", fontSize: 12 }}>Platform Booking Tiket #1 di Indonesia</span>
          </div>

          {/* Title — compact */}
          <h1 className="h2 display-font" style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 10, color: "white", letterSpacing: "-0.5px", textAlign: "center" }}>
            Temukan & Pesan Tiket{" "}
            <span style={{ color: "#FFD700", textShadow: "0 0 20px rgba(255,215,0,0.5)" }}>Event Favoritmu</span>
          </h1>

          {/* Subtitle */}
          <p className="h3" style={{ fontSize: "clamp(13px, 2vw, 16px)", color: "rgba(255,255,255,0.88)", marginBottom: 28, fontWeight: 600, textAlign: "center", maxWidth: 500 }}>
            Konser · Festival · Olahraga · Pameran — tiket resmi, harga transparan, anti calo 🛡️
          </p>

          {/* SEARCH BAR */}
          <div className="h4 hero-search" style={{ width: "100%", maxWidth: 620, marginBottom: 24 }}>
            <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: 20, padding: "6px 6px 6px 20px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
              <span style={{ fontSize: 20 }}>🔍</span>
              <input
                placeholder="Cari event, konser, festival, atau artis..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
                style={{ flex: 1, border: "none", outline: "none", fontSize: 15, fontWeight: 600, color: "#1F2937", background: "transparent", fontFamily: "'Nunito',sans-serif", padding: "8px 0" }}
                onFocus={e => e.currentTarget.style.color = "#7C3AED"}
                onBlur={e => e.currentTarget.style.color = "#1F2937"}
              />
              <button
                onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
                style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)", color: "white", border: "none", borderRadius: 14, padding: "12px 22px", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "'Nunito',sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}
              >
                Cari Sekarang
              </button>
            </div>

            {/* Quick category pills */}
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", justifyContent: "center" }}>
              {["🎵 Konser", "🎪 Festival", "⚽ Olahraga", "🎭 Pameran", "🔥 Terlaris"].map((cat, i) => (
                <button key={i}
                  onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 50, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: "white", cursor: "pointer", fontFamily: "'Nunito',sans-serif", backdropFilter: "blur(8px)" }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          {/* STATS — compact horizontal */}
          <div className="h4 hero-stats" style={{ display: "flex", gap: 0, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 20, overflow: "hidden" }}>
            {[
              { val: "500K+", label: "Tiket Terjual", icon: "🎫" },
              { val: "1.200+", label: "Event", icon: "🎪" },
              { val: "98%", label: "Kepuasan", icon: "⭐" },
              { val: "0 Calo", label: "Dijamin", icon: "🛡️" },
            ].map((s, i, arr) => (
              <div key={i} style={{ padding: "14px 22px", textAlign: "center", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.2)" : "none" }}>
                <div style={{ fontSize: 14, marginBottom: 2 }}>{s.icon}</div>
                <div style={{ fontSize: "clamp(16px,2.5vw,22px)", fontWeight: 900, color: "#FFD700", fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 700, marginTop: 2 }}>{s.label}</div>
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
              <div style={{ fontSize: 30, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 34, fontWeight: 900, color: "white", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{s.val}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* EVENTS */}
      <section id="events" ref={setRef("events")} className="section-pad" style={{ padding: "80px 80px", background: "#FAFAFF" }}>
        <div className={`section-anim ${visible["events"] ? "in" : ""}`}>
          <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
            <div>
              <div style={{ display: "inline-block", background: "#EDE9FE", border: "1px solid #DDD6FE", borderRadius: 50, padding: "6px 18px", marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#7C3AED", letterSpacing: "2px", textTransform: "uppercase" }}>Event Pilihan</span>
              </div>
              <h2 className="display-font section-title" style={{ fontSize: 38, fontWeight: 900, marginBottom: 8, color: "#1F2937", letterSpacing: "-0.5px" }}>Event <span className="gradient-text">Paling Ditunggu</span></h2>
              <p className="section-desc" style={{ fontSize: 16, color: "#6B7280", fontWeight: 600 }}>Jangan sampai kehabisan tiket!</p>
            </div>
            <Link to="/events"><button className="btn-ghost" style={{ padding: "10px 24px", fontSize: 14 }}>Lihat Semua →</button></Link>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
            {["Semua", "Konser", "Festival"].map(cat => (
              <button key={cat} className={`cat-btn ${activeCategory === cat ? "on" : ""}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
            ))}
          </div>
          <div className="events-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {filtered.map((ev) => (
              <div key={ev.id} className="event-card">
                <div style={{ position: "relative", height: 210, overflow: "hidden" }}>
                  <img src={ev.img} className="eimg" alt={ev.title} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(30,10,60,0.75) 0%,transparent 55%)" }} />
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#7C3AED,#EC4899,#F59E0B)" }} />
                  <div style={{ position: "absolute", top: 12, left: 12 }}><span style={{ background: "rgba(124,58,237,0.9)", color: "white", borderRadius: 50, padding: "3px 10px", fontSize: 11, fontWeight: 900 }}>{ev.badge}</span></div>
                  <div style={{ position: "absolute", top: 12, right: 12 }}><span style={{ background: "rgba(245,158,11,0.9)", color: "white", borderRadius: 50, padding: "3px 10px", fontSize: 11, fontWeight: 900 }}>{ev.category}</span></div>
                  <div style={{ position: "absolute", bottom: 12, left: 12, fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>📅 {ev.date} · 📍 {ev.location.split(",")[0]}</div>
                </div>
                <div style={{ padding: "18px 20px" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: "#1F2937", marginBottom: 6, lineHeight: 1.3 }}>{ev.title}</h3>
                  <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, marginBottom: 14 }}>📍 {ev.location}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700 }}>Mulai dari</div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: "#7C3AED", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{ev.price}</div>
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

      {/* HOW IT WORKS */}
      <section id="how" ref={setRef("how")} className="section-pad" style={{ padding: "80px 80px", background: "white" }}>
        <div className={`section-anim ${visible["how"] ? "in" : ""}`}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-block", background: "#FDF2F8", border: "1px solid #FBCFE8", borderRadius: 50, padding: "6px 18px", marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#EC4899", letterSpacing: "2px", textTransform: "uppercase" }}>Cara Kerja</span>
            </div>
            <h2 className="display-font section-title" style={{ fontSize: 38, fontWeight: 900, marginBottom: 12, color: "#1F2937" }}>Booking Tiket <span className="gradient-text">Semudah 1-2-3</span></h2>
            <p className="section-desc" style={{ fontSize: 17, color: "#6B7280", fontWeight: 600 }}>Proses cepat, aman, dan langsung ke tanganmu</p>
          </div>
          <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {[
              { step: "01", icon: "🔍", title: "Cari Event", desc: "Browse ratusan event konser dan festival terbaik di Indonesia", color: "#7C3AED", bg: "#F5F3FF" },
              { step: "02", icon: "🎫", title: "Pilih Tiket", desc: "Pilih kategori tiket sesuai budget dan preferensimu", color: "#EC4899", bg: "#FDF2F8" },
              { step: "03", icon: "💳", title: "Bayar Aman", desc: "Bayar dengan metode pembayaran yang aman dan terenkripsi", color: "#F59E0B", bg: "#FFFBEB" },
              { step: "04", icon: "📱", title: "E-Ticket Siap!", desc: "E-ticket langsung ke email, tinggal scan QR di pintu masuk", color: "#059669", bg: "#ECFDF5" },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, borderRadius: 22, padding: "28px 22px", textAlign: "center", border: `1.5px solid ${item.color}20`, transition: "all 0.3s", position: "relative" }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: item.color, letterSpacing: "2px", marginBottom: 14, opacity: 0.7 }}>{item.step}</div>
                <div style={{ fontSize: 44, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 900, color: "#1F2937", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, fontWeight: 600 }}>{item.desc}</p>
                {i < 3 && <div style={{ position: "absolute", top: "45%", right: -12, width: 22, height: 2, background: `linear-gradient(90deg,${item.color},#EC4899)`, zIndex: 10 }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLIP CARDS */}
      <section id="flip" ref={setRef("flip")} className="section-pad" style={{ padding: "80px 80px", background: "#FAFAFF" }}>
        <div className={`section-anim ${visible["flip"] ? "in" : ""}`}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-block", background: "#EDE9FE", border: "1px solid #DDD6FE", borderRadius: 50, padding: "6px 18px", marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#7C3AED", letterSpacing: "2px", textTransform: "uppercase" }}>Untuk Siapa?</span>
            </div>
            <h2 className="display-font section-title" style={{ fontSize: 38, fontWeight: 900, marginBottom: 12, color: "#1F2937" }}>TiketIn untuk <span className="gradient-text">Semua Orang</span></h2>
            <p className="section-desc" style={{ fontSize: 17, color: "#6B7280", fontWeight: 600 }}>Hover kartu untuk tahu lebih lanjut ✨</p>
          </div>
          <div className="flip-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {flipCards.map((card, i) => (
              <div key={i} className="flip-wrap">
                <div className="flip-inner">
                  <div className="flip-front">
                    <img src={card.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={card.title} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(30,10,60,0.8) 0%,rgba(0,0,0,0) 55%)" }} />
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg,${card.color},#EC4899)` }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "22px 20px" }}>
                      <div style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 16, padding: "14px 16px" }}>
                        <div style={{ fontSize: 28, marginBottom: 6 }}>{card.icon}</div>
                        <div style={{ fontSize: 19, fontWeight: 900, color: "white", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{card.title}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{card.subtitle}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flip-back" style={{ background: "white", border: `1.5px solid ${card.color}30` }}>
                    <div style={{ padding: "30px 26px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden", background: `linear-gradient(135deg,white,${card.color}08)` }}>
                      <div>
                        <div style={{ fontSize: 44, marginBottom: 16 }}>{card.icon}</div>
                        <h3 style={{ fontSize: 22, fontWeight: 900, color: "#1F2937", marginBottom: 12, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{card.title}</h3>
                        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.8, fontWeight: 600 }}>{card.desc}</p>
                      </div>
                      <button onClick={openLogin} className="btn-primary" style={{ padding: "12px 0", fontSize: 14, marginTop: 20, width: "100%", background: `linear-gradient(135deg,${card.color},#EC4899)` }}>Mulai Sekarang →</button>
                      <div style={{ position: "absolute", bottom: -24, right: -24, fontSize: 100, opacity: 0.05, userSelect: "none" }}>{card.icon}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY TIKETIN */}
      <section id="why" ref={setRef("why")} className="section-pad" style={{ padding: "80px 80px", background: "white" }}>
        <div className={`section-anim ${visible["why"] ? "in" : ""}`}>
          <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-block", background: "#EDE9FE", border: "1px solid #DDD6FE", borderRadius: 50, padding: "6px 18px", marginBottom: 20 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#7C3AED", letterSpacing: "2px", textTransform: "uppercase" }}>Kenapa TiketIn?</span>
              </div>
              <h2 className="display-font section-title" style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.15, marginBottom: 20, color: "#1F2937" }}>
                Solusi dari<br /><span className="gradient-text">Masalah Nyata</span><br />yang Kamu Rasakan
              </h2>
              <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.8, marginBottom: 32, fontWeight: 600 }}>Antri panjang, calo merajalela, tiket palsu — TiketIn hadir untuk mengakhiri semua masalah itu sekaligus.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: "🛡️", title: "Anti Calo & Tiket Palsu", desc: "Semua tiket terverifikasi dari penyelenggara resmi", color: "#7C3AED", bg: "#F5F3FF" },
                  { icon: "💰", title: "Harga Transparan", desc: "Tidak ada biaya tersembunyi — harga yang tertera yang kamu bayar", color: "#F59E0B", bg: "#FFFBEB" },
                  { icon: "🔔", title: "Notifikasi Real-time", desc: "Dapat info event & reminder sebelum tiket sold out", color: "#EC4899", bg: "#FDF2F8" },
                  { icon: "📊", title: "Dashboard Lengkap", desc: "Kelola semua tiketmu dalam satu tempat yang mudah", color: "#059669", bg: "#ECFDF5" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ width: 44, height: 44, background: item.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, border: `1.5px solid ${item.color}20` }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: "#1F2937", marginBottom: 2 }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="why-image" style={{ position: "relative" }}>
              <div className="float-anim" style={{ borderRadius: 28, overflow: "hidden", border: "1.5px solid #EDE9FE", boxShadow: "0 32px 80px rgba(124,58,237,0.2)" }}>
                <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=700&fit=crop" style={{ width: "100%", height: 480, objectFit: "cover", display: "block" }} alt="concert" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(124,58,237,0.5),transparent 50%)" }} />
              </div>
              <div className="float-anim2 why-float-card" style={{ position: "absolute", bottom: -20, left: -32, borderRadius: 20, padding: "18px 22px", background: "white", boxShadow: "0 16px 48px rgba(124,58,237,0.15)", border: "1.5px solid #EDE9FE" }}>
                <div style={{ fontSize: 11, color: "#7C3AED", fontWeight: 800, marginBottom: 6 }}>🎫 Tiket Terverifikasi</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: "#1F2937" }}>Coldplay Jakarta</div>
                <div style={{ fontSize: 13, color: "#7C3AED", fontWeight: 700 }}>14 Juni 2026 · GBK Stadium</div>
                <div style={{ marginTop: 10, height: 6, background: "#EDE9FE", borderRadius: 99 }}>
                  <div style={{ height: "100%", width: "72%", background: "linear-gradient(90deg,#7C3AED,#EC4899)", borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, marginTop: 4 }}>72% tiket terjual</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section id="testi" ref={setRef("testi")} className="section-pad" style={{ padding: "80px 80px", background: "#FAFAFF" }}>
        <div className={`section-anim ${visible["testi"] ? "in" : ""}`}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-block", background: "#FDF2F8", border: "1px solid #FBCFE8", borderRadius: 50, padding: "6px 18px", marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#EC4899", letterSpacing: "2px", textTransform: "uppercase" }}>Cerita Pengguna</span>
            </div>
            <h2 className="display-font section-title" style={{ fontSize: 38, fontWeight: 900, marginBottom: 12, color: "#1F2937" }}>Mereka Sudah <span className="gradient-text">Merasakannya</span></h2>
            <p className="section-desc" style={{ fontSize: 17, color: "#6B7280", fontWeight: 600 }}>Ribuan pengguna puas. Kamu berikutnya! ⭐</p>
          </div>
          <div className="testi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="testi-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                  {"★★★★★".split("").map((_, j) => <span key={j} style={{ color: "#F59E0B", fontSize: 18 }}>★</span>)}
                </div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, marginBottom: 20, fontWeight: 600, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ height: 1, background: "linear-gradient(90deg,#EDE9FE,transparent)", marginBottom: 18 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${t.color},${t.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "white", fontSize: 15, flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#1F2937" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: t.color, fontWeight: 700 }}>{t.role} · 📍{t.city}</div>
                  </div>
                  <div style={{ marginLeft: "auto", fontSize: 22 }}>💬</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ padding: "0 80px 80px", background: "#FAFAFF" }}>
        <div className="cta-box" style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899,#F59E0B)", borderRadius: 40, padding: "64px 80px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "0 32px 80px rgba(124,58,237,0.3)" }}>
          <div style={{ position: "absolute", top: -60, left: -60, width: 240, height: 240, background: "rgba(255,255,255,0.07)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: -80, right: -40, width: 320, height: 320, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="float-anim" style={{ fontSize: 52, marginBottom: 16, display: "inline-block" }}>🎫</div>
            <h2 className="display-font cta-title" style={{ fontSize: 48, fontWeight: 900, color: "white", marginBottom: 16, letterSpacing: "-1px" }}>Jangan Sampai<br />Kehabisan Tiket!</h2>
            <p className="cta-desc" style={{ fontSize: 18, color: "rgba(255,255,255,0.9)", marginBottom: 36, fontWeight: 600 }}>Daftar sekarang dan dapatkan notifikasi event sebelum sold out 🔥</p>
            <button className="cta-btn" onClick={openLogin} style={{ background: "white", color: "#7C3AED", border: "none", padding: "18px 52px", borderRadius: 50, fontWeight: 900, fontSize: 18, cursor: "pointer", boxShadow: "0 12px 36px rgba(0,0,0,0.2)", transition: "transform 0.2s", fontFamily: "'Nunito',sans-serif" }}
              onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}>
              Daftar Gratis Sekarang! 🚀
            </button>
            <div style={{ marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>✅ Gratis · ✅ Aman · ✅ Tiket Resmi · ✅ Tanpa Calo</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-container" style={{ background: "#1F2937", padding: "48px 80px" }}>
        <div className="footer-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎫</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "white" }}>TiketIn</div>
              <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 700, letterSpacing: "1px" }}>© 2026 — Platform Tiket #1 Indonesia</div>
            </div>
          </div>
          <div className="footer-links" style={{ display: "flex", gap: 32 }}>
            {[["Beranda", "/"], ["Event", "/events"], ["Tentang", "/about"], ["Bantuan", "#"]].map(([label, path]) => (
              <a key={label} href={path}>{label}</a>
            ))}
          </div>
        </div>
        <div style={{ paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", color: "#6B7280", fontSize: 13 }}>
          Dibuat dengan 💜 untuk para pencinta musik & event Indonesia
        </div>
      </footer>
      <ChatbotWidget />
    </div>
  );
}