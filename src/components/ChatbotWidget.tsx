import { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Message {
  role: "user" | "ai" | "system";
  text: string;
  time: string;
}

const quickReplies = [
  { label: "🎫 Event tersedia apa?", text: "Event apa saja yang tersedia sekarang?" },
  { label: "📖 Cara booking tiket", text: "Bagaimana cara booking tiket di TiketIn?" },
  { label: "💳 Metode pembayaran", text: "Apa saja metode pembayaran yang tersedia?" },
  { label: "🔄 Cara refund tiket", text: "Bagaimana cara refund atau cancel tiket?" },
  { label: "📱 Cara pakai e-ticket", text: "Bagaimana cara menggunakan e-ticket saat di venue?" },
  { label: "🛡️ Keamanan tiket", text: "Bagaimana TiketIn menjamin keamanan tiket dari pemalsuan?" },
];

const getTime = () => new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

const SYSTEM_PROMPT = `Kamu adalah Tia, asisten virtual TiketIn — platform booking tiket event dan konser terpercaya di Indonesia.

Tugasmu:
- Bantu user seputar booking tiket, event yang tersedia, pembayaran, dan penggunaan platform
- Jawab dengan ramah, singkat, dan jelas dalam Bahasa Indonesia
- Gunakan emoji yang relevan untuk membuat percakapan lebih hidup
- Maksimal 3-4 kalimat per jawaban

Info penting TiketIn:
- Platform booking tiket konser, festival, dan event di Indonesia
- Tiket 100% resmi dari penyelenggara, anti-calo dan anti-palsu
- Metode pembayaran: Transfer Bank, E-Wallet (GoPay, OVO, Dana), Kartu Kredit
- E-ticket dikirim via email setelah pembayaran
- Scan QR code di pintu masuk venue
- Refund/cancel bisa dilakukan maksimal H-3 sebelum event
- Customer service: cs@tiketin.com | 0800-TIKETIN
- Event tersedia: Konser, Festival, Olahraga, Pameran

Jika ditanya di luar topik TiketIn, tetap jawab dengan sopan tapi arahkan kembali ke topik TiketIn.`;

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Halo! Aku **Tia**, asisten virtual TiketIn 👋\n\nAda yang bisa aku bantu seputar booking tiket atau event? Pilih topik di bawah atau ketik pertanyaanmu!",
      time: getTime()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [hasNew, setHasNew] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setHasNew(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setShowQuickReplies(false);

    const userMsg: Message = { role: "user", text: text.trim(), time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
        const res = await axios.post("/api/chatbot", {
          message: text.trim()
        });
        const aiText = res.data.reply || "Maaf, coba tanya lagi ya! 😊";
        setMessages(prev => [...prev, { role: "ai", text: aiText, time: getTime() }]);
      } catch {
        setMessages(prev => [...prev, {
          role: "ai",
          text: "Maaf, ada gangguan koneksi 😅 Silakan hubungi kami di cs@tiketin.com atau coba lagi sebentar!",
          time: getTime()
        }]);
      } finally {
        setLoading(false);
      }
    };

    const handleQuickReply = (text: string) => {
      sendMessage(text);
    };

    const formatText = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br/>");
    };

    return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        @keyframes chat-open { from{opacity:0;transform:scale(0.85) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes msg-in-ai { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes msg-in-user { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes pulse-dot { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes wiggle { 0%,100%{transform:rotate(-8deg)} 50%{transform:rotate(8deg)} }
        @keyframes slide-up { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes notif-pop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }

        .chat-window { animation: chat-open 0.35s cubic-bezier(0.34,1.56,0.64,1); }
        .msg-ai { animation: msg-in-ai 0.3s ease; }
        .msg-user { animation: msg-in-user 0.3s ease; }
        .float-anim { animation: float 3s ease-in-out infinite; }
        .wiggle { animation: wiggle 0.5s ease; }

        .chat-input {
          flex:1; border:none; outline:none; background:transparent;
          font-size:14px; font-weight:600; color:#1F2937;
          font-family:'Nunito',sans-serif;
        }
        .chat-input::placeholder { color:#9CA3AF; }

        .quick-btn {
          background:white; border:1.5px solid #DDD6FE; border-radius:50px;
          padding:7px 14px; font-size:12px; font-weight:700; cursor:pointer;
          color:#7C3AED; font-family:'Nunito',sans-serif;
          transition:all 0.2s; white-space:nowrap;
          animation: slide-up 0.3s ease both;
        }
        .quick-btn:hover { background:#EDE9FE; border-color:#7C3AED; transform:translateY(-2px); }

        .send-btn {
          width:36px; height:36px; border-radius:50%; border:none;
          background:linear-gradient(135deg,#7C3AED,#EC4899);
          color:white; cursor:pointer; display:flex; align-items:center;
          justify-content:center; font-size:16px; transition:all 0.2s;
          flex-shrink:0;
        }
        .send-btn:hover { transform:scale(1.1); box-shadow:0 4px 12px rgba(124,58,237,0.4); }
        .send-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

        .typing-dot {
          width:7px; height:7px; border-radius:50%;
          background:#7C3AED; display:inline-block;
          animation: pulse-dot 1.2s ease-in-out infinite;
        }

        /* Scrollbar */
        .chat-messages::-webkit-scrollbar { width:4px; }
        .chat-messages::-webkit-scrollbar-track { background:transparent; }
        .chat-messages::-webkit-scrollbar-thumb { background:#DDD6FE; border-radius:99px; }
      `}</style>

        {/* FLOATING BUTTON */}
        <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>

          {/* Chat window */}
          {isOpen && (
            <div className="chat-window" style={{ width: 360, height: 540, background: "white", borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(124,58,237,0.2)", border: "1.5px solid #EDE9FE" }}>

              {/* Header */}
              <div style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 42, height: 42, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: "2px solid rgba(255,255,255,0.4)" }}>
                      🤖
                    </div>
                    <div style={{ position: "absolute", bottom: 0, right: 0, width: 11, height: 11, background: "#4ADE80", borderRadius: "50%", border: "2px solid white" }} />
                  </div>
                  <div>
                    <div style={{ color: "white", fontWeight: 900, fontSize: 15, fontFamily: "'Nunito',sans-serif" }}>Tia</div>
                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 6, height: 6, background: "#4ADE80", borderRadius: "50%", display: "inline-block" }} />
                      Asisten TiketIn · Online
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setMessages([{ role: "ai", text: "Halo! Aku **Tia**, asisten virtual TiketIn 👋\n\nAda yang bisa aku bantu?", time: getTime() }]); setShowQuickReplies(true); }}
                    style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", fontSize: 14, color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
                    title="Reset chat">🔄</button>
                  <button onClick={() => setIsOpen(false)} style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", fontSize: 16, color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages" style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12, background: "#FAFAFF" }}>

                {messages.map((msg, i) => (
                  <div key={i} className={msg.role === "user" ? "msg-user" : "msg-ai"} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>

                    {/* AI Avatar */}
                    {msg.role === "ai" && (
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, boxShadow: "0 2px 8px rgba(124,58,237,0.25)" }}>🤖</div>
                    )}

                    <div style={{ maxWidth: "75%" }}>
                      <div style={{
                        padding: "10px 14px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        fontSize: 13, lineHeight: 1.65, fontWeight: 600,
                        background: msg.role === "user" ? "linear-gradient(135deg,#7C3AED,#EC4899)" : "white",
                        color: msg.role === "user" ? "white" : "#1F2937",
                        border: msg.role === "ai" ? "1px solid #EDE9FE" : "none",
                        boxShadow: msg.role === "ai" ? "0 2px 8px rgba(124,58,237,0.08)" : "0 2px 8px rgba(124,58,237,0.25)",
                        fontFamily: "'Nunito',sans-serif"
                      }}
                        dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                      />
                      <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, marginTop: 4, textAlign: msg.role === "user" ? "right" : "left" }}>{msg.time}</div>
                    </div>

                    {/* User Avatar */}
                    {msg.role === "user" && (
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#F59E0B,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "white", flexShrink: 0 }}>
                        {JSON.parse(localStorage.getItem("user") || "{}")?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="msg-ai" style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
                    <div style={{ background: "white", border: "1px solid #EDE9FE", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 5, alignItems: "center", boxShadow: "0 2px 8px rgba(124,58,237,0.08)" }}>
                      <div className="typing-dot" style={{ animationDelay: "0s" }} />
                      <div className="typing-dot" style={{ animationDelay: "0.2s" }} />
                      <div className="typing-dot" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                )}

                {/* Quick replies */}
                {showQuickReplies && !loading && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                    {quickReplies.map((qr, i) => (
                      <button key={i} className="quick-btn" onClick={() => handleQuickReply(qr.text)} style={{ animationDelay: `${i * 0.06}s` }}>
                        {qr.label}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: "12px 16px", background: "white", borderTop: "1px solid #EDE9FE", flexShrink: 0 }}>
                {/* Quick action chips */}
                {!showQuickReplies && (
                  <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto", paddingBottom: 2 }}>
                    {["🎫 Event", "💳 Bayar", "📱 E-Ticket", "🔄 Refund"].map((chip, i) => (
                      <button key={i} onClick={() => handleQuickReply(chip.replace(/^[^\s]+\s/, "") === "Event" ? "Event apa yang tersedia?" : chip.replace(/^[^\s]+\s/, "") === "Bayar" ? "Metode pembayaran apa saja?" : chip.replace(/^[^\s]+\s/, "") === "E-Ticket" ? "Cara pakai e-ticket?" : "Cara refund tiket?")}
                        style={{ background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: 50, padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", color: "#7C3AED", fontFamily: "'Nunito',sans-serif", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s" }}
                        onMouseOver={e => (e.currentTarget.style.background = "#EDE9FE")}
                        onMouseOut={e => (e.currentTarget.style.background = "#F5F3FF")}>
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F5F3FF", borderRadius: 50, padding: "8px 8px 8px 16px", border: "1.5px solid #EDE9FE" }}>
                  <input
                    ref={inputRef}
                    className="chat-input"
                    placeholder="Ketik pertanyaanmu..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                    style={{ background: "transparent" }}
                  />
                  <button className="send-btn" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
                    {loading ? "⏳" : "➤"}
                  </button>
                </div>

                <div style={{ textAlign: "center", fontSize: 10, color: "#C4B5FD", fontWeight: 600, marginTop: 8 }}>
                  Powered by Claude AI · TiketIn 🎫
                </div>
              </div>
            </div>
          )}

          {/* Floating button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{ width: 60, height: 60, background: "linear-gradient(135deg,#7C3AED,#EC4899)", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, cursor: "pointer", boxShadow: "0 8px 32px rgba(124,58,237,0.5)", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)", position: "relative" }}
            onMouseOver={e => (e.currentTarget.style.transform = "scale(1.12)")}
            onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            {isOpen ? "✕" : "💬"}

            {/* Notification badge */}
            {!isOpen && hasNew && (
              <div style={{ position: "absolute", top: -4, right: -4, width: 20, height: 20, background: "#F59E0B", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "white", animation: "notif-pop 0.3s ease", border: "2px solid white" }}>1</div>
            )}

            {/* Ping effect */}
            {!isOpen && (
              <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "2px solid rgba(124,58,237,0.3)", animation: "bounce 2s ease-in-out infinite" }} />
            )}
          </button>

          {/* Tooltip */}
          {!isOpen && (
            <div className="float-anim" style={{ background: "white", borderRadius: 12, padding: "8px 14px", boxShadow: "0 4px 20px rgba(124,58,237,0.15)", border: "1.5px solid #EDE9FE", pointerEvents: "none" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#7C3AED" }}>💬 Ada yang bisa aku bantu?</div>
            </div>
          )}
        </div>
      </>
    );
  }
