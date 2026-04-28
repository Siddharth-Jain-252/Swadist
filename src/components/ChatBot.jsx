import React, { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are a friendly customer service assistant for Swadist, an Indian food delivery app. 
You help customers with questions about:
- Menu items and prices (Fried Chicken ₹249, Sandwich ₹149, Koshary ₹179, Sushi ₹399, Shawarma ₹199, Pizza ₹349, Burger ₹229, Salad ₹169, Pasta ₹279)
- Delivery cities: Mumbai, Delhi, Bengaluru, Hyderabad, Pune, Jalandhar, Lucknow
- Delivery options: Car (fast), Motorbike (fastest), Bicycle (eco-friendly)
- Order tracking, delivery times, and estimated costs
- Cancellations, refunds, and complaints
- General app usage

Be concise, warm, and helpful. Use emojis occasionally. If you don't know something specific, suggest the customer contact support@swadist.in. Always stay on-topic for a food delivery service.`;

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 shrink-0 mt-1"
          style={{ background: "var(--saffron)", color: "#fff" }}
        >
          🍽️
        </div>
      )}
      <div
        className="max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
        style={
          isUser
            ? { background: "var(--saffron)", color: "#fff", borderBottomRightRadius: "4px" }
            : { background: "#fff", color: "var(--dark)", border: "1px solid var(--border)", borderBottomLeftRadius: "4px" }
        }
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! 👋 I'm Swadist's support assistant. How can I help you today? Ask me about our menu, delivery, or anything else!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
  if (open) {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => inputRef.current?.focus(), 100);
  }
}, [open, messages]);

  async function sendMessage() {
  const text = input.trim();
  if (!text || loading) return;

  const newMessages = [...messages, { role: "user", content: text }];
  setMessages(newMessages);
  setInput("");
  setLoading(true);

  try {
    const apikey = import.meta.env.VITE_GROQ_API_KEY;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apikey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...newMessages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't process that. Please try again!";
    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
  } catch {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Oops! Something went wrong. Please try again or email support@swadist.in 🙏" },
    ]);
  } finally {
    setLoading(false);
  }
}

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => {
            setOpen((o) => !o);
            setHasNotif(false);
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-transform duration-200 hover:scale-110"
        style={{ background: "var(--saffron)", color: "#fff" }}
        aria-label="Open chat support"
        >
        {open ? "✕" : "💬"}
        {hasNotif && !open && (
          <span
            className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white"
            style={{ background: "var(--crimson)" }}
          />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-bounce-in"
          style={{ height: "480px", border: "1.5px solid var(--border)", background: "var(--cream)" }}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3" style={{ background: "var(--saffron)" }}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🍽️</div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">Support</p>
              <p className="text-white/80 text-xs">Usually replies instantly</p>
            </div>
            <span className="ml-auto w-2.5 h-2.5 rounded-full bg-green-300" title="Online" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            {messages.map((msg, i) => (
              <Message key={i} msg={msg} />
            ))}
            {loading && (
              <div className="flex justify-start mb-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 shrink-0"
                  style={{ background: "var(--saffron)", color: "#fff" }}
                >
                  🍽️
                </div>
                <div
                  className="px-4 py-3 rounded-2xl text-sm"
                  style={{ background: "#fff", border: "1px solid var(--border)", borderBottomLeftRadius: "4px" }}
                >
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ background: "var(--muted)", animation: `bounce 1s ${i * 0.2}s infinite` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 flex gap-2" style={{ borderTop: "1px solid var(--border)", background: "#fff" }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your question..."
              className="flex-1 text-sm rounded-xl px-3 py-2 outline-none"
              style={{ background: "var(--cream)", border: "1px solid var(--border)", color: "var(--dark)" }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg transition-opacity"
              style={{ background: "var(--saffron)", opacity: !input.trim() || loading ? 0.5 : 1 }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}