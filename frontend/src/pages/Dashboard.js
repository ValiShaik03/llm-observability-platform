
export default function Dashboard({
  stats,
  health,
  modelStats
}) {
  
  const getStatusColor = (status) =>
    status === "healthy"
      ? "text-green-400"
      : "text-red-400";
  console.log(modelStats);
  return (
    <div className="flex-1 p-8 overflow-y-auto">

      <h2 className="text-4xl font-bold mb-8">
        Key Metrics
      </h2>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

  <div className="bg-slate-800 p-6 rounded-2xl">
    <h3 className="text-slate-400">
      Total Requests
    </h3>

    <p className="text-4xl font-bold mt-2">
      {stats.total_requests}
    </p>
  </div>

  <div className="bg-slate-800 p-6 rounded-2xl">
    <h3 className="text-slate-400">
      Avg Latency
    </h3>

    <p className="text-4xl font-bold mt-2">
      {stats.avg_latency} ms
    </p>
  </div>

  <div className="bg-slate-800 p-6 rounded-2xl">
    <h3 className="text-slate-400">
      Total Tokens
    </h3>

    <p className="text-4xl font-bold mt-2">
      {stats.total_tokens}
    </p>
  </div>

  <div className="bg-slate-800 p-6 rounded-2xl">
    <h3 className="text-slate-400">
      Prompt Tokens
    </h3>

    <p className="text-4xl font-bold mt-2">
      {stats.prompt_tokens}
    </p>
  </div>

  <div className="bg-slate-800 p-6 rounded-2xl">
    <h3 className="text-slate-400">
      Completion Tokens
    </h3>

    <p className="text-4xl font-bold mt-2">
      {stats.completion_tokens}
    </p>
  </div>

  <div className="bg-slate-800 p-6 rounded-2xl">
  <h3 className="text-slate-400">
    Total Cost
  </h3>

  <p className="text-4xl font-bold mt-2">
    ${stats.total_cost}
  </p>
</div>

  <div className="bg-slate-800 p-6 rounded-2xl">
    <h3 className="text-slate-400">
      Active Model
    </h3>

    <p className="text-2xl font-bold mt-2">
      TinyLlama
    </p>
  </div>

</div>

      {/* Model Comparison */}

<h2 className="text-4xl font-bold mt-10 mb-6">
  Model Comparison
</h2>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

  {modelStats?.map((model) => (

    <div
      key={model.model}
      className="bg-slate-800 p-6 rounded-3xl"
    >

      <h3 className="text-2xl font-bold capitalize mb-4">
        {model.model}
      </h3>

      <div className="space-y-3">

        <div>
          <span className="text-slate-400">
            Requests:
          </span>{" "}
          {model.requests}
        </div>

        <div>
          <span className="text-slate-400">
            Tokens:
          </span>{" "}
          {model.tokens}
        </div>

        <div>
          <span className="text-slate-400">
            Cost:
          </span>{" "}
          ${model.cost}
        </div>

        <div>
          <span className="text-slate-400">
            Avg Latency:
          </span>{" "}
          {model.latency}s
        </div>

      </div>

    </div>

  ))}

</div>
      {/* Quick Access */}

      <h2 className="text-4xl font-bold mt-10 mb-6">
          Quick Access
      </h2>

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

      <h2 className="text-4xl font-bold mt-10 mb-6">
        System Health
      </h2>

  <div className="bg-slate-800 rounded-3xl p-6">

  {Object.entries(health).map(([service, status]) => (

    <div
      key={service}
      className="flex justify-between py-3 border-b border-slate-700"
    >
      <span className="capitalize">
        {service}
      </span>

      <span className={getStatusColor(status)}>
        {status === "healthy"
          ? "🟢 Healthy"
          : "🔴 Unhealthy"}
      </span>
    </div>

  ))}

</div>

    </div>
  );
}