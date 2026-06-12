import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
export default function Dashboard({
  stats,
  health,
  modelStats,
  trendData,
  forecast,
  quality,
  benchmarkStats,
  recommendedModel,
  benchmarkHistory,
  alerts
})

{
  const [serviceHealth, setServiceHealth] = useState({});
  useEffect(() => {

  fetchServiceHealth();

  const interval = setInterval(() => {
    fetchServiceHealth();
  }, 10000);

  return () => clearInterval(interval);

}, []);
  const fetchServiceHealth = async () => {

  try {

    const res = await axios.get(
      "http://127.0.0.1:8000/service-health"
    );

    setServiceHealth(res.data);

  } catch (error) {

    console.error(
      "Service health fetch failed",
      error
    );

  }

};
  const getStatusColor = (status) =>
    status === "healthy"
      ? "text-green-400"
      : "text-red-400";
  console.log(modelStats);

const fastestModel =
  modelStats?.length
    ? [...modelStats].sort(
        (a, b) => a.latency - b.latency
      )[0]
    : null;

const cheapestModel =
  modelStats?.length
    ? [...modelStats].sort(
        (a, b) => a.cost - b.cost
      )[0]
    : null;

const mostUsedModel =
  modelStats?.length
    ? [...modelStats].sort(
        (a, b) => b.requests - a.requests
      )[0]
    : null;
console.log(trendData);
console.log("QUALITY DATA:", quality);
const fastestWinner =
  benchmarkStats
    ? Object.keys(
        benchmarkStats.fastest
      ).reduce((a, b) =>
        benchmarkStats.fastest[a] >
        benchmarkStats.fastest[b]
          ? a
          : b
      )
    : "-";

const qualityWinner =
  benchmarkStats
    ? Object.keys(
        benchmarkStats.quality
      ).reduce((a, b) =>
        benchmarkStats.quality[a] >
        benchmarkStats.quality[b]
          ? a
          : b
      )
    : "-";

const cheapestWinner =
  benchmarkStats
    ? Object.keys(
        benchmarkStats.cheapest
      ).reduce((a, b) =>
        benchmarkStats.cheapest[a] >
        benchmarkStats.cheapest[b]
          ? a
          : b
      )
    : "-";
const recommendation =
  recommendedModel?.recommended_model || "-";

const bestModel =
  recommendedModel?.models?.find(
    m => m.model === recommendation
  );

console.log(
  "RECOMMENDED MODEL DATA:",
  recommendedModel
);
  return (
    <div className="flex-1 p-8 overflow-y-auto">

      <h2 className="text-4xl font-bold mb-8">
        Key Metrics
      </h2>

      <div className="bg-slate-800 p-6 rounded-3xl mb-8">

  <h2 className="text-4xl font-bold mb-6">
    Service Health
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

    <div className="bg-slate-700 p-4 rounded-xl">
      {serviceHealth.api === "UP"
        ? "🟢 API"
        : "🔴 API"}
    </div>

    <div className="bg-slate-700 p-4 rounded-xl">
      {serviceHealth.database === "UP"
        ? "🟢 Database"
        : "🔴 Database"}
    </div>

    <div className="bg-slate-700 p-4 rounded-xl">
      {serviceHealth.prometheus === "UP"
        ? "🟢 Prometheus"
        : "🔴 Prometheus"}
    </div>

    <div className="bg-slate-700 p-4 rounded-xl">
      {serviceHealth.jaeger === "UP"
        ? "🟢 Jaeger"
        : "🔴 Jaeger"}
    </div>

    <div className="bg-slate-700 p-4 rounded-xl">
      {serviceHealth.langfuse === "UP"
        ? "🟢 Langfuse"
        : "🔴 Langfuse"}
    </div>

  </div>

</div>

      <div className="bg-slate-800 p-8 rounded-3xl mb-8 border border-blue-500">

  <h3 className="text-slate-400 text-2xl mb-4">
    🤖 Recommended Model
  </h3>

  <div className="flex items-center gap-4 mb-6">

    <h2 className="text-6xl font-bold">
      {recommendation}
    </h2>

    <span className="bg-green-600 px-4 py-2 rounded-xl text-sm font-bold">
      BEST
    </span>

  </div>

  <p className="text-green-400 mb-8">
    Best overall quality-to-cost ratio
  </p>

  <div className="grid grid-cols-4 gap-8">

    <div>
      <p className="text-slate-400">
        Quality Score
      </p>

      <p className="text-4xl font-bold text-green-400">
        {bestModel?.quality_score ?? "-"}
      </p>
    </div>

    <div>
      <p className="text-slate-400">
        Avg Latency
      </p>

      <p className="text-4xl font-bold">
        {bestModel?.avg_latency ?? "-"}s
      </p>
    </div>

    <div>
      <p className="text-slate-400">
        Cost
      </p>

      <p className="text-4xl font-bold">
        ${bestModel?.cost ?? "-"}
      </p>
    </div>

    <div>
      <p className="text-slate-400">
        Requests
      </p>

      <p className="text-4xl font-bold">
        {bestModel?.requests ?? "-"}
      </p>
    </div>

  </div>

</div>

<div className="bg-slate-800 p-6 rounded-3xl mb-8">

  <h3 className="text-2xl font-bold mb-4">
    🏆 Model Rankings
  </h3>

  {recommendedModel?.models
    ?.sort(
      (a, b) =>
        b.quality_score - a.quality_score
    )
    .map((model, index) => (

      <div
        key={model.model}
        className="flex justify-between py-3 border-b border-slate-700"
      >

        <span>
          {index === 0
            ? "🥇"
            : index === 1
            ? "🥈"
            : "🥉"}{" "}
          {model.model}
        </span>

        <span className="font-bold">
          {model.quality_score}
        </span>

      </div>

    ))}

</div>

      {/* KPI Cards */}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

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
    Total Requests
  </h3>

  <p className="text-4xl font-bold mt-2">
    {stats.total_requests}
  </p>
</div>
   
  <div className="bg-slate-800 p-6 rounded-2xl">
  <h3 className="text-slate-400">
    Total Cost
  </h3>

  <p className="text-4xl font-bold mt-2">
    ${Number(stats.total_cost).toFixed(6)}
  </p>
</div>

</div>


<h2 className="text-4xl font-bold mt-10 mb-6">
  Request Trends
</h2>

<div className="bg-slate-800 p-6 rounded-3xl mb-10">

  <ResponsiveContainer
    width="100%"
    height={300}
  >

    <LineChart data={trendData}>

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="date" />

      <YAxis />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="requests"
        stroke="#22c55e"
      />

    </LineChart>

  </ResponsiveContainer>

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

    </div>
  );
}