import React from "react";

export default function QualityPage({
  recommendedModel,
  quality
}) {

  const models =
    recommendedModel?.models || [];

  return (
    <div className="flex-1 p-8 overflow-y-auto">

      <h1 className="text-5xl font-bold mb-10">
        Quality Monitor
      </h1>

      {/* KPI Cards */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">

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
            Performance Score
          </h3>

          <p className="text-3xl font-bold mt-2">
            {recommendedModel?.quality_score || 0}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h3 className="text-slate-400">
            Error Rate
          </h3>

          <p className="text-3xl font-bold mt-2">
            {quality?.error_rate || 0}%
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h3 className="text-slate-400">
            Quality Drift
          </h3>

          <p className="text-3xl font-bold mt-2">
            {quality?.drift || "Unknown"}
          </p>
        </div>

      </div>

      {/* Quality Comparison */}

      <div className="bg-slate-800 p-8 rounded-2xl mb-8">

        <h2 className="text-3xl font-bold mb-8">
          Quality Comparison
        </h2>

        <div className="space-y-8">

          {models.map((model) => (

            <div key={model.model}>

              <div className="flex justify-between mb-2">

                <span className="font-semibold text-xl">
                  {model.model}
                </span>

                <span className="text-xl">
                  {model.quality_score}
                </span>

              </div>

              <div className="w-full bg-slate-700 rounded-full h-6">

                <div
                  className="
                    bg-blue-500
                    h-6
                    rounded-full
                  "
                  style={{
                    width:
                      `${model.quality_score}%`
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Model Quality Details */}

      <div className="bg-slate-800 p-8 rounded-2xl">

        <h2 className="text-3xl font-bold mb-8">
          Model Quality Details
        </h2>

        <div className="space-y-6">

          {models.map((model) => (

            <div
              key={model.model}
              className="
                flex
                justify-between
                border-b
                border-slate-700
                pb-4
              "
            >

              <span className="text-2xl">
                {model.model}
              </span>

              <span className="text-xl">

                Latency:
                {" "}
                {model.avg_latency}s

                {" | "}

                Cost:
                {" "}
                ${model.cost}

                {" | "}

                Requests:
                {" "}
                {model.requests}

                {" | "}

                Avg Completion Tokens: {model.avg_completion_tokens?.toFixed(0)}

                {" | "}

                Error Rate:
                {" "}
                {model.error_rate}%

              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}