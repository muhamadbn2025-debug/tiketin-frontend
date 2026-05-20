import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const dummyEvent = {
  id: 1, title: "Coldplay: Music of the Spheres", category: "Konser",
  date: "14 Jun 2026", time: "19:00 WIB", location: "Jakarta",
  venue: "Gelora Bung Karno Stadium",
  img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop",
  tickets: [
    { id: 1, name: "Festival", price: 750000, quota: 10000, sold: 5000, description: "Akses area festival umum, standing" },
    { id: 2, name: "VIP", price: 1500000, quota: 2000, sold: 1800, description: "Area VIP dengan tempat duduk premium" },
    { id: 3, name: "VVIP", price: 3000000, quota: 500, sold: 300, description: "Meet & greet eksklusif + merchandise" },
  ]
};

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(dummyEvent);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"select" | "success">("select");
  const [bookingResult, setBookingResult] = useState<any>(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`/api/events/${id}`);
      if (res.data.data) {
        const e = res.data.data;
        setEvent({
          ...e,
          img: e.image,
          date: new Date(e.event_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
          time: new Date(e.event_date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
          tickets: e.tickets || dummyEvent.tickets,
        });
      }
    } catch { }
  };

  const handleBook = async () => {
    if (!selectedTicket) { toast.error("Pilih jenis tiket dulu!"); return; }
    setLoading(true);
    try {
      const res = await axios.post("/api/bookings", {
        event_id: event.id,
        ticket_id: selectedTicket.id,
        quantity,
        payment_method: paymentMethod,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setBookingResult(res.data.data);
      setStep("success");
      toast.success("Booking berhasil! 🎫");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal booking, coba lagi!");
    } finally { setLoading(false); }
  };

  const formatPrice = (p: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3FF", fontFamily: "'Nunito',sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');

        @keyframes success-pop { 0%{transform:scale(0)} 70%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        .ticket-option {
          border:2px solid #EDE9FE; border-radius:14px; padding:14px 16px;
          cursor:pointer; transition:all 0.2s; background:white;
          box-shadow:0 2px 8px rgba(124,58,237,0.05);
        }
        .ticket-option:hover { border-color:#7C3AED; box-shadow:0 4px 16px rgba(124,58,237,0.12); }
        .ticket-option.selected { border-color:#7C3AED; background:#F5F3FF; box-shadow:0 6px 20px rgba(124,58,237,0.15); }

        .pay-option {
          border:2px solid #EDE9FE; border-radius:12px; padding:12px 14px;
          cursor:pointer; transition:all 0.2s; background:white;
          display:flex; align-items:center; gap:10px;
        }
        .pay-option:hover { border-color:#7C3AED; }
        .pay-option.selected { border-color:#7C3AED; background:#F5F3FF; }

        .btn-primary { background:linear-gradient(135deg,#7C3AED,#EC4899); color:white; border:none; border-radius:14px; font-weight:800; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(124,58,237,0.4); }
        .btn-primary:disabled { opacity:0.6; cursor:not-allowed; transform:none; }

        .success-anim { animation:success-pop 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        .float-anim { animation:float 3s ease-in-out infinite; }

        /* Desktop layout */
        .booking-layout { display:flex; gap:24px; max-width:1100px; margin:0 auto; padding:24px; align-items:flex-start; }
        .booking-sidebar { width:320px; flex-shrink:0; position:sticky; top:72px; }

        /* Mobile */
        @media (max-width:768px) {
          .booking-layout { flex-direction:column !important; padding:12px !important; gap:14px !important; }
          .booking-sidebar { width:100% !important; position:static !important; }
          .booking-main { min-width:0 !important; }
          .bp-nav-title { font-size:13px !important; }
          .ticket-option { padding:12px !important; }
          .ticket-inner { flex-direction:column !important; gap:10px !important; }
          .ticket-price-col { text-align:left !important; }
          .ticket-info-col { flex-direction:row !important; gap:10px !important; align-items:flex-start !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ background: "white", borderBottom: "1.5px solid #EDE9FE", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }} onClick={() => navigate(-1)}>
          <button style={{ background: "#F5F3FF", border: "1.5px solid #DDD6FE", borderRadius: 10, width: 34, height: 34, cursor: "pointer", fontSize: 16, color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>←</button>
          <span className="bp-nav-title" style={{ fontSize: 14, fontWeight: 700, color: "#6B7280", whiteSpace: "nowrap" }}>Kembali</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🎫</div>
          <span style={{ fontSize: 15, fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif", background: "linear-gradient(135deg,#7C3AED,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TiketIn</span>
        </div>
      </nav>

      {/* SUCCESS STATE */}
      {step === "success" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh", padding: "20px 16px" }}>
          <div style={{ background: "white", borderRadius: 24, padding: "32px 24px", maxWidth: 440, width: "100%", textAlign: "center", boxShadow: "0 32px 80px rgba(124,58,237,0.2)", border: "1.5px solid #EDE9FE" }}>
            <div className="success-anim" style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1F2937", marginBottom: 6, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Booking Berhasil!</h2>
            <p style={{ fontSize: 13, color: "#6B7280", fontWeight: 600, marginBottom: 20 }}>Tiketmu sudah siap! Cek dashboard untuk melihat e-ticket.</p>
            <div style={{ background: "#F5F3FF", borderRadius: 14, padding: "16px", marginBottom: 20, border: "1.5px solid #EDE9FE" }}>
              <div className="float-anim" style={{ fontSize: 52, marginBottom: 6 }}>🎫</div>
              <div style={{ fontSize: 11, color: "#7C3AED", fontWeight: 800, letterSpacing: "1px", marginBottom: 4 }}>{bookingResult?.booking_code || "TKT-2026-XXXXXX"}</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#1F2937", marginBottom: 2 }}>{event.title}</div>
              <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>{event.date} · {event.venue}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {[
                { label: "Tiket", value: selectedTicket?.name },
                { label: "Jumlah", value: `${quantity}x` },
                { label: "Total", value: formatPrice(totalPrice) },
                { label: "Status", value: "✅ Dibayar" },
              ].map((item, i) => (
                <div key={i} style={{ background: "#FAFAFF", borderRadius: 10, padding: "9px 11px", border: "1px solid #EDE9FE" }}>
                  <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 800, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1F2937" }}>{item.value}</div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/dashboard")} className="btn-primary" style={{ width: "100%", padding: "13px 0", fontSize: 14, marginBottom: 8 }}>
              📱 Lihat E-Ticket di Dashboard
            </button>
            <button onClick={() => navigate("/events")} style={{ width: "100%", padding: "11px 0", fontSize: 13, background: "white", border: "1.5px solid #DDD6FE", borderRadius: 14, fontWeight: 700, cursor: "pointer", color: "#7C3AED", fontFamily: "'Nunito',sans-serif" }}>
              🎪 Cari Event Lainnya
            </button>
          </div>
        </div>
      )}

      {/* BOOKING FORM */}
      {step !== "success" && (
        <div className="booking-layout">

          {/* LEFT */}
          <div className="booking-main" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Event Info */}
            <div style={{ background: "white", borderRadius: 18, overflow: "hidden", border: "1.5px solid #EDE9FE", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
              <div style={{ position: "relative", height: 160 }}>
                <img src={event.img || event.image || dummyEvent.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={event.title}
                  onError={e => { (e.target as HTMLImageElement).src = dummyEvent.img; }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(30,10,60,0.85),transparent 45%)" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#7C3AED,#EC4899,#F59E0B)" }} />
                <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "white", fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 4, lineHeight: 1.3 }}>{event.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>📅 {event.date} {event.time} · 📍 {event.venue}</div>
                </div>
              </div>
            </div>

            {/* STEP 1 — Pilih Tiket */}
            <div style={{ background: "white", borderRadius: 18, padding: "18px 16px", border: "1.5px solid #EDE9FE", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "white", flexShrink: 0 }}>1</div>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: "#1F2937" }}>Pilih Jenis Tiket</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(event.tickets || dummyEvent.tickets).map((ticket: any) => {
                  const remaining = ticket.quota - ticket.sold;
                  const isSoldOut = remaining <= 0;
                  return (
                    <div key={ticket.id}
                      className={`ticket-option ${selectedTicket?.id === ticket.id ? "selected" : ""}`}
                      onClick={() => !isSoldOut && setSelectedTicket(ticket)}
                      style={{ opacity: isSoldOut ? 0.5 : 1, cursor: isSoldOut ? "not-allowed" : "pointer" }}>
                      {/* Row: radio + info | harga */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        {/* Kiri: radio + nama + desc */}
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1, minWidth: 0 }}>
                          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selectedTicket?.id === ticket.id ? "#7C3AED" : "#DDD6FE"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                            {selectedTicket?.id === ticket.id && <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#7C3AED" }} />}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 900, color: "#1F2937", marginBottom: 2 }}>{ticket.name}</div>
                            <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, lineHeight: 1.4 }}>{ticket.description}</div>
                          </div>
                        </div>
                        {/* Kanan: harga + sisa */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 900, color: "#7C3AED", fontFamily: "'Plus Jakarta Sans',sans-serif", whiteSpace: "nowrap" }}>{formatPrice(ticket.price)}</div>
                          <div style={{ fontSize: 10, color: remaining < 100 ? "#DC2626" : "#9CA3AF", fontWeight: 700, marginTop: 2 }}>
                            {isSoldOut ? "❌ Habis" : `${remaining.toLocaleString()} sisa`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2 — Jumlah */}
            {selectedTicket && (
              <div style={{ background: "white", borderRadius: 18, padding: "18px 16px", border: "1.5px solid #EDE9FE", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "white", flexShrink: 0 }}>2</div>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: "#1F2937" }}>Jumlah Tiket</h3>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 38, height: 38, borderRadius: 10, border: "1.5px solid #DDD6FE", background: "white", fontSize: 18, cursor: "pointer", color: "#7C3AED", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>−</button>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#1F2937", minWidth: 36, textAlign: "center" }}>{quantity}</div>
                  <button onClick={() => setQuantity(q => Math.min(10, q + 1))} style={{ width: 38, height: 38, borderRadius: 10, border: "1.5px solid #DDD6FE", background: "white", fontSize: 18, cursor: "pointer", color: "#7C3AED", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>+</button>
                  <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>Maks. 10 tiket</span>
                </div>
              </div>
            )}

            {/* STEP 3 — Pembayaran */}
            {selectedTicket && (
              <div style={{ background: "white", borderRadius: 18, padding: "18px 16px", border: "1.5px solid #EDE9FE", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "white", flexShrink: 0 }}>3</div>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: "#1F2937" }}>Metode Pembayaran</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { value: "transfer", label: "Transfer Bank", icon: "🏦", sub: "BCA, Mandiri, BNI, BRI" },
                    { value: "ewallet", label: "E-Wallet", icon: "📱", sub: "GoPay, OVO, Dana, ShopeePay" },
                    { value: "credit_card", label: "Kartu Kredit", icon: "💳", sub: "Visa, Mastercard, JCB" },
                  ].map(pay => (
                    <div key={pay.value} className={`pay-option ${paymentMethod === pay.value ? "selected" : ""}`} onClick={() => setPaymentMethod(pay.value)}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${paymentMethod === pay.value ? "#7C3AED" : "#DDD6FE"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {paymentMethod === pay.value && <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#7C3AED" }} />}
                      </div>
                      <span style={{ fontSize: 16 }}>{pay.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#1F2937" }}>{pay.label}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{pay.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Summary */}
          <div className="booking-sidebar">
            <div style={{ background: "white", borderRadius: 18, padding: "18px 16px", border: "1.5px solid #EDE9FE", boxShadow: "0 4px 24px rgba(124,58,237,0.1)" }}>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: "#1F2937", marginBottom: 14 }}>📋 Ringkasan Pesanan</h3>

              {/* User */}
              <div style={{ background: "#F5F3FF", borderRadius: 12, padding: "11px 13px", marginBottom: 14, border: "1px solid #EDE9FE" }}>
                <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 800, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>Pemesan</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#1F2937" }}>{user?.name || "User"}</div>
                <div style={{ fontSize: 11, color: "#7C3AED", fontWeight: 600 }}>{user?.email || ""}</div>
              </div>

              {selectedTicket ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                    {[
                      { label: "Event", value: event.title },
                      { label: "Tanggal", value: event.date },
                      { label: "Venue", value: event.venue },
                      { label: "Tiket", value: selectedTicket.name },
                      { label: "Harga/tiket", value: formatPrice(selectedTicket.price) },
                      { label: "Jumlah", value: `${quantity}x` },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, flexShrink: 0 }}>{item.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#1F2937", textAlign: "right", maxWidth: 160 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: 1, background: "#EDE9FE", marginBottom: 12 }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: "#1F2937" }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: "#7C3AED", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{formatPrice(totalPrice)}</span>
                  </div>
                  <button onClick={handleBook} disabled={loading} className="btn-primary" style={{ width: "100%", padding: "13px 0", fontSize: 14, marginBottom: 8 }}>
                    {loading ? "⏳ Memproses..." : "🎫 Konfirmasi Booking"}
                  </button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>👆</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>Pilih jenis tiket terlebih dahulu</div>
                </div>
              )}

              <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                {["🛡️ Resmi", "🔒 Aman", "📱 E-Ticket"].map((t, i) => (
                  <span key={i} style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
