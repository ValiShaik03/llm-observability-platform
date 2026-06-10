import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ABTestingPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchABTesting();
  }, []);

  const fetchABTesting = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/ab-testing"
      );

      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getFastestVersion = () => {
    if (!data.length) return "N/A";

    return [...data].sort(
      (a, b) => a.avg_latency - b.avg_latency
    )[0]?.template_version;
  };

  const getCheapestVersion = () => {
    if (!data.length) return "N/A";

    return [...data].sort(
      (a, b) => a.avg_cost - b.avg_cost
    )[0]?.template_version;
  };

  const getLowestTokenVersion = () => {
    if (!data.length) return "N/A";

    return [...data].sort(
      (a, b) => a.avg_tokens - b.avg_tokens
    )[0]?.template_version;
  };

  const getRecommendedVersion = () => {
  const summarizerVersions = data.filter(
    (item) => item.template_name === "Summarizer"
  );

  if (summarizerVersions.length < 2) {
    return {
      version: "Not enough data",
      reason: ""
    };
  }

  const fastest = [...summarizerVersions].sort(
    (a, b) => a.avg_latency - b.avg_latency
  )[0];

  const cheapest = [...summarizerVersions].sort(
    (a, b) => a.avg_cost - b.avg_cost
  )[0];

  const lowestTokens = [...summarizerVersions].sort(
    (a, b) => a.avg_tokens - b.avg_tokens
  )[0];

  return {
    version: `${fastest.template_name} ${fastest.template_version}`,
    reason:
      `Fastest latency (${fastest.avg_latency}s), ` +
      `Lowest cost (${cheapest.avg_cost}), ` +
      `Lowest tokens (${lowestTokens.avg_tokens})`
  };
};

  const getTrafficSplit = () => {
    const summarizerVersions = data.filter(
      (item) => item.template_name === "Summarizer"
    );

    const total = summarizerVersions.reduce(
      (sum, item) => sum + item.requests,
      0
    );

    return summarizerVersions.map((item) => ({
      version: item.template_version,
      percentage:
        total > 0
          ? (
              (item.requests / total) *
              100
            ).toFixed(1)
          : 0,
    }));
  };

  return (
    <div className="p-10 text-white">

      <h1 className="text-6xl font-bold mb-10">
        A/B Testing Dashboard
      </h1>

      {/* Version Comparison */}

      <div className="bg-slate-800 rounded-3xl p-8 mb-10">

        <h2 className="text-3xl font-bold mb-6">
          Prompt Version Comparison
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-700">

                <th className="text-left py-4">
                  Template
                </th>

                <th className="text-left py-4">
                  Version
                </th>

                <th className="text-left py-4">
                  Requests
                </th>

                <th className="text-left py-4">
                  Avg Latency
                </th>

                <th className="text-left py-4">
                  Avg Cost
                </th>

                <th className="text-left py-4">
                  Avg Tokens
                </th>

              </tr>
            </thead>

            <tbody>

              {data.map((item, index) => (

                <tr
                  key={index}
                  className="border-b border-slate-700"
                >

                  <td className="py-4">
                    {item.template_name}
                  </td>

                  <td className="py-4">
                    {item.template_version}
                  </td>

                  <td className="py-4">
                    {item.requests}
                  </td>

                  <td className="py-4">
                    {item.avg_latency}s
                  </td>

                  <td className="py-4">
                    ${item.avg_cost}
                  </td>

                  <td className="py-4">
                    {item.avg_tokens}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Winner Cards */}

      <div className="grid grid-cols-4 gap-6 mb-10">

        <div className="bg-slate-800 p-6 rounded-2xl">

          <h3 className="text-xl font-bold mb-3">
            ⚡ Fastest Version
          </h3>

          <p className="text-4xl font-bold">
            {getFastestVersion()}
          </p>

        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">

          <h3 className="text-xl font-bold mb-3">
            💰 Cheapest Version
          </h3>

          <p className="text-4xl font-bold">
            {getCheapestVersion()}
          </p>

        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">

          <h3 className="text-xl font-bold mb-3">
            🔤 Lowest Tokens
          </h3>

          <p className="text-4xl font-bold">
            {getLowestTokenVersion()}
          </p>

        </div>

        <div className="bg-green-700 p-6 rounded-2xl">

          <h3 className="text-xl font-bold mb-3">
            🏆 Recommended
          </h3>

          <p className="text-2xl font-bold">
  {getRecommendedVersion().version}
</p>

<p className="text-sm mt-3 text-slate-200">
  {getRecommendedVersion().reason}
</p>

        </div>

      </div>

      {/* Traffic Split */}

      <div className="bg-slate-800 rounded-3xl p-8">

        <h2 className="text-3xl font-bold mb-6">
          Traffic Split (Summarizer)
        </h2>

        {getTrafficSplit().map((item, index) => (

          <div
            key={index}
            className="mb-6"
          >

            <div className="flex justify-between mb-2">

              <span>
                {item.version}
              </span>

              <span>
                {item.percentage}%
              </span>

            </div>

            <div className="w-full bg-slate-700 rounded-full h-4">

              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{
                  width: `${item.percentage}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}