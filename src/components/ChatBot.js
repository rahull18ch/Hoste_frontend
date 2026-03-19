import React, { useState, useContext } from "react";
import axios from "axios";
import BASE_URL from '../api/config';
import { LoginContext } from "../contex/LoginContext";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

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
          // backend route currently doesn't *require* auth,
          // but this keeps it ready if you protect it later
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
          padding: "10px 16px",
          borderBottom: "1px solid #eee",
          fontWeight: "bold",
          backgroundColor: "#f7f7f7"
        }}
      >
        Hostel AI Assistant
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "10px",
          overflowY: "auto",
          backgroundColor: "#fafafa"
        }}
      >
        {messages.map((m, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: m.from === "user" ? "flex-end" : "flex-start",
              marginBottom: "8px"
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                padding: "8px 12px",
                borderRadius: "12px",
                whiteSpace: "pre-wrap",
                backgroundColor:
                  m.from === "user" ? "#DCF8C6" : "#ffffff",
                border:
                  m.from === "user" ? "1px solid #cde5b8" : "1px solid #e0e0e0",
                fontSize: "14px"
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Thinking…
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          padding: "8px",
          borderTop: "1px solid #eee",
          display: "flex",
          gap: "8px"
        }}
      >
        <input
          type="text"
          placeholder="Ask something about hostel rules, mess timings, complaints process..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "14px"
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            border: "none",
            cursor: loading ? "default" : "pointer",
            backgroundColor: loading || !input.trim() ? "#ccc" : "#4CAF50",
            color: "#fff",
            fontSize: "14px"
          }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
