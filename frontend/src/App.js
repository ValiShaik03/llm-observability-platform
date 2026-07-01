import React, { useState, useEffect } from "react";
import axios from "axios";
// import ReactMarkdown from "react-markdown";
import ChatPage from "./pages/ChatPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BenchmarkAnalyticsPage from "./pages/BenchmarkAnalyticsPage";
import CostPage from "./pages/CostPage";
import QualityPage from "./pages/QualityPage";
import AlertPage from "./pages/AlertPage";
//import ObservabilityPage from "./pages/ObservabilityPage";
// import HealthPage from "./pages/HealthPage";
import PromptRegistryPage from "./pages/PromptRegistryPage";
import PromptAnalyticsPage from "./pages/PromptAnalyticsPage";
import ABTestingPage from "./pages/ABTestingPage";

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
  //const [alerts, setAlerts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [alertSummary, setAlertSummary] = useState({});
  const [trendData, setTrendData] = useState([]);
  const [forecast, setForecast] =
  useState({});
  const [quality, setQuality] =
  useState({});
  
  useEffect(() => {

  fetchHistory();
    if (activePage === "dashboard") {

      fetchStats();
      fetchHealth();
      fetchModelStats();
      fetchTrendData();
      fetchForecast(); // ADD THIS
      fetchBenchmarkStats();
      fetchBenchmarkHistory();
      fetchRecommendedModel();

    }

  if (activePage === "quality") {
    fetchQuality();
  }

  if (activePage === "alerts") {
    fetchAlerts();
  }
  
  if (activePage === "benchmarkAnalytics") {
  fetchBenchmarkHistory();
}
  if (activePage === "cost") {

    fetchStats();
    fetchModelStats();
    fetchForecast();

  }

  const interval = setInterval(() => {

    if (activePage === "dashboard") {

      fetchStats();
      fetchHealth();
      fetchModelStats();
      fetchTrendData();
      fetchForecast(); // ADD THIS
      fetchBenchmarkStats();
      fetchBenchmarkHistory();
      fetchRecommendedModel();

    }

    if (activePage === "alerts") {

      fetchAlerts();

    }

    if (activePage === "quality") {

      fetchQuality();

    }

  }, 60000);

  return () => clearInterval(interval);

}, [activePage]);

const [benchmarkStats, setBenchmarkStats] =
  useState(null);
const [recommendedModel, setRecommendedModel] =
  useState(null);
const [benchmarkHistory,
setBenchmarkHistory] = useState([]);
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

const fetchTrendData = async () => {

  try {

    const res = await axios.get(
      "http://127.0.0.1:8000/request-trends"
    );

    setTrendData(res.data);

  } catch (error) {

    console.log(error);

  }

};

const fetchForecast = async () => {

  try {

    const res = await axios.get(
      "http://127.0.0.1:8000/cost-forecast"
    );

    setForecast(res.data);

  } catch (error) {

    console.log(error);

  }

};

const fetchQuality = async () => {

  try {

    const res = await axios.get(
      "http://127.0.0.1:8000/quality-drift"
    );

    setQuality(res.data);

  } catch (error) {

    console.log(error);

  }
};

const fetchBenchmarkStats = async () => {

  try {

    const res = await axios.get(
      "http://127.0.0.1:8000/benchmark-stats"
    );

    setBenchmarkStats(res.data);

  } catch (error) {

    console.log(error);

  }

};

const fetchRecommendedModel = async () => {
  try {

    const response = await fetch(
      "http://127.0.0.1:8000/recommended-model"
    );

    const data = await response.json();

    setRecommendedModel(data);

  } catch (error) {

    console.error(
      "Recommended model error:",
      error
    );

  }
};

const fetchBenchmarkHistory = async () => {

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/benchmark-history"
    );

    const data = await response.json();

    setBenchmarkHistory(data);

  } catch (error) {

    console.error(
      "Benchmark history error",
      error
    );

  }

};

const fetchAlerts = async () => {

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/alerts"
    );

    const data = await response.json();

    setAlerts(data.alerts || []);
    
    setAlertSummary(data.summary || {});

  } catch (error) {

    console.error(error);

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

  const sendPrompt = async (
  selectedModel = "groq",
  selectedTemplate = "Summarizer"
) => {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post(
  `http://127.0.0.1:8000/chat?username=${localStorage.getItem("username")}`,
  {
    message: prompt,
    model: selectedModel,
    template: selectedTemplate
  }
);

console.log(
  "Template Used:",
  selectedTemplate
);

console.log(
  "Backend Response:",
  res.data
);

console.log("================================");
console.log("selectedModel =", selectedModel);
console.log("response =", res);
console.log("response.data =", res?.data);
console.log("================================");

if (!res.data) {
  alert("Backend returned null");
  return;
}

setMessages((prev) => [
  ...prev,
  {
    role: "user",
    content: prompt,
  },
  {
    role: "assistant",
    content: res.data.response || "No response received",
    model: res.data.model || selectedModel
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
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">

 {/* Sidebar */}
<div
  className={`
    ${sidebarOpen ? "w-72" : "w-24"}
    h-screen
    bg-slate-900
    border-r
    border-slate-800
    flex
    flex-col
    transition-all
    duration-300
  `}
>

  {/* Fixed Top */}
  <div className="p-4 flex-shrink-0">

    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="w-full bg-slate-800 p-3 rounded-xl mb-4"
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
      className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-semibold mb-4"
    >
      {sidebarOpen ? "+ New Chat" : "➕"}
    </button>

    <button
      className="w-full bg-red-600 hover:bg-red-700 p-4 rounded-xl font-semibold"
    >
      {sidebarOpen ? "🗑 Clear History" : "🗑"}
    </button>

  </div>

  {/* Scrollable Middle */}
  <div className="flex-1 overflow-y-auto px-4">

    <div className="space-y-3 mb-6">

      <button
  onClick={() => setActivePage("dashboard")}
  className={`
    w-full
    bg-slate-800
    hover:bg-slate-700
    p-4
    rounded-xl
    ${
      sidebarOpen
        ? "text-left"
        : "flex items-center justify-center"
    }
  `}
>
  {sidebarOpen ? "📊 Dashboard" : "📊"}
</button>

      <button
  onClick={() => setActivePage("benchmarkAnalytics")}
  className={`
    w-full
    bg-slate-800
    hover:bg-slate-700
    p-4
    rounded-xl
    ${
      sidebarOpen
        ? "text-left"
        : "flex items-center justify-center"
    }
  `}
>
  {sidebarOpen ? "📈 Benchmark Analytics" : "📈"}
</button>

     <button
  onClick={() => setActivePage("cost")}
  className={`
    w-full
    bg-slate-800
    hover:bg-slate-700
    p-4
    rounded-xl
    ${
      sidebarOpen
        ? "text-left"
        : "flex items-center justify-center"
    }
  `}
>
  {sidebarOpen ? "💰 Cost" : "💰"}
</button>

      <button
  onClick={() => setActivePage("quality")}
  className={`
    w-full
    bg-slate-800
    hover:bg-slate-700
    p-4
    rounded-xl
    ${
      sidebarOpen
        ? "text-left"
        : "flex items-center justify-center"
    }
  `}
>
  {sidebarOpen ? "🧠 Quality" : "🧠"}
</button>
       
      <button
  onClick={() => setActivePage("promptRegistry")}
  className={`
    w-full
    bg-slate-800
    hover:bg-slate-700
    p-4
    rounded-xl
    ${
      sidebarOpen
        ? "text-left"
        : "flex items-center justify-center"
    }
  `}
>
  {sidebarOpen ? "📋 Prompt Registry" : "📋"}
</button>
      
       <button
  onClick={() => setActivePage("promptAnalytics")}
  className={`
    w-full
    bg-slate-800
    hover:bg-slate-700
    p-4
    rounded-xl
    ${
      sidebarOpen
        ? "text-left"
        : "flex items-center justify-center"
    }
  `}
>
  {sidebarOpen ? "📊 Prompt Analytics" : "📊"}
</button>
      
      <button
  onClick={() => setActivePage("abTesting")}
  className={`
    w-full
    bg-slate-800
    hover:bg-slate-700
    p-4
    rounded-xl
    ${
      sidebarOpen
        ? "text-left"
        : "flex items-center justify-center"
    }
  `}
>
  {sidebarOpen ? "🧪 A/B Testing" : "🧪"}
</button>

      <button
  onClick={() => setActivePage("alerts")}
  className={`
    w-full
    bg-slate-800
    hover:bg-slate-700
    p-4
    rounded-xl
    ${
      sidebarOpen
        ? "text-left"
        : "flex items-center justify-center"
    }
  `}
>

   

  {sidebarOpen ? "🚨 Alerts" : "🚨"}
</button>

      {/* <button
  onClick={() => setActivePage("observability")}
  className={`
    w-full
    bg-slate-800
    hover:bg-slate-700
    p-4
    rounded-xl
    ${
      sidebarOpen
        ? "text-left"
        : "flex items-center justify-center"
    }
  `}
>
  {sidebarOpen ? "🔍 Observability" : "🔍"}
</button> */}

      {/* <button
  onClick={() => setActivePage("health")}
  className={`
    w-full
    bg-slate-800
    hover:bg-slate-700
    p-4
    rounded-xl
    ${
      sidebarOpen
        ? "text-left"
        : "flex items-center justify-center"
    }
  `}
>
  {sidebarOpen ? "⚙️ Health" : "⚙️"}
</button> */}

    </div>

    {sidebarOpen && (
      <div className="space-y-3 pb-4">
        {filteredHistory.map((chat) => (
          <div
            key={chat.id}
            className="bg-slate-800 p-3 rounded-xl"
          >
            <div className="truncate">
              {chat.prompt}
            </div>
          </div>
        ))}
      </div>
    )}

  </div>

  {/* Fixed Bottom */}
  {sidebarOpen && (
    <div className="p-4 border-t border-slate-800 flex-shrink-0">
      <input
        type="text"
        placeholder="🔍 Search chats..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        className="
          w-full
          bg-slate-800
          text-white
          p-3
          rounded-xl
          border
          border-slate-700
        "
      />
    </div>
  )}

</div>
<div className="flex-1 flex flex-col p-8 overflow-y-auto">

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

        {activePage === "chat" && (
  <ChatPage
    messages={messages}
    loading={loading}
    prompt={prompt}
    setPrompt={setPrompt}
    sendPrompt={sendPrompt}
    setToast={setToast}
  />
)}

{activePage === "dashboard" && (
  <Dashboard
    stats={stats}
    health={health}
    modelStats={modelStats}
    trendData={trendData}
    forecast={forecast}
    quality={quality}
    benchmarkStats={benchmarkStats}
    recommendedModel={recommendedModel}
    benchmarkHistory={benchmarkHistory}
    alerts={alerts}
  />
)}

{
  activePage ===
    "benchmarkAnalytics" && (

    <BenchmarkAnalyticsPage
      benchmarkHistory={
        benchmarkHistory
      }
    />
)
}

{
  activePage === "cost" && (
    <CostPage
      stats={stats}
      forecast={forecast}
      modelStats={modelStats}
    />
  )
}

{activePage === "quality" && (
  <QualityPage
    benchmarkStats={benchmarkStats}
    recommendedModel={recommendedModel}
    quality={quality}
  />
)}

{activePage === "promptRegistry" && (
  <PromptRegistryPage />
)}

{activePage === "alerts" && (
  <AlertPage
    alerts={alerts}
    summary={alertSummary}
  />
)}

{activePage === "promptAnalytics" && (
  <PromptAnalyticsPage />
)}

{activePage === "abTesting" && (
  <ABTestingPage />
)}

{/* {activePage === "observability" && (
  <ObservabilityPage
    health={health}
    stats={stats}
  />
)} */}
{/* {activePage === "health" && (
  <HealthPage
    health={health}
  />
)} */}
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