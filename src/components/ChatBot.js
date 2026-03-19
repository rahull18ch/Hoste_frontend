import  { useState, useContext } from "react";
import axios from "axios";
import BASE_URL from '../api/config';
import { LoginContext } from "../contex/LoginContext";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi, I’m your hostel assistant. Ask me about hostel rules, mess timings, notices, or how to use the portal."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useContext(LoginContext) || {};

  // 🔥 Format message (convert * to bullets)
  const formatMessage = (text) => {
    const lines = text.split("\n");

    return lines.map((line, index) => {
      if (line.trim().startsWith("*")) {
        return (
          <li key={index} style={{ marginLeft: "16px" }}>
            {line.replace("*", "").trim()}
          </li>
        );
      }
      return <p key={index}>{line}</p>;
    });
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { from: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/route/chat`,
        { message: input },
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {}
        }
      );

      console.log("Backend response:", res.data);

      const botMsg = {
        from: "bot",
        text: res.data?.reply || "I’m not sure how to answer that."
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const botMsg = {
        from: "bot",
        text: "Sorry, something went wrong while getting the answer."
      };
      setMessages(prev => [...prev, botMsg]);
    }

    setInput("");
    setLoading(false);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "20px auto",
        border: "1px solid #ddd",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        height: "70vh"
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px",
          borderBottom: "1px solid #eee",
          fontWeight: "bold",
          backgroundColor: "#4CAF50",
          color: "white",
          textAlign: "center"
        }}
      >
        Hostel AI Assistant 🤖
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "10px",
          overflowY: "auto",
          backgroundColor: "#f5f5f5"
        }}
      >
        {messages.map((m, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: m.from === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px"
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                padding: "10px",
                borderRadius: "12px",
                backgroundColor:
                  m.from === "user" ? "#DCF8C6" : "#ffffff",
                border:
                  m.from === "user"
                    ? "1px solid #cde5b8"
                    : "1px solid #ddd",
                fontSize: "14px",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.1)"
              }}
            >
              {formatMessage(m.text)}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ fontSize: "12px", color: "#666" }}>
            Thinking…
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          padding: "10px",
          borderTop: "1px solid #eee",
          display: "flex",
          gap: "8px"
        }}
      >
        <input
          type="text"
          placeholder="Ask about hostel rules, mess timings..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none"
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: "10px 16px",
            borderRadius: "20px",
            border: "none",
            cursor: loading ? "default" : "pointer",
            backgroundColor: loading || !input.trim() ? "#ccc" : "#4CAF50",
            color: "#fff"
          }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;