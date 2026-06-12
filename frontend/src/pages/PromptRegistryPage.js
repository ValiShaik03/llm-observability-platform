import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PromptRegistryPage() {
  const [templates, setTemplates] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    fetchTemplates();
    fetchAnalytics();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/prompt-template"
      );

      setTemplates(res.data);
    } catch (error) {
      console.error(
        "Failed to fetch templates",
        error
      );
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/prompt-template-analytics"
      );

      console.log("Analytics:", res.data);

      setAnalytics(res.data);
    } catch (error) {
      console.error(
        "Failed to fetch analytics",
        error
      );
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">

      <h1 className="text-5xl font-bold mb-10">
        Prompt Registry
      </h1>

      {/* Analytics Cards */}

      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <div className="bg-slate-800 p-8 rounded-2xl">
          <h3 className="text-slate-400 text-xl">
            📊 Most Used Template
          </h3>

          <p className="text-4xl font-bold mt-4">
            {analytics.most_used_template || "-"}
          </p>

          <p className="text-slate-400 mt-2">
            {analytics.most_used_count || 0} Requests
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl">
          <h3 className="text-slate-400 text-xl">
            ⚡ Fastest Template
          </h3>

          <p className="text-4xl font-bold mt-4">
            {analytics.fastest_template || "-"}
          </p>

          <p className="text-slate-400 mt-2">
            {analytics.fastest_latency
              ? analytics.fastest_latency.toFixed(2)
              : "0.00"}s Avg Latency
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl">
          <h3 className="text-slate-400 text-xl">
            💰 Lowest Cost Template
          </h3>

          <p className="text-4xl font-bold mt-4">
            {analytics.lowest_cost_template || "-"}
          </p>

          <p className="text-slate-400 mt-2">
            $
            {analytics.lowest_cost_value
              ? analytics.lowest_cost_value.toFixed(6)
              : "0.000000"}
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl">
          <h3 className="text-slate-400 text-xl">
            📈 Highest Usage Growth
          </h3>

          <p className="text-4xl font-bold mt-4">
            {analytics.highest_usage_growth || "-"}
          </p>

          <p className="text-slate-400 mt-2">
            +{analytics.growth_count || 0} Requests
          </p>
        </div>

      </div>

      {/* Templates List */}

      <div className="bg-slate-800 p-8 rounded-2xl">

        <h2 className="text-3xl font-bold mb-8">
          Registered Templates
        </h2>

        {templates.length === 0 ? (
          <p className="text-slate-400">
            No templates found
          </p>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="
                border-b
                border-slate-700
                pb-6
                mb-6
              "
            >
              <h3 className="text-2xl font-bold">
                {template.name}
              </h3>

              <div className="flex items-center gap-3 mt-2">

                <p className="text-slate-400">
                  Version: {template.version}
                </p>

                <span
                  className={
                    template.is_active
                      ? `
                        bg-green-600
                        text-white
                        px-3
                        py-1
                        rounded-lg
                        text-xs
                        font-bold
                      `
                      : `
                        bg-slate-600
                        text-white
                        px-3
                        py-1
                        rounded-lg
                        text-xs
                        font-bold
                      `
                  }
                >
                  {template.is_active
                    ? "ACTIVE"
                    : "INACTIVE"}
                </span>

              </div>

              <p className="mt-4 text-lg">
                {template.template}
              </p>

              <div className="flex gap-6 mt-4 text-slate-400">

                <span>
                  Traffic:
                  {" "}
                  {template.traffic_percentage || 0}%
                </span>

                <span>
                  {new Date(
                    template.created_at
                  ).toLocaleString()}
                </span>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}