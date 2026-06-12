export default function CostPage({
  stats,
  forecast,
  modelStats
}) {

  const cheapestModel =
    modelStats?.length
      ? [...modelStats].sort(
          (a, b) => a.cost - b.cost
        )[0]
      : null;

  return (
    <div className="flex-1 p-8 overflow-y-auto">

      <h1 className="text-5xl font-bold mb-10">
        Cost Intelligence
      </h1>

      {/* Cost KPIs */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h3 className="text-slate-400">
            Total Cost
          </h3>

          <p className="text-4xl font-bold mt-2">
            ${stats?.total_cost || 0}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h3 className="text-slate-400">
            Total Tokens
          </h3>

          <p className="text-4xl font-bold mt-2">
            {stats?.total_tokens || 0}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h3 className="text-slate-400">
            Cheapest Model
          </h3>

          <p className="text-3xl font-bold mt-2">
            {cheapestModel?.model || "-"}
          </p>
        </div>

      </div>

      {/* Cost Forecast */}

      <div className="bg-slate-800 p-8 rounded-2xl mb-8">

        <h2 className="text-3xl font-bold mb-6">
          Cost Forecast
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div>
            <h3 className="text-slate-400">
              Next 7 Days
            </h3>

            <p className="text-3xl font-bold">
              ${forecast?.forecast_7_days || 0}
            </p>
          </div>

          <div>
            <h3 className="text-slate-400">
              Next 30 Days
            </h3>

            <p className="text-3xl font-bold">
              ${forecast?.forecast_30_days || 0}
            </p>
          </div>

          <div>
            <h3 className="text-slate-400">
              Next 90 Days
            </h3>

            <p className="text-3xl font-bold">
              ${forecast?.forecast_90_days || 0}
            </p>
          </div>

        </div>

      </div>

<div className="bg-slate-800 p-8 rounded-2xl mb-8">
  <h2 className="text-3xl font-bold mb-6">
    Cost By Model
  </h2>

  <div className="space-y-6">

    {modelStats?.map((model) => {
      const maxCost = Math.max(
        ...modelStats.map((m) => m.cost)
      );

      const percentage =
        maxCost > 0
          ? (model.cost / maxCost) * 100
          : 0;

      return (
        <div key={model.model}>

          <div className="flex justify-between mb-2">
            <span className="font-medium capitalize">
              {model.model}
            </span>

            <span>
              ${model.cost}
            </span>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-4">
            <div
              className="
                bg-green-500
                h-4
                rounded-full
                transition-all
              "
              style={{
                width: `${percentage}%`
              }}
            />
          </div>

        </div>
      );
    })}

  </div>
</div>

      {/* Cost Optimization Insights

      <div className="bg-slate-800 p-8 rounded-2xl">

        <h2 className="text-3xl font-bold mb-6">
          Cost Optimization Insights
        </h2>

        <div className="space-y-4 text-lg">

          <p>
            ✅ Cheapest Model:
            {" "}
            <strong>
              {cheapestModel?.model || "-"}
            </strong>
          </p>

          <p>
            💰 Total Spend:
            {" "}
            <strong>
              ${stats?.total_cost || 0}
            </strong>
          </p>

          <p>
            📦 Total Tokens:
            {" "}
            <strong>
              {stats?.total_tokens || 0}
            </strong>
          </p>

          <p>
            🚀 Recommendation:
            {" "}
            Consider using
            {" "}
            <strong>
              {cheapestModel?.model || "the cheapest model"}
            </strong>
            {" "}
            for high-volume workloads to reduce operational costs.
          </p>

        </div>

      </div>

      */}
    </div>
  );
}
