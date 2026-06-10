export default function Sidebar({
  activePage,
  setActivePage,
  setMessages,
  setPrompt,
  clearHistory
}) {
  const menuClass = (page) =>
    `w-full px-4 py-3 rounded-xl text-left transition ${
      activePage === page
        ? "bg-blue-600"
        : "bg-slate-800 hover:bg-slate-700"
    }`;

  return (
    <div className="w-60 h-screen bg-slate-900 border-r border-slate-800 flex flex-col">

      {/* Fixed Header */}

      <div className="p-4 border-b border-slate-800">

        <h1 className="text-3xl font-bold text-red-500">
  NEW SIDEBAR
</h1>

      </div>

      {/* Scrollable Content */}

      <div className="flex-1 overflow-y-auto p-4">

        {/* Chat Controls */}

        {activePage === "chat" && (
          <>
            <button
              onClick={() => {
                setMessages([]);
                setPrompt("");
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-4 rounded-xl font-semibold mb-4"
            >
              + New Chat
            </button>

            <button
              onClick={clearHistory}
              className="w-full bg-red-600 hover:bg-red-700 px-4 py-4 rounded-xl font-semibold mb-6"
            >
              🗑 Clear History
            </button>
          </>
        )}

        {/* Navigation */}

        <div className="space-y-3">

          <button
            onClick={() => setActivePage("dashboard")}
            className={menuClass("dashboard")}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => setActivePage("chat")}
            className={menuClass("chat")}
          >
            💬 Chat
          </button>

          <button
            onClick={() => setActivePage("benchmark")}
            className={menuClass("benchmark")}
          >
            📈 Benchmark Analytics
          </button>

          <button
            onClick={() => setActivePage("cost")}
            className={menuClass("cost")}
          >
            💰 Cost Intelligence
          </button>

          <button
            onClick={() => setActivePage("quality")}
            className={menuClass("quality")}
          >
            🧠 Quality Monitor
          </button>
          
          <button
          onClick={() => setActivePage("prompt-registry")}
          className={menuClass("prompt-registry")}
          >
          📋 Prompt Registry
          </button>

          <button
          onClick={() =>
            setActivePage("promptAnalytics")
        }
          className={menuClass("promptAnalytics")}
        >
        📊 Prompt Analytics
        </button>
        
        <button
        onClick={() => setActivePage("abTesting")}
        className={menuClass("abTesting")}
        >
          🧪 A/B Testing
          
        </button>

          <button
            onClick={() => setActivePage("alerts")}
            className={menuClass("alerts")}
          >
            🚨 Alert Center
          </button>

          <button
            onClick={() => setActivePage("observability")}
            className={menuClass("observability")}
          >
            🔍 Observability
          </button>

          <button
            onClick={() => setActivePage("health")}
            className={menuClass("health")}
          >
            ⚙️ Health
          </button>

        </div>

        {/* Monitoring Tools */}

        <div className="mt-8">

          <div className="border-t border-slate-700 mb-4"></div>

          <h2 className="text-xs text-slate-400 uppercase tracking-wider mb-3">
            Monitoring Tools
          </h2>

          <div className="space-y-3">

            <button
              onClick={() =>
                window.open(
                  "http://localhost:3000",
                  "_blank"
                )
              }
              className="w-full bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-xl text-left"
            >
              📈 Grafana
            </button>

            <button
              onClick={() =>
                window.open(
                  "http://localhost:9090",
                  "_blank"
                )
              }
              className="w-full bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-xl text-left"
            >
              📊 Prometheus
            </button>

            <button
              onClick={() =>
                window.open(
                  "http://localhost:16686",
                  "_blank"
                )
              }
              className="w-full bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-xl text-left"
            >
              🔍 Jaeger
            </button>

            <button
              onClick={() =>
                window.open(
                  "http://localhost:3002",
                  "_blank"
                )
              }
              className="w-full bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-xl text-left"
            >
              🧠 Langfuse
            </button>

          </div>

        </div>

      </div>

      {/* Fixed Bottom Search */}

      {activePage === "chat" && (
        <div className="p-4 border-t border-slate-800">

          <input
            type="text"
            placeholder="🔍 Search chats..."
            className="w-full bg-slate-800 px-4 py-3 rounded-xl outline-none"
          />

        </div>
      )}

    </div>
  );
}