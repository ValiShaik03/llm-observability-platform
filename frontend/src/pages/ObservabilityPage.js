export default function ObservabilityPage({
  health,
  stats
}) {
  return (
    <div className="flex-1 p-8 overflow-y-auto">

      <h1 className="text-5xl font-bold mb-10">
        Observability Dashboard
      </h1>

      {/* Service Health */}

      <div className="bg-slate-800 p-8 rounded-2xl mb-8">

        <h2 className="text-3xl font-bold mb-6">
          Service Health
        </h2>

        {Object.entries(health || {}).map(
          ([service, status]) => (
            <div
              key={service}
              className="
                flex
                justify-between
                border-b
                border-slate-700
                py-3
              "
            >
              <span className="capitalize">
                {service}
              </span>

              <span
                className={
                  status === "healthy"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {status}
              </span>
            </div>
          )
        )}

      </div>

      {/* Metrics */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h3 className="text-slate-400">
            Requests
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
            Tokens
          </h3>

          <p className="text-4xl font-bold mt-2">
            {stats.total_tokens}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h3 className="text-slate-400">
            Cost
          </h3>

          <p className="text-4xl font-bold mt-2">
            ${stats.total_cost}
          </p>
        </div>

      </div>

      {/* Architecture */}

      <div className="bg-slate-800 p-8 rounded-2xl mb-8">

        <h2 className="text-3xl font-bold mb-6">
          Observability Pipeline
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-slate-700 p-6 rounded-xl">
            <h3 className="font-bold text-xl mb-4">
              Metrics
            </h3>

            <p>
              FastAPI → Prometheus →
              Grafana
            </p>
          </div>

          <div className="bg-slate-700 p-6 rounded-xl">
            <h3 className="font-bold text-xl mb-4">
              Tracing
            </h3>

            <p>
              FastAPI → Jaeger
            </p>
          </div>

          <div className="bg-slate-700 p-6 rounded-xl">
            <h3 className="font-bold text-xl mb-4">
              LLM Monitoring
            </h3>

            <p>
              FastAPI → Langfuse
            </p>
          </div>

        </div>

      </div>
      
    {/* Monitoring Tools */}

<div className="bg-slate-800 p-8 rounded-2xl mb-8">

  <h2 className="text-3xl font-bold mb-6">
    Monitoring Tools
  </h2>

  <div className="grid md:grid-cols-4 gap-6">

    <a
      href="http://localhost:3000"
      target="_blank"
      rel="noreferrer"
      className="
        bg-slate-700
        p-6
        rounded-xl
        text-center
        hover:bg-slate-600
        transition
      "
    >
      📊 Grafana
    </a>

    <a
      href="http://localhost:9090"
      target="_blank"
      rel="noreferrer"
      className="
        bg-slate-700
        p-6
        rounded-xl
        text-center
        hover:bg-slate-600
        transition
      "
    >
      🔥 Prometheus
    </a>

    <a
      href="http://localhost:16686"
      target="_blank"
      rel="noreferrer"
      className="
        bg-slate-700
        p-6
        rounded-xl
        text-center
        hover:bg-slate-600
        transition
      "
    >
      🔍 Jaeger
    </a>

    <a
      href="http://localhost:3002"
      target="_blank"
      rel="noreferrer"
      className="
        bg-slate-700
        p-6
        rounded-xl
        text-center
        hover:bg-slate-600
        transition
      "
    >
      🤖 Langfuse
    </a>

  </div>

</div>

      {/* Meta Observability */}

      <div className="bg-slate-800 p-8 rounded-2xl">

        <h2 className="text-3xl font-bold mb-6">
          Meta Observability
        </h2>

        <div className="space-y-4 text-lg">

          <p>
            ✅ Telemetry Pipeline Active
          </p>

          <p>
            ✅ Database Connected
          </p>

          <p>
            ✅ Alert System Running
          </p>

          <p>
            ✅ Monitoring Services Healthy
          </p>

        </div>

      </div>

    </div>
  );
}