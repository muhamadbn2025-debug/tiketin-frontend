import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const dummyEvent = {
  id: 1, title: "Coldplay: Music of the Spheres", category: "Konser",
  date: "14 Jun 2026", time: "19:00 WIB", location: "Jakarta",
  venue: "Gelora Bung Karno Stadium",
  img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop",
  description: "Konser spektakuler Coldplay hadir di Jakarta! Nikmati penampilan luar biasa dengan teknologi LED terbaru.",
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
  const [step, setStep] = useState<"select" | "confirm" | "success">("select");
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
    <div style={{ minHeight: "100vh", background: "#F5F3FF", fontFamily: "'Nunito',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');

        @keyframes slide-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes success-pop { 0%{transform:scale(0)} 70%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        .ticket-option {
          border:2px solid #EDE9FE; border-radius:16px; padding:16px 18px;
          cursor:pointer; transition:all 0.2s; background:white;
          box-shadow:0 2px 8px rgba(124,58,237,0.05);
        }
        .ticket-option:hover { border-color:#7C3AED; box-shadow:0 6px 24px rgba(124,58,237,0.12); transform:translateY(-2px); }
        .ticket-option.selected { border-color:#7C3AED; background:#F5F3FF; box-shadow:0 8px 28px rgba(124,58,237,0.2); }

        .pay-option {
          border:2px solid #EDE9FE; border-radius:14px; padding:14px 16px;
          cursor:pointer; transition:all 0.2s; background:white;
          display:flex; align-items:center; gap:12px;
        }
        .pay-option:hover { border-color:#7C3AED; }
        .pay-option.selected { border-color:#7C3AED; background:#F5F3FF; }

        .btn-primary { background:linear-gradient(135deg,#7C3AED,#EC4899); color:white; border:none; border-radius:14px; font-weight:800; cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.2s; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(124,58,237,0.4); }
        .btn-primary:disabled { opacity:0.6; cursor:not-allowed; transform:none; }

        .step-badge { display:inline-flex; align-items:center; gap:6px; background:#EDE9FE; border:1px solid #DDD6FE; borderRadius:50px; padding:5px 14px; font-size:12px; font-weight:800; color:#7C3AED; }

        .success-anim { animation:success-pop 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        .float-anim { animation:float 3s ease-in-out infinite; }

        @media (max-width:768px) {
          .booking-layout { flex-direction:column !important; }
          .booking-sidebar { width:100% !important; position:static !important; }
          .booking-main { padding:16px !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ background: "white", borderBottom: "1.5px solid #EDE9FE", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => navigate("/events")}>
          <button style={{ background: "#F5F3FF", border: "1.5px solid #DDD6FE", borderRadius: 10, width: 34, height: 34, cursor: "pointer", fontSize: 16, color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#6B7280" }}>Kembali ke Event</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎫</div>
          <span style={{ fontSize: 16, fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif", background: "linear-gradient(135deg,#7C3AED,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TiketIn</span>
        </div>
      </nav>

      {/* SUCCESS STATE */}
      {step === "success" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh", padding: "24px" }}>
          <div style={{ background: "white", borderRadius: 28, padding: "40px 32px", maxWidth: 460, width: "100%", textAlign: "center", boxShadow: "0 32px 80px rgba(124,58,237,0.2)", border: "1.5px solid #EDE9FE" }}>
            <div className="success-anim" style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#1F2937", marginBottom: 8, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Booking Berhasil!</h2>
            <p style={{ fontSize: 14, color: "#6B7280", fontWeight: 600, marginBottom: 24 }}>Tiketmu sudah siap! Cek dashboard untuk melihat e-ticket.</p>

            <div style={{ background: "#F5F3FF", borderRadius: 16, padding: "20px", marginBottom: 24, border: "1.5px solid #EDE9FE" }}>
              <div className="float-anim" style={{ fontSize: 64, marginBottom: 8 }}>🎫</div>
              <div style={{ fontSize: 12, color: "#7C3AED", fontWeight: 800, letterSpacing: "1px", marginBottom: 6 }}>
                {bookingResult?.booking_code || "TKT-2026-XXXXXX"}
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#1F2937", marginBottom: 4 }}>{event.title}</div>
              <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>{event.date} · {event.venue}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              {[
                { label: "Tiket", value: selectedTicket?.name },
                { label: "Jumlah", value: `${quantity}x` },
                { label: "Total", value: formatPrice(totalPrice) },
                { label: "Status", value: "✅ Dibayar" },
              ].map((item, i) => (
                <div key={i} style={{ background: "#FAFAFF", borderRadius: 12, padding: "10px 12px", border: "1px solid #EDE9FE" }}>
                  <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 800, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1F2937" }}>{item.value}</div>
                </div>
              ))}
            </div>

            <button onClick={() => navigate("/dashboard")} className="btn-primary" style={{ width: "100%", padding: "14px 0", fontSize: 15, marginBottom: 10 }}>
              📱 Lihat E-Ticket di Dashboard
            </button>
            <button onClick={() => navigate("/events")} style={{ width: "100%", padding: "12px 0", fontSize: 14, background: "white", border: "1.5px solid #DDD6FE", borderRadius: 14, fontWeight: 700, cursor: "pointer", color: "#7C3AED", fontFamily: "'Nunito',sans-serif" }}>
              🎪 Cari Event Lainnya
            </button>
          </div>
        </div>
      )}

      {/* BOOKING FORM */}
      {step !== "success" && (
        <div className="booking-layout" style={{ display: "flex", gap: 24, maxWidth: 1100, margin: "0 auto", padding: "28px 24px", alignItems: "flex-start" }}>

          {/* LEFT - Form */}
          <div className="booking-main" style={{ flex: 1, minWidth: 0 }}>

            {/* Event Info */}
            <div style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1.5px solid #EDE9FE", marginBottom: 20, boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
              <div style={{ position: "relative", height: 180 }}>
                <img src={event.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={event.title} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(30,10,60,0.8),transparent 50%)" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#7C3AED,#EC4899,#F59E0B)" }} />
                <div style={{ position: "absolute", bottom: 16, left: 18 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "white", fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 4 }}>{event.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>📅 {event.date} {event.time} · 📍 {event.venue}</div>
                </div>
              </div>
            </div>

            {/* STEP 1 — Pilih Tiket */}
            <div style={{ background: "white", borderRadius: 20, padding: "22px", border: "1.5px solid #EDE9FE", marginBottom: 20, boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "white" }}>1</div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: "#1F2937" }}>Pilih Jenis Tiket</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(event.tickets || dummyEvent.tickets).map((ticket: any) => {
                  const remaining = ticket.quota - ticket.sold;
                  const isSoldOut = remaining <= 0;
                  return (
                    <div key={ticket.id} className={`ticket-option ${selectedTicket?.id === ticket.id ? "selected" : ""} ${isSoldOut ? "opacity-50" : ""}`}
                      onClick={() => !isSoldOut && setSelectedTicket(ticket)}
                      style={{ opacity: isSoldOut ? 0.5 : 1, cursor: isSoldOut ? "not-allowed" : "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selectedTicket?.id === ticket.id ? "#7C3AED" : "#DDD6FE"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {selectedTicket?.id === ticket.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7C3AED" }} />}
                          </div>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 900, color: "#1F2937", marginBottom: 2 }}>{ticket.name}</div>
                            <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>{ticket.description}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 16, fontWeight: 900, color: "#7C3AED", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{formatPrice(ticket.price)}</div>
                          <div style={{ fontSize: 11, color: remaining < 100 ? "#DC2626" : "#9CA3AF", fontWeight: 700 }}>
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
              <div style={{ background: "white", borderRadius: 20, padding: "22px", border: "1.5px solid #EDE9FE", marginBottom: 20, boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "white" }}>2</div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: "#1F2937" }}>Jumlah Tiket</h3>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, borderRadius: 12, border: "1.5px solid #DDD6FE", background: "white", fontSize: 20, cursor: "pointer", color: "#7C3AED", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#1F2937", minWidth: 40, textAlign: "center" }}>{quantity}</div>
                  <button onClick={() => setQuantity(q => Math.min(10, q + 1))} style={{ width: 40, height: 40, borderRadius: 12, border: "1.5px solid #DDD6FE", background: "white", fontSize: 20, cursor: "pointer", color: "#7C3AED", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>Maks. 10 tiket per transaksi</span>
                </div>
              </div>
            )}

            {/* STEP 3 — Pembayaran */}
            {selectedTicket && (
              <div style={{ background: "white", borderRadius: 20, padding: "22px", border: "1.5px solid #EDE9FE", marginBottom: 20, boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "white" }}>3</div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: "#1F2937" }}>Metode Pembayaran</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { value: "transfer", label: "Transfer Bank", icon: "🏦", sub: "BCA, Mandiri, BNI, BRI" },
                    { value: "ewallet", label: "E-Wallet", icon: "📱", sub: "GoPay, OVO, Dana, ShopeePay" },
                    { value: "credit_card", label: "Kartu Kredit", icon: "💳", sub: "Visa, Mastercard, JCB" },
                  ].map(pay => (
                    <div key={pay.value} className={`pay-option ${paymentMethod === pay.value ? "selected" : ""}`} onClick={() => setPaymentMethod(pay.value)}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${paymentMethod === pay.value ? "#7C3AED" : "#DDD6FE"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {paymentMethod === pay.value && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7C3AED" }} />}
                      </div>
                      <span style={{ fontSize: 18 }}>{pay.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#1F2937" }}>{pay.label}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{pay.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT - Summary */}
          <div className="booking-sidebar" style={{ width: 320, flexShrink: 0, position: "sticky", top: 84 }}>
            <div style={{ background: "white", borderRadius: 20, padding: "22px", border: "1.5px solid #EDE9FE", boxShadow: "0 4px 24px rgba(124,58,237,0.1)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: "#1F2937", marginBottom: 18 }}>📋 Ringkasan Pesanan</h3>

              {/* User info */}
              <div style={{ background: "#F5F3FF", borderRadius: 14, padding: "12px 14px", marginBottom: 16, border: "1px solid #EDE9FE" }}>
                <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 800, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Pemesan</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#1F2937" }}>{user?.name || "User"}</div>
                <div style={{ fontSize: 12, color: "#7C3AED", fontWeight: 600 }}>{user?.email || ""}</div>
              </div>

              {selectedTicket ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                    {[
                      { label: "Event", value: event.title, small: true },
                      { label: "Tanggal", value: `${event.date}` },
                      { label: "Venue", value: event.venue, small: true },
                      { label: "Kategori Tiket", value: selectedTicket.name },
                      { label: "Harga/tiket", value: formatPrice(selectedTicket.price) },
                      { label: "Jumlah", value: `${quantity}x` },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 700 }}>{item.label}</span>
                        <span style={{ fontSize: item.small ? 11 : 13, fontWeight: 800, color: "#1F2937", textAlign: "right", maxWidth: 160 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ height: 1, background: "linear-gradient(90deg,#EDE9FE,transparent)", marginBottom: 14 }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <span style={{ fontSize: 15, fontWeight: 900, color: "#1F2937" }}>Total</span>
                    <span style={{ fontSize: 20, fontWeight: 900, color: "#7C3AED", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{formatPrice(totalPrice)}</span>
                  </div>

                  <button onClick={handleBook} disabled={loading} className="btn-primary" style={{ width: "100%", padding: "14px 0", fontSize: 15, marginBottom: 10 }}>
                    {loading ? "⏳ Memproses..." : "🎫 Konfirmasi Booking"}
                  </button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>👆</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>Pilih jenis tiket terlebih dahulu</div>
                </div>
              )}

              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                {["🛡️ Tiket Resmi", "🔒 Pembayaran Aman", "📱 E-Ticket Instan"].map((t, i) => (
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
