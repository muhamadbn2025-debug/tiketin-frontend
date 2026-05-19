import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });

  const handleSubmit = async () => {
    if (!form.email || !form.password) { toast.error("Email dan password wajib diisi!"); return; }
    if (!isLogin && form.password !== form.password_confirmation) { toast.error("Password tidak cocok!"); return; }

    setLoading(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, password_confirmation: form.password_confirmation };

      const res = await axios.post(endpoint, payload);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(isLogin ? `Selamat datang, ${user.name}! 🎫` : "Akun berhasil dibuat! 🎉");
      onClose();

      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/dashboard");

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Terjadi kesalahan, coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, fontFamily:"'Nunito',sans-serif", padding:"16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@800;900&display=swap');

        @keyframes modal-in { from{opacity:0;transform:scale(0.9) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        .lm-box { animation:modal-in 0.4s cubic-bezier(0.34,1.56,0.64,1); }

        .lm-input {
          width:100%; padding:14px 16px; border-radius:14px;
          border:2px solid #EDE9FE; background:#FAFAFF;
          color:#1F2937; font-size:14px; font-weight:600;
          outline:none; box-sizing:border-box;
          font-family:'Nunito',sans-serif; transition:all 0.2s;
        }
        .lm-input:focus { border-color:#7C3AED; background:white; box-shadow:0 0 0 4px rgba(124,58,237,0.08); }
        .lm-input::placeholder { color:#9CA3AF; font-weight:500; }

        .lm-tab { flex:1; padding:11px 0; border:none; border-radius:12px; font-weight:800; font-size:14px; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.25s; }
        .lm-tab.on { background:linear-gradient(135deg,#7C3AED,#EC4899); color:white; box-shadow:0 6px 20px rgba(124,58,237,0.35); }
        .lm-tab:not(.on) { background:transparent; color:#9CA3AF; }
        .lm-tab:not(.on):hover { color:#7C3AED; }

        .lm-submit {
          width:100%; padding:15px; border-radius:16px; border:none;
          background:linear-gradient(135deg,#7C3AED,#EC4899);
          color:white; font-weight:900; font-size:16px;
          cursor:pointer; font-family:'Nunito',sans-serif;
          transition:all 0.25s; letter-spacing:0.3px;
        }
        .lm-submit:hover { transform:translateY(-2px); box-shadow:0 16px 40px rgba(124,58,237,0.45); filter:brightness(1.05); }
        .lm-submit:disabled { opacity:0.6; cursor:not-allowed; transform:none; box-shadow:none; }

        .lm-gradient { background:linear-gradient(135deg,#7C3AED,#EC4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

        .lm-feature { display:flex; align-items:center; gap:10px; padding:10px 14px; background:rgba(255,255,255,0.12); border-radius:12px; margin-bottom:8px; }

        /* Mobile: hide left panel */
        @media (max-width: 640px) {
          .lm-left { display:none !important; }
          .lm-right { border-radius:24px !important; }
          .lm-box { border-radius:24px !important; }
        }
      `}</style>

      <div className="lm-box" onClick={e => e.stopPropagation()} style={{ display:"flex", width:"100%", maxWidth:840, borderRadius:28, overflow:"hidden", boxShadow:"0 40px 100px rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.1)", maxHeight:"95vh" }}>

        {/* ── LEFT PANEL (hidden on mobile) ── */}
        <div className="lm-left" style={{ width:320, flexShrink:0, background:"linear-gradient(160deg,#7C3AED 0%,#EC4899 60%,#F59E0B 100%)", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"40px 32px", position:"relative", overflow:"hidden" }}>
          {/* Orb decorations */}
          <div style={{ position:"absolute", top:-80, right:-60, width:220, height:220, background:"rgba(255,255,255,0.08)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", bottom:-60, left:-50, width:200, height:200, background:"rgba(0,0,0,0.1)", borderRadius:"50%" }} />

          {/* Top */}
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
              <div style={{ width:40, height:40, background:"rgba(255,255,255,0.2)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🎫</div>
              <div style={{ fontSize:20, fontWeight:900, color:"white", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>TiketIn</div>
            </div>
            <h2 style={{ fontSize:28, fontWeight:900, color:"white", lineHeight:1.2, marginBottom:12, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              {isLogin ? "Selamat\nDatang\nKembali! 👋" : "Gabung\nSekarang\nGratis! 🎉"}
            </h2>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.7, fontWeight:600 }}>
              {isLogin ? "Masuk dan nikmati kemudahan booking tiket event favoritmu." : "Daftar gratis dan akses ribuan event terbaik di Indonesia."}
            </p>
          </div>

          {/* Features */}
          <div style={{ position:"relative", zIndex:1 }}>
            {[
              { icon:"🛡️", text:"Tiket 100% Resmi & Aman" },
              { icon:"🔔", text:"Notifikasi Event Terbaru" },
              { icon:"📱", text:"E-Ticket Langsung ke Email" },
              { icon:"🚫", text:"Anti Calo, Anti Palsu" },
            ].map((f, i) => (
              <div key={i} className="lm-feature">
                <span style={{ fontSize:18 }}>{f.icon}</span>
                <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.9)" }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL (form) ── */}
        <div className="lm-right" style={{ flex:1, background:"white", padding:"32px 36px", overflowY:"auto", display:"flex", flexDirection:"column" }}>

          {/* Top bar */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
            {/* Mobile-only logo */}
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:36, height:36, background:"linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🎫</div>
              <span style={{ fontSize:18, fontWeight:900, fontFamily:"'Plus Jakarta Sans',sans-serif" }} className="lm-gradient">TiketIn</span>
            </div>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:"50%", background:"#F5F3FF", border:"1.5px solid #EDE9FE", cursor:"pointer", fontSize:14, color:"#7C3AED", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✕</button>
          </div>

          {/* Heading */}
          <div style={{ marginBottom:24 }}>
            <h3 style={{ fontSize:22, fontWeight:900, color:"#1F2937", marginBottom:4, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              {isLogin ? "Masuk ke Akunmu" : "Buat Akun Baru"}
            </h3>
            <p style={{ fontSize:13, color:"#9CA3AF", fontWeight:600 }}>
              {isLogin ? "Selamat datang kembali! 🎫" : "Daftar gratis, booking tiket favoritmu 🎉"}
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:6, background:"#F5F3FF", borderRadius:16, padding:5, marginBottom:24 }}>
            <button className={`lm-tab ${isLogin?"on":""}`} onClick={() => setIsLogin(true)}>Masuk</button>
            <button className={`lm-tab ${!isLogin?"on":""}`} onClick={() => setIsLogin(false)}>Daftar</button>
          </div>

          {/* Social login hint */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:1, background:"#EDE9FE" }} />
            <span style={{ fontSize:12, color:"#9CA3AF", fontWeight:600, whiteSpace:"nowrap" }}>masuk dengan email</span>
            <div style={{ flex:1, height:1, background:"#EDE9FE" }} />
          </div>

          {/* Form fields */}
          <div style={{ display:"flex", flexDirection:"column", gap:14, flex:1 }}>
            {!isLogin && (
              <div>
                <label style={{ fontSize:11, fontWeight:800, color:"#6B7280", marginBottom:6, display:"block", letterSpacing:"0.5px", textTransform:"uppercase" }}>Nama Lengkap</label>
                <input className="lm-input" placeholder="Masukkan nama lengkapmu" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
              </div>
            )}

            <div>
              <label style={{ fontSize:11, fontWeight:800, color:"#6B7280", marginBottom:6, display:"block", letterSpacing:"0.5px", textTransform:"uppercase" }}>Email</label>
              <input className="lm-input" type="email" placeholder="email@kamu.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize:11, fontWeight:800, color:"#6B7280", marginBottom:6, display:"block", letterSpacing:"0.5px", textTransform:"uppercase" }}>Password</label>
              <div style={{ position:"relative" }}>
                <input className="lm-input" type={showPass?"text":"password"} placeholder="Min. 8 karakter" value={form.password} onChange={e => setForm({...form, password:e.target.value})} onKeyDown={e => e.key==="Enter" && handleSubmit()} style={{ paddingRight:48 }} />
                <button onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:17, color:"#9CA3AF" }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label style={{ fontSize:11, fontWeight:800, color:"#6B7280", marginBottom:6, display:"block", letterSpacing:"0.5px", textTransform:"uppercase" }}>Konfirmasi Password</label>
                <input className="lm-input" type="password" placeholder="Ulangi password" value={form.password_confirmation} onChange={e => setForm({...form, password_confirmation:e.target.value})} onKeyDown={e => e.key==="Enter" && handleSubmit()} />
                {form.password_confirmation && form.password !== form.password_confirmation && (
                  <div style={{ fontSize:12, color:"#EF4444", fontWeight:700, marginTop:5, display:"flex", alignItems:"center", gap:4 }}>❌ Password tidak cocok</div>
                )}
              </div>
            )}

            {isLogin && (
              <div style={{ textAlign:"right" }}>
                <span style={{ fontSize:12, color:"#7C3AED", fontWeight:700, cursor:"pointer" }}>Lupa password?</span>
              </div>
            )}

            <button className="lm-submit" onClick={handleSubmit} disabled={loading} style={{ marginTop:4 }}>
              {loading ? "⏳ Memproses..." : isLogin ? "🚀 Masuk Sekarang" : "🎉 Buat Akun Gratis"}
            </button>

            {/* Toggle */}
            <div style={{ textAlign:"center", fontSize:13, color:"#9CA3AF", fontWeight:600 }}>
              {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
              <button onClick={() => setIsLogin(!isLogin)} style={{ background:"none", border:"none", cursor:"pointer", fontWeight:800, fontSize:13, fontFamily:"'Nunito',sans-serif" }} className="lm-gradient">
                {isLogin ? "Daftar sekarang →" : "Masuk di sini →"}
              </button>
            </div>

            {/* Terms */}
            <p style={{ textAlign:"center", fontSize:11, color:"#C4B5FD", fontWeight:600, marginTop:4 }}>
              Dengan mendaftar, kamu menyetujui Syarat & Ketentuan TiketIn 🎫
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
