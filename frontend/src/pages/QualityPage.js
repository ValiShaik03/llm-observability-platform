
export default function QualityPage({
  benchmarkStats,
  recommendedModel
}) {

  const bestQualityModel =
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

  return (
    <div className="flex-1 p-8 overflow-y-auto">

      <h1 className="text-5xl font-bold mb-10">
        Quality Monitor
      </h1>

      {/* KPI Cards */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h3 className="text-slate-400">
            Best Quality Model
          </h3>

          <p className="text-3xl font-bold mt-2">
            {bestQualityModel}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h3 className="text-slate-400">
            Recommended Model
          </h3>

          <p className="text-3xl font-bold mt-2">
            {recommendedModel?.recommended_model || "-"}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h3 className="text-slate-400">
            Quality Score
          </h3>

          <p className="text-3xl font-bold mt-2">
            {recommendedModel?.score || 0}
          </p>
        </div>

      </div>

      {/* Quality Comparison */}

      <div className="bg-slate-800 p-8 rounded-2xl mb-8">

        <h2 className="text-3xl font-bold mb-6">
          Quality Comparison
        </h2>

        {benchmarkStats?.quality &&
          Object.entries(
            benchmarkStats.quality
          ).map(([model, score]) => (
            <div
              key={model}
              className="
                flex
                justify-between
                border-b
                border-slate-700
                py-3
              "
            >
              <span>{model}</span>
              <span>{score}</span>
            </div>
          ))}
      </div>

      {/* Insights */}

      <div className="bg-slate-800 p-8 rounded-2xl">

        <h2 className="text-3xl font-bold mb-6">
          Quality Insights
        </h2>

        <div className="space-y-4 text-lg">

          <p>
            🏆 Highest Quality:
            {" "}
            <strong>
              {bestQualityModel}
            </strong>
          </p>

          <p>
            🤖 Recommended:
            {" "}
            <strong>
              {recommendedModel?.recommended_model}
            </strong>
          </p>

          <p>
            📈 Monitor quality scores
            continuously to detect
            model drift.
          </p>

        </div>

      </div>

    </div>
  );
}