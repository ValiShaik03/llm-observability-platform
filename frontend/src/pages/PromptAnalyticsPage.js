import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PromptAnalyticsPage() {
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/prompt-analytics"
      );

      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-10 text-white">

      <h1 className="text-6xl font-bold mb-10">
        Prompt Analytics
      </h1>

      <div className="bg-slate-800 rounded-3xl p-8">

        <h2 className="text-3xl font-bold mb-6">
          Prompt Performance
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
                  Traffic %
                </th>

                <th className="text-left py-4">
                  Model
                </th>

                <th className="text-left py-4">
                  Requests
                </th>

                <th className="text-left py-4">
                  Avg Cost
                </th>

                <th className="text-left py-4">
                  Avg Latency
                </th>

                <th className="text-left py-4">
                  Avg Tokens
                </th>

                <th className="text-left py-4">
                  Total Cost
                </th>

                <th className="text-left py-4">
                  Total Tokens
                </th>

              </tr>

            </thead>

            <tbody>

              {analytics.map((item, index) => (

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
                    {item.traffic_percentage}%
                  </td>

                  <td className="py-4">
                    {item.model}
                  </td>

                  <td className="py-4">
                    {item.requests}
                  </td>

                  <td className="py-4">
                    ${item.avg_cost}
                  </td>

                  <td className="py-4">
                    {item.avg_latency}s
                  </td>

                  <td className="py-4">
                    {item.avg_tokens}
                  </td>

                  <td className="py-4">
                    ${item.total_cost}
                  </td>

                  <td className="py-4">
                    {item.total_tokens}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}