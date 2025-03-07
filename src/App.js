import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function PsychologistChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startChat = () => {
    setShowWelcome(false);
    setMessages([
      { id: 0, text: "Hello! I'm your Mental Wellbeing Assistant. How can I help you today?", sender: "bot" }
    ]);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: messages.length, text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation: messages.map((m) => m.text), currentMessage: input })
      });

      const data = await response.json();
      const botResponse = { id: messages.length + 1, text: data.response, sender: "bot" };
      setMessages((prev) => [...prev, botResponse]);
      setIsThinking(false);
    } catch (error) {
      console.error("Error processing message:", error);
      setIsThinking(false);
    }
  };

  return (
    <div className="chatbot-container">
      {showWelcome ? (
        <div className="welcome-screen">
          <h1>Hello, I am your mental wellbeing assistant.</h1>
          <p>How can I help you?</p>
          <button onClick={startChat}>Login</button>
          <button onClick={startChat}>Signup</button>
        </div>
      ) : (
        <>
          <div className="chat-header">Psychologist Chatbot</div>
          <div className="messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender === "bot" ? "bot-message" : "user-message"}`}>
                {msg.text}
              </div>
            ))}
            {isThinking && <div className="message bot-message typing-indicator">🤔 Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}

export default PsychologistChatbot;
