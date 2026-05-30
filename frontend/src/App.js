import React, { useState, useEffect } from "react";
import axios from "axios";
// import ReactMarkdown from "react-markdown";
import ChatPage from "./pages/ChatPage";
import Dashboard from "./pages/Dashboard";
function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState("chat");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);

  const [stats, setStats] = useState({
    total_requests: 0,
    avg_latency: 0,
  });

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/stats");
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/history");
      setHistory(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/history/${chatId}`
      );

      setMessages([
        {
          role: "user",
          content: res.data.prompt,
        },
        {
          role: "assistant",
          content: res.data.response,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/chat?prompt=${encodeURIComponent(prompt)}`
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: res.data.response,
        },
      ]);

      setPrompt("");

      fetchHistory();
      fetchStats();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };
const filteredHistory = history.filter((chat) =>
  chat.prompt
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);
  return (
    <div className="flex h-screen bg-slate-950 text-white">

      {/* Sidebar */}
<div className="w-80 bg-slate-900 p-4 border-r border-slate-800 flex flex-col">

  <h1 className="text-3xl font-bold mb-6">
    LLM Platform
  </h1>

  <button
    onClick={() => {
      setActivePage("chat");
      setMessages([]);
      setPrompt("");
      setSelectedChatId(null);
    }}
    className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-semibold mb-6"
  >
    + New Chat
  </button>

  <div className="space-y-3 mb-6">

  <button
    onClick={() => setActivePage("dashboard")}
    className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left"
  >
    📊 Dashboard
  </button>

</div>
  <input
    type="text"
    placeholder="🔍 Search chats..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="
      w-full
      bg-slate-800
      text-white
      p-3
      rounded-xl
      mb-4
      border
      border-slate-700
      outline-none
    "
  />

  <div className="flex-1 overflow-y-auto space-y-3 pr-2">

    {filteredHistory.map((chat) => (
      <button
        key={chat.id}
        onClick={() => {
          setSelectedChatId(chat.id);
          setActivePage("chat");
          loadChat(chat.id);
        }}
        className={`w-full p-4 rounded-xl text-left transition
        ${
          selectedChatId === chat.id
            ? "bg-blue-600"
            : "bg-slate-800 hover:bg-slate-700"
        }`}
      >
        <div className="font-semibold truncate">
          {chat.prompt}
        </div>

        <div className="text-xs text-slate-300 mt-2">
          {new Date(chat.created_at).toLocaleString()}
        </div>
      </button>
    ))}

  </div>

</div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800">

          <h1 className="text-5xl font-bold">
            {activePage === "chat"
              ? "AI Assistant"
              : "Observability Dashboard"}
          </h1>

          <div className="flex gap-4">

            <div className="bg-slate-800 px-6 py-3 rounded-xl">
              Requests: {stats.total_requests}
            </div>

            <div className="bg-slate-800 px-6 py-3 rounded-xl">
              Latency: {stats.avg_latency}ms
            </div>

          </div>

        </div>

        {activePage === "chat" ? (
  <ChatPage
    messages={messages}
    loading={loading}
    prompt={prompt}
    setPrompt={setPrompt}
    sendPrompt={sendPrompt}
  />
) : (
  <Dashboard stats={stats} />
)}
      </div>
    </div>
  );
}

export default App;