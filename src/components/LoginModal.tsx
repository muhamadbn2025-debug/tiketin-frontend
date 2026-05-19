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
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, fontFamily:"'Nunito',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Syne:wght@800;900&display=swap');
        @keyframes modal-in { from{opacity:0;transform:scale(0.92) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .modal-box { animation:modal-in 0.35s cubic-bezier(0.34,1.56,0.64,1); }
        .input-field { width:100%; padding:13px 16px; border-radius:14px; border:1.5px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.05); color:white; font-size:14px; font-weight:600; outline:none; box-sizing:border-box; font-family:'Nunito',sans-serif; transition:border-color 0.2s; }
        .input-field:focus { border-color:#7C3AED; background:rgba(124,58,237,0.08); }
        .input-field::placeholder { color:rgba(255,255,255,0.3); }
        .tab-btn { flex:1; padding:10px 0; border:none; border-radius:10px; font-weight:800; font-size:14px; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .tab-btn.active { background:linear-gradient(135deg,#7C3AED,#DB2777); color:white; box-shadow:0 4px 16px rgba(124,58,237,0.4); }
        .tab-btn:not(.active) { background:transparent; color:rgba(255,255,255,0.45); }
        .submit-btn { width:100%; padding:14px; border-radius:14px; border:none; background:linear-gradient(135deg,#7C3AED,#DB2777); color:white; font-weight:900; font-size:16px; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .submit-btn:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(124,58,237,0.5); filter:brightness(1.1); }
        .submit-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .gradient-text { background:linear-gradient(135deg,#C084FC,#EC4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
      `}</style>

      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ display:"flex", width:"100%", maxWidth:860, margin:"0 20px", borderRadius:28, overflow:"hidden", boxShadow:"0 40px 100px rgba(0,0,0,0.6)", border:"1px solid rgba(255,255,255,0.08)" }}>

        {/* LEFT */}
        <div style={{ width:320, flexShrink:0, background:"linear-gradient(135deg,#7C3AED,#DB2777)", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"40px 34px", position:"relative" }}>
          <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, background:"rgba(255,255,255,0.07)", borderRadius:"50%" }} />
          <div style={{ position:"absolute", bottom:-40, left:-40, width:170, height:170, background:"rgba(255,255,255,0.05)", borderRadius:"50%" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ fontSize:46, marginBottom:18 }}>🎫</div>
            <h2 style={{ fontSize:26, fontWeight:900, color:"white", marginBottom:12, fontFamily:"'Syne',sans-serif", lineHeight:1.2 }}>
              {isLogin ? "Selamat\nDatang\nKembali!" : "Gabung\nSekarang\nGratis!"}
            </h2>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.8)", lineHeight:1.7, fontWeight:600, marginBottom:24 }}>
              {isLogin ? "Masuk dan nikmati kemudahan booking tiket event favoritmu." : "Daftar gratis dan akses ribuan event terbaik di Indonesia."}
            </p>
            {["✅ Tiket 100% Resmi & Aman", "🔔 Notifikasi Event Terbaru", "📱 E-Ticket Langsung ke Email"].map((f,i) => (
              <div key={i} style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.85)", marginBottom:8 }}>{f}</div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex:1, background:"#0e0e18", padding:"36px 38px" }}>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:20 }}>
            <button onClick={onClose} style={{ width:30, height:30, borderRadius:"50%", background:"rgba(255,255,255,0.08)", border:"none", cursor:"pointer", fontSize:15, color:"rgba(255,255,255,0.6)", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>

          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:22, fontWeight:900, fontFamily:"'Syne',sans-serif" }} className="gradient-text">TiketIn</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", fontWeight:600, marginTop:2 }}>{isLogin ? "Masuk ke akunmu" : "Buat akun baru gratis"}</div>
          </div>

          <div style={{ display:"flex", gap:8, background:"rgba(255,255,255,0.05)", borderRadius:14, padding:6, marginBottom:24 }}>
            <button className={`tab-btn ${isLogin?"active":""}`} onClick={() => setIsLogin(true)}>Masuk</button>
            <button className={`tab-btn ${!isLogin?"active":""}`} onClick={() => setIsLogin(false)}>Daftar</button>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
            {!isLogin && (
              <div>
                <label style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.45)", marginBottom:6, display:"block", letterSpacing:"0.5px" }}>NAMA LENGKAP</label>
                <input className="input-field" placeholder="Nama lengkapmu" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
              </div>
            )}
            <div>
              <label style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.45)", marginBottom:6, display:"block", letterSpacing:"0.5px" }}>EMAIL</label>
              <input className="input-field" type="email" placeholder="email@kamu.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.45)", marginBottom:6, display:"block", letterSpacing:"0.5px" }}>PASSWORD</label>
              <div style={{ position:"relative" }}>
                <input className="input-field" type={showPass?"text":"password"} placeholder="Min. 8 karakter" value={form.password} onChange={e => setForm({...form, password:e.target.value})} onKeyDown={e => e.key==="Enter" && handleSubmit()} style={{ paddingRight:48 }} />
                <button onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16, color:"rgba(255,255,255,0.4)" }}>{showPass?"🙈":"👁️"}</button>
              </div>
            </div>
            {!isLogin && (
              <div>
                <label style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.45)", marginBottom:6, display:"block", letterSpacing:"0.5px" }}>KONFIRMASI PASSWORD</label>
                <input className="input-field" type="password" placeholder="Ulangi password" value={form.password_confirmation} onChange={e => setForm({...form, password_confirmation:e.target.value})} onKeyDown={e => e.key==="Enter" && handleSubmit()} />
                {form.password_confirmation && form.password !== form.password_confirmation && (
                  <div style={{ fontSize:12, color:"#F87171", fontWeight:700, marginTop:5 }}>❌ Password tidak cocok</div>
                )}
              </div>
            )}
            <button className="submit-btn" onClick={handleSubmit} disabled={loading} style={{ marginTop:6 }}>
              {loading ? "⏳ Memproses..." : isLogin ? "🚀 Masuk Sekarang" : "🎉 Buat Akun Gratis"}
            </button>
            <div style={{ textAlign:"center", fontSize:13, color:"rgba(255,255,255,0.4)", fontWeight:600 }}>
              {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
              <button onClick={() => setIsLogin(!isLogin)} style={{ background:"none", border:"none", cursor:"pointer", fontWeight:800, fontSize:13, fontFamily:"'Nunito',sans-serif" }} className="gradient-text">
                {isLogin ? "Daftar sekarang" : "Masuk di sini"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
