export default function Dashboard({ stats }) {
  return (
    <div className="flex-1 p-8 overflow-y-auto">

      <h2 className="text-3xl font-bold mb-8">
        Observability Dashboard
      </h2>

      {/* KPI Cards */}

      <div className="grid grid-cols-4 gap-6 mb-8">

        <div className="bg-slate-800 p-6 rounded-3xl">
          <p className="text-slate-400 mb-2">
            Total Requests
          </p>

          <h3 className="text-4xl font-bold">
            {stats.total_requests}
          </h3>
        </div>

        <div className="bg-slate-800 p-6 rounded-3xl">
          <p className="text-slate-400 mb-2">
            Avg Latency
          </p>

          <h3 className="text-4xl font-bold">
            {stats.avg_latency} ms
          </h3>
        </div>

        <div className="bg-slate-800 p-6 rounded-3xl">
          <p className="text-slate-400 mb-2">
            Success Rate
          </p>

          <h3 className="text-4xl font-bold text-green-400">
            100%
          </h3>
        </div>

        <div className="bg-slate-800 p-6 rounded-3xl">
          <p className="text-slate-400 mb-2">
            Active Model
          </p>

          <h3 className="text-xl font-bold">
            Llama 3.3 70B
          </h3>
        </div>

      </div>

      {/* Quick Access */}

      <h3 className="text-2xl font-semibold mb-4">
        Quick Access
      </h3>

      <div className="grid grid-cols-4 gap-6 mb-10">

        <button
          onClick={() =>
            window.open("http://localhost:3000")
          }
          className="bg-slate-800 hover:bg-slate-700 p-6 rounded-3xl text-left"
        >
          <div className="text-4xl mb-3">📈</div>

          <div className="font-semibold">
            Grafana
          </div>

          <div className="text-slate-400 text-sm">
            Metrics Dashboard
          </div>
        </button>

        <button
          onClick={() =>
            window.open("http://localhost:9090")
          }
          className="bg-slate-800 hover:bg-slate-700 p-6 rounded-3xl text-left"
        >
          <div className="text-4xl mb-3">🔥</div>

          <div className="font-semibold">
            Prometheus
          </div>

          <div className="text-slate-400 text-sm">
            Metrics Storage
          </div>
        </button>

        <button
          onClick={() =>
            window.open("http://localhost:3002")
          }
          className="bg-slate-800 hover:bg-slate-700 p-6 rounded-3xl text-left"
        >
          <div className="text-4xl mb-3">🧠</div>

          <div className="font-semibold">
            Langfuse
          </div>

          <div className="text-slate-400 text-sm">
            LLM Tracing
          </div>
        </button>

        <button
          onClick={() =>
            window.open("http://localhost:16686")
          }
          className="bg-slate-800 hover:bg-slate-700 p-6 rounded-3xl text-left"
        >
          <div className="text-4xl mb-3">🔍</div>

          <div className="font-semibold">
            Jaeger
          </div>

          <div className="text-slate-400 text-sm">
            OpenTelemetry Traces
          </div>
        </button>

      </div>

      {/* System Health */}

      <h3 className="text-2xl font-semibold mb-4">
        System Health
      </h3>

      <div className="bg-slate-800 rounded-3xl p-6">

        <div className="flex justify-between py-3 border-b border-slate-700">
          <span>FastAPI Backend</span>
          <span className="text-green-400">
            ● Healthy
          </span>
        </div>

        <div className="flex justify-between py-3 border-b border-slate-700">
          <span>PostgreSQL</span>
          <span className="text-green-400">
            ● Healthy
          </span>
        </div>

        <div className="flex justify-between py-3 border-b border-slate-700">
          <span>Prometheus</span>
          <span className="text-green-400">
            ● Healthy
          </span>
        </div>

        <div className="flex justify-between py-3 border-b border-slate-700">
          <span>Langfuse</span>
          <span className="text-green-400">
            ● Healthy
          </span>
        </div>

        <div className="flex justify-between py-3">
          <span>Jaeger</span>
          <span className="text-green-400">
            ● Healthy
          </span>
        </div>

      </div>

    </div>
  );
}