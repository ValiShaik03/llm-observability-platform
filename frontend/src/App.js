import React, { useState, useEffect } from "react";
import axios from "axios";
// import ReactMarkdown from "react-markdown";
import ChatPage from "./pages/ChatPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState("chat");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [toast, setToast] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [stats, setStats] = useState({
    total_requests: 0,
    avg_latency: 0,
  });
  const [health, setHealth] = useState({});
  const [modelStats, setModelStats] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(Date.now());
  const [chatSessions, setChatSessions] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
  localStorage.getItem("loggedIn") === "true"
);
  useEffect(() => {

  fetchHistory();
  fetchStats();
  fetchHealth();
  fetchModelStats();


  const interval = setInterval(() => {
    fetchStats();
    fetchHealth();
    fetchModelStats();
  }, 5000);

  return () => clearInterval(interval);

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

    const res = await axios.get(
      "http://127.0.0.1:8000/history",
      {
        params: {
          username: localStorage.getItem("username")
        }
      }
    );

    setHistory(res.data);

  } catch (error) {
    console.log(error);
  }
};
  const fetchHealth = async () => {
  try {

    const res = await axios.get(
      "http://127.0.0.1:8000/health"
    );

    setHealth(res.data);

  } catch (error) {
    console.log(error);
  }
};

const fetchModelStats = async () => {

  try {

    const res = await axios.get(
      "http://127.0.0.1:8000/model-stats"
    );

    setModelStats(res.data);

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

  const sendPrompt = async (selectedModel = "groq") => {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post(
  `http://127.0.0.1:8000/chat?username=${localStorage.getItem("username")}`,
  {
    message: prompt,
    model: selectedModel
  }
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
  model: res.data.model
}
]);

// Add session to sidebar only once
if (
  !chatSessions.find(
    (s) => s.sessionId === currentSessionId
  )
) {
  setChatSessions((prev) => [
    {
      sessionId: currentSessionId,
      title: prompt,
      created_at: new Date(),
    },
    ...prev,
  ]);
}

setPrompt("");

fetchHistory();
fetchStats();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
};

const logout = () => {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("username");
  setLoggedIn(false);
};
const filteredHistory = history.filter((chat) =>
  chat.prompt
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);

if (showRegister) {
  return (
    <RegisterPage
      onBack={() => setShowRegister(false)}
    />
  );
}

if (!loggedIn) {
  return (
    <LoginPage
      onLogin={() => setLoggedIn(true)}
      setShowRegister={setShowRegister}
    />
  );
}
  return (
    <div className="flex h-screen bg-slate-950 text-white">

      {/* Sidebar */}
<div
  className={`
    ${
      sidebarOpen ? "w-80" : "w-24"
    }
    flex-shrink-0
    bg-slate-900
    p-4
    border-r
    border-slate-800
    flex
    flex-col
    transition-all
    duration-300
  `}
>
  <button
  onClick={() =>
    setSidebarOpen(!sidebarOpen)
  }
  className="
    bg-slate-800
    p-3
    rounded-xl
    mb-4
  "
>
  ☰
</button>
{sidebarOpen && (
  <h1 className="text-3xl font-bold mb-6">
    LLM Platform
  </h1>
)}
<button
  onClick={() => {
  setCurrentSessionId(Date.now());
  setMessages([]);
  setPrompt("");
  setSelectedChatId(null);
  setActivePage("chat");
}}
  className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-semibold mb-6"
>
  {sidebarOpen ? "+ New Chat" : "➕"}
</button>
<button
  onClick={async () => {
  if (window.confirm("Delete all chat history?")) {

    try {

      await axios.delete(
        "http://127.0.0.1:8000/history"
      );

      setHistory([]);
      setMessages([]);
      setSelectedChatId(null);
      await fetchStats();
      setToast("🗑 All chats deleted");

      setTimeout(() => {
        setToast("");
      }, 2000);

    } catch (error) {
      console.log(error);
    }
  }
}}

  className="
    w-full
    bg-red-600
    hover:bg-red-700
    p-4
    rounded-xl
    font-semibold
    mb-6
  "
>
  {sidebarOpen ? "🗑 Clear History" : "🗑"}
</button>
  <div className="space-y-3 mb-6">
<button
  onClick={() => setActivePage("dashboard")}
  className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left mb-3"
>
  {sidebarOpen ? "📊 Dashboard" : "📊"}
</button>
</div>
  {sidebarOpen && (
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
)}

  {sidebarOpen && (
  <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 pr-2">

    {filteredHistory.map((chat) => (
      <div
        key={chat.id}
        className={`
          group
          w-full
          overflow-hidden
          p-4
          rounded-xl
          ${
            selectedChatId === chat.id
              ? "bg-blue-600"
              : "bg-slate-800 hover:bg-slate-700"
          }
        `}
      >
        <div className="flex justify-between items-start">

          <div
            className="flex-1 cursor-pointer"
            onClick={() => {
              setSelectedChatId(chat.id);
              setActivePage("chat");
              loadChat(chat.id);
            }}
          >
            <div className="font-semibold truncate">
              {chat.prompt}
            </div>

            <div className="text-xs text-slate-300 mt-2">
              {new Date(chat.created_at).toLocaleString()}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();

              const newName = window.prompt(
                "Rename conversation",
                chat.prompt
              );

              if (!newName) return;

              setHistory((prev) =>
                prev.map((item) =>
                  item.id === chat.id
                    ? { ...item, prompt: newName }
                    : item
                )
              );

              setToast("✏️ Conversation renamed");
              setTimeout(() => setToast(""), 2000);
            }}
            className="
              opacity-0
              group-hover:opacity-100
              mr-2
              text-yellow-400
              hover:text-yellow-300
              transition
            "
          >
            ✏️
          </button>

          <button
            onClick={async (e) => {
  e.stopPropagation();

  try {

    await axios.delete(
      `http://127.0.0.1:8000/history/${chat.id}`
    );

    setHistory((prev) =>
      prev.filter(
        (item) => item.id !== chat.id
      )
    );
    await fetchStats();
    setToast("🗑 Conversation deleted");

    setTimeout(() => {
      setToast("");
    }, 2000);

  } catch (error) {
    console.log(error);
  }
}}
            className="
              opacity-0
              group-hover:opacity-100
              ml-3
              text-red-400
              hover:text-red-300
              transition
            "
          >
            🗑
          </button>

        </div>
      </div>
    ))}

  </div>
)}
</div>

{/* Main Content */}
<div className="flex-1 flex flex-col p-8">

  {/* Header */}
  <div className="flex justify-between items-center mb-6">

  <div>
    <h1 className="text-5xl font-bold">
      {activePage === "chat"
        ? "AI Assistant"
        : "Observability Dashboard"}
    </h1>

    <p className="text-slate-400 mt-2">
      Welcome, {localStorage.getItem("username")}
    </p>
  </div>

  <div className="flex gap-4 items-center">

    <div className="bg-slate-800 px-6 py-3 rounded-xl">
      Requests: {stats.total_requests}
    </div>

    <div className="bg-slate-800 px-6 py-3 rounded-xl">
      Latency: {stats.avg_latency}ms
    </div>

    <button
      onClick={logout}
      className="
        bg-red-600
        hover:bg-red-700
        px-6
        py-3
        rounded-xl
      "
    >
      Logout
    </button>

  </div>

</div>

        {activePage === "chat" ? (
  <ChatPage
    messages={messages}
    loading={loading}
    prompt={prompt}
    setPrompt={setPrompt}
    sendPrompt={sendPrompt}
    setToast={setToast}
  />
) : (
  <Dashboard 
  stats={stats}
  health={health}
  modelStats={modelStats} />
)}
      </div>
      {toast && (
  <div
    className="
      fixed
      bottom-6
      right-6
      bg-green-600
      px-5
      py-3
      rounded-xl
      shadow-lg
      z-50
    "
  >
    {toast}
  </div>
)}
    </div>
    
  );
}

export default App;