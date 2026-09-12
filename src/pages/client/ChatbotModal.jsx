import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  User,
  GripHorizontal,
  EyeOff,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const ChatbotModal = ({ isOpen, onClose, onDismissCompletely }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! Welcome to Livestream Manila. I am your AI assistant. How can I help you with our services today?",
      time: "02:59 PM",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Dragging states
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const modalRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Handle Dragging Logic
  const handleMouseDown = (e) => {
    if (e.target.closest("button") || e.target.closest("input")) return;

    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStartRef.current.startX;
      const deltaY = e.clientY - dragStartRef.current.startY;

      setPosition({
        x: dragStartRef.current.initialX + deltaX,
        y: dragStartRef.current.initialY + deltaY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Calls the real StreamSync backend chatbot endpoint
  const generateBotResponse = async (userText) => {
    try {
      const response = await fetch(`${API_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      if (!sessionId) {
        setSessionId(data.session_id);
      }

      return data.reply;
    } catch (error) {
      console.error("Chatbot request failed:", error);
      return "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: inputValue.trim(),
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    const reply = await generateBotResponse(currentInput);
    const botMsg = {
      id: Date.now() + 1,
      sender: "bot",
      text: reply,
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div
      ref={modalRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      className={`fixed bottom-8 right-8 z-[150] w-[370px] sm:w-[410px] bg-[#0c0e14] border border-[#1b212f] rounded-3xl shadow-2xl flex flex-col overflow-hidden font-['Montserrat',sans-serif] text-white transition-size duration-200 select-none ${
        isDragging ? "cursor-grabbing opacity-95 shadow-[0_0_30px_rgba(255,0,0,0.3)]" : ""
      } ${isMinimized ? "h-[68px]" : "h-[580px]"}`}
    >
      <div
        onMouseDown={handleMouseDown}
        className="px-5 py-4 bg-[#0a0c12] border-b border-[#181f2e] flex items-center justify-between shrink-0 cursor-grab active:cursor-grabbing relative"
      >
        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-neutral-700 pointer-events-none">
          <GripHorizontal size={14} />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-500 shadow-inner">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              LSM Assistant
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              <span className="text-[11px] font-bold text-neutral-400">Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-neutral-400">
          <button
            type="button"
            onClick={onDismissCompletely}
            className="p-1.5 hover:text-red-500 hover:bg-red-950/30 rounded-lg transition cursor-pointer"
            title="Disable / Remove Chatbot"
          >
            <EyeOff size={16} />
          </button>

          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:text-white hover:bg-neutral-800/60 rounded-lg transition cursor-pointer"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:text-white hover:bg-neutral-800/60 rounded-lg transition cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs select-text">
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-500 shrink-0 mb-4">
                      <Bot size={13} />
                    </div>
                  )}

                  <div className={`max-w-[78%] flex flex-col ${isBot ? "items-start" : "items-end"}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl leading-relaxed text-xs shadow-md ${
                        isBot
                          ? "bg-[#181d28] text-neutral-100 border border-[#232a3a] rounded-bl-sm"
                          : "bg-[#ff0000] text-white font-medium rounded-br-sm shadow-red-950/40"
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>

                  {!isBot && (
                    <div className="w-7 h-7 rounded-full bg-[#1b212f] border border-neutral-700 flex items-center justify-center text-neutral-300 shrink-0 mb-4">
                      <User size={13} />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-500 shrink-0">
                  <Bot size={13} />
                </div>
                <div className="bg-[#181d28] border border-[#232a3a] px-4 py-2.5 rounded-2xl flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-[#0a0c12] border-t border-[#181f2e] space-y-2">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-[#161a25] border border-[#232b3d] rounded-2xl pl-4 pr-12 py-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-600 transition"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-2.5 text-neutral-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-neutral-400 p-1.5 transition cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-neutral-500 px-1">
              <span>Drag header to move</span>
              <span>Powered by Livestream Manila AI</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatbotModal;