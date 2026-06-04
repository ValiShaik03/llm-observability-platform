
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

console.log(
  "RECOMMENDED MODEL DATA:",
  recommendedModel
);
  return (
    <div className="flex-1 p-8 overflow-y-auto">

      <h2 className="text-4xl font-bold mb-8">
        Key Metrics
      </h2>

      <div className="bg-slate-800 p-6 rounded-2xl mb-8 border border-blue-500">

  <h3 className="text-slate-400 mb-2">
    🤖 Recommended Model
  </h3>

  <p className="text-4xl font-bold">
    {recommendation}
  </p>

  <div className="mt-4 text-slate-300">

    <p>
      <b>Score : </b>
      {recommendedModel?.score ?? "-"}
    </p>

    <p>
      <b>Avg Latency : </b>
      {recommendedModel?.avg_latency ?? "-"}s
    </p>

    <p>
      <b>Cost : </b>
      ${recommendedModel?.cost ?? "-"}
    </p>

  </div>

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
    Total Cost
  </h3>

  <p className="text-4xl font-bold mt-2">
    ${stats.total_cost}
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

      <h3 className="text-3xl font-bold mb-2">
  {
    model.model === "groq"
      ? "llama-3.1-8b-instant"
      : model.model === "gemini"
      ? "Gemini 2.0 Flash"
      : "TinyLlama"
  }
</h3>

<p className="text-slate-400 mb-4">
  Provider: {model.model.toUpperCase()}
</p>

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
<h2 className="text-4xl font-bold mt-10 mb-6">
  Cost Breakdown
</h2>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

  <div className="bg-slate-800 p-6 rounded-3xl">

    <h3 className="text-slate-400 mb-3">
      🏆 Fastest Model
    </h3>

    <p className="text-2xl font-bold">
      {
  fastestModel?.model === "groq"
    ? "llama-3.1-8b-instant"
    : fastestModel?.model === "gemini"
    ? "Gemini 2.5 Flash"
    : "TinyLlama"
}
    </p>

    <p className="text-slate-400 mt-2">
      {fastestModel?.latency}s
    </p>

  </div>

  <div className="bg-slate-800 p-6 rounded-3xl">

    <h3 className="text-slate-400 mb-3">
      💸 Cheapest Model
    </h3>

    <p className="text-2xl font-bold">
      {
  cheapestModel?.model === "groq"
    ? "llama-3.1-8b-instant"
    : cheapestModel?.model === "gemini"
    ? "Gemini 2.5 Flash"
    : "TinyLlama"
}
    </p>

    <p className="text-slate-400 mt-2">
      ${cheapestModel?.cost}
    </p>

  </div>

  <div className="bg-slate-800 p-6 rounded-3xl">

    <h3 className="text-slate-400 mb-3">
      📈 Most Used Model
    </h3>

    <p className="text-2xl font-bold">
      {
  mostUsedModel?.model === "groq"
    ? "llama-3.1-8b-instant"
    : mostUsedModel?.model === "gemini"
    ? "Gemini 2.5 Flash"
    : "TinyLlama"
}
    </p>

    <p className="text-slate-400 mt-2">
      {mostUsedModel?.requests} requests
    </p>

  </div>

</div>

<div className="bg-slate-800 rounded-3xl p-6 mb-10">

  {modelStats?.map((model) => (

    <div
      key={model.model}
      className="
        flex
        justify-between
        py-3
        border-b
        border-slate-700
      "
    >

      <span className="capitalize">

        {
          model.model === "groq"
            ? "llama-3.1-8b-instant"
            : model.model === "gemini"
            ? "Gemini 2.5 Flash"
            : "TinyLlama"
        }

      </span>

      <span className="font-semibold">

        ${Number(model.cost).toFixed(6)}

      </span>

    </div>

  ))}

  <div
    className="
      flex
      justify-between
      pt-4
      text-xl
      font-bold
    "
  >

    <span>Total Cost</span>

    <span>
      ${stats.total_cost}
    </span>

  </div>

</div>

<h2 className="text-4xl font-bold mt-10 mb-6">
  Model Leaderboard
</h2>



<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

  <div className="bg-slate-800 p-6 rounded-3xl">
    <h3 className="text-slate-400 mb-3">
      💰 Most Expensive
    </h3>

    <p className="text-2xl font-bold">
      Gemini 2.5 Flash
    </p>
  </div>

  <div className="bg-slate-800 p-6 rounded-3xl">
    <h3 className="text-slate-400 mb-3">
      💸 Cheapest
    </h3>

    <p className="text-2xl font-bold">
      TinyLlama
    </p>
  </div>

  <div className="bg-slate-800 p-6 rounded-3xl">
    <h3 className="text-slate-400 mb-3">
      📈 Highest Usage
    </h3>

    <p className="text-2xl font-bold">
      Gemini 2.5 Flash
    </p>
  </div>

</div>


<h2 className="text-4xl font-bold mt-10 mb-6">
  Benchmark Analytics
</h2>

<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

  <div className="bg-slate-800 p-6 rounded-3xl">
    <h3 className="text-slate-400 mb-3">
      🏆 Fastest Overall
    </h3>

    <p className="text-2xl font-bold">
      {fastestWinner}
    </p>
  </div>

  <div className="bg-slate-800 p-6 rounded-3xl">
    <h3 className="text-slate-400 mb-3">
      ⭐ Best Quality
    </h3>

    <p className="text-2xl font-bold">
      {qualityWinner}
    </p>
  </div>

  <div className="bg-slate-800 p-6 rounded-3xl">
    <h3 className="text-slate-400 mb-3">
      💰 Cheapest
    </h3>

    <p className="text-2xl font-bold">
      {cheapestWinner}
    </p>
  </div>

  <div className="bg-slate-800 p-6 rounded-3xl">
    <h3 className="text-slate-400 mb-3">
      📊 Benchmark Runs
    </h3>

    <p className="text-2xl font-bold">
      {benchmarkStats?.total_runs || 0}
    </p>
  </div>

</div>

<h2 className="text-4xl font-bold mb-6">
  Benchmark History
</h2>

<div className="bg-slate-800 rounded-3xl p-6 mb-12 overflow-x-auto">

<table className="w-full">

<thead>

<tr className="border-b border-slate-700">

<th className="text-left py-3">
Prompt
</th>

<th className="text-left py-3">
Fastest
</th>

<th className="text-left py-3">
Cheapest
</th>

<th className="text-left py-3">
Best Quality
</th>

</tr>

</thead>

<tbody>

{benchmarkHistory?.map(
(item, index) => (

<tr
key={index}
className="
border-b
border-slate-700
"
>

<td className="py-3">
{item.prompt}
</td>

<td className="py-3">
{item.fastest_model}
</td>

<td className="py-3">
{item.cheapest_model}
</td>

<td className="py-3">
{item.best_quality_model}
</td>

</tr>

))}
</tbody>

</table>

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

<h2 className="text-4xl font-bold mt-10 mb-6">
  Cost Forecast
</h2>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

  <div className="bg-slate-800 p-6 rounded-3xl">

    <h3 className="text-slate-400">
      Next 7 Days
    </h3>

    <p className="text-3xl font-bold mt-2">
      ${forecast.forecast_7_days}
    </p>

  </div>

  <div className="bg-slate-800 p-6 rounded-3xl">

    <h3 className="text-slate-400">
      Next 30 Days
    </h3>

    <p className="text-3xl font-bold mt-2">
      ${forecast.forecast_30_days}
    </p>

  </div>

  <div className="bg-slate-800 p-6 rounded-3xl">

    <h3 className="text-slate-400">
      Next 90 Days
    </h3>

    <p className="text-3xl font-bold mt-2">
      ${forecast.forecast_90_days}
    </p>

  </div>

</div>

<h2 className="text-4xl font-bold mt-10 mb-6">
  Quality Drift Monitor
</h2>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

  <div className="bg-slate-800 p-6 rounded-3xl">

    <h3 className="text-slate-400">
      Drift Status
    </h3>

    <p
      className={`text-3xl font-bold mt-2 ${
        quality.drift === "Low"
          ? "text-green-400"
          : quality.drift === "Medium"
          ? "text-yellow-400"
          : "text-red-400"
      }`}
    >
      {quality.drift}
    </p>

  </div>

  <div className="bg-slate-800 p-6 rounded-3xl">

    <h3 className="text-slate-400">
      Avg Response Length
    </h3>

    <p className="text-3xl font-bold mt-2">
      {quality.avg_response_length}
    </p>

  </div>

  <div className="bg-slate-800 p-6 rounded-3xl">

    <h3 className="text-slate-400">
      Error Rate
    </h3>

    <p className="text-3xl font-bold mt-2">
      {quality.error_rate}%
    </p>

  </div>

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