export default function Sidebar({
  activePage,
  setActivePage,
  setMessages,
  setPrompt
}) {
  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 p-4 flex flex-col">

      <h1 className="text-3xl font-bold mb-6">
        LLM Platform
      </h1>

      <button
        onClick={() => {
          setMessages([]);
          setPrompt("");
          setActivePage("chat");
        }}
        className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-semibold mb-6"
      >
        + New Chat
      </button>

      <div className="space-y-3">

        <button
          onClick={() => setActivePage("dashboard")}
          className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left"
        >
          📊 Dashboard
        </button>

        <button
          onClick={() => setActivePage("chat")}
          className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left"
        >
          💬 Chat
        </button>

        <button
          onClick={() => setActivePage("health")}
          className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left"
        >
          ❤️ Health
        </button>

        <button
          onClick={() => window.open("http://localhost:3000")}
          className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left"
        >
          📈 Grafana
        </button>

        <button
          onClick={() => window.open("http://localhost:16686")}
          className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left"
        >
          🔍 Jaeger
        </button>

        <button
          onClick={() => window.open("http://localhost:3002")}
          className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left"
        >
          🧠 Langfuse
        </button>

      </div>

    </div>
  );
}