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

      console.error(
        "Failed to fetch A/B testing data",
        err
      );

    }
  };

  const getFastestVersion = () => {

    if (!data.length) return null;

    return [...data].sort(
      (a, b) => a.avg_latency - b.avg_latency
    )[0];
  };

  const getCheapestVersion = () => {

    if (!data.length) return null;

    return [...data].sort(
      (a, b) => a.avg_cost - b.avg_cost
    )[0];
  };

  const getLowestTokenVersion = () => {

    if (!data.length) return null;

    return [...data].sort(
      (a, b) => a.avg_tokens - b.avg_tokens
    )[0];
  };

  const getRecommendedVersion = () => {

    const summarizerVersions = data.filter(
      (item) =>
        item.template_name === "Summarizer"
    );

    if (summarizerVersions.length === 0) {
      return null;
    }

    const scoredVersions =
      summarizerVersions.map((item) => ({
        ...item,

        score:
          (item.requests * 2)
          -
          (item.avg_latency * 5)
          -
          (item.avg_cost * 100000)
      }));

    return scoredVersions.sort(
      (a, b) => b.score - a.score
    )[0];
  };

  const getTrafficSplit = () => {

    const summarizerVersions = data.filter(
      (item) =>
        item.template_name === "Summarizer"
    );

    const totalRequests =
      summarizerVersions.reduce(
        (sum, item) =>
          sum + item.requests,
        0
      );

    return summarizerVersions.map(
      (item) => ({
        version:
          item.template_version,

        percentage:
          totalRequests > 0
            ? (
                item.requests /
                totalRequests *
                100
              ).toFixed(1)
            : 0
      })
    );
  };

  const recommended =
    getRecommendedVersion();

  return (

    <div className="p-10 text-white">

      <h1 className="text-6xl font-bold mb-10">
        A/B Testing Dashboard
      </h1>

      {/* Comparison Table */}

      <div className="bg-slate-800 rounded-3xl p-8 mb-10">

        <h2 className="text-3xl font-bold mb-8">
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

                <th className="text-left py-4">
                  Winner
                </th>

              </tr>

            </thead>

            <tbody>

              {data.map((item, index) => (

                <tr
                  key={index}
                  className="
                    border-b
                    border-slate-700
                  "
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

                  <td className="py-4 text-2xl">

                    {recommended &&
                    recommended.template_name === item.template_name &&
                    recommended.template_version === item.template_version
                      ? "🏆"
                      : "-"}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Summary Cards */}

      <div className="grid md:grid-cols-4 gap-6 mb-10">

        <div className="bg-slate-800 p-6 rounded-2xl">

          <h3 className="text-xl font-bold mb-3">
            ⚡ Fastest Version
          </h3>

          <p className="text-4xl font-bold">

            {
              getFastestVersion()?.template_version
            }

          </p>

        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">

          <h3 className="text-xl font-bold mb-3">
            💰 Cheapest Version
          </h3>

          <p className="text-4xl font-bold">

            {
              getCheapestVersion()?.template_version
            }

          </p>

        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">

          <h3 className="text-xl font-bold mb-3">
            🔤 Lowest Tokens
          </h3>

          <p className="text-4xl font-bold">

            {
              getLowestTokenVersion()?.template_version
            }

          </p>

        </div>

        <div className="bg-green-700 p-6 rounded-2xl">

          <h3 className="text-xl font-bold mb-3">
            🏆 Recommended
          </h3>

          <p className="text-3xl font-bold">

            {recommended
              ? `${recommended.template_name} ${recommended.template_version}`
              : "N/A"}

          </p>

          {recommended && (

            <p className="mt-4 text-sm">

              {recommended.requests}
              {" "}Requests

              <br />

              {recommended.avg_latency}s
              {" "}Latency

              <br />

              ${recommended.avg_cost}
              {" "}Avg Cost

            </p>

          )}

        </div>

      </div>

      {/* Traffic Split */}

      <div className="bg-slate-800 rounded-3xl p-8">

        <h2 className="text-3xl font-bold mb-8">
          Traffic Split (Summarizer)
        </h2>

        {getTrafficSplit().map(
          (item, index) => (

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

              <div
                className="
                  bg-slate-700
                  h-4
                  rounded-full
                "
              >

                <div
                  className="
                    bg-blue-500
                    h-4
                    rounded-full
                  "
                  style={{
                    width:
                      `${item.percentage}%`
                  }}
                />

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
}