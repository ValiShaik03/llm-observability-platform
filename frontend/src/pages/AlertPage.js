import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AlertsPage() {

  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState({});
  const [, forceUpdate] = useState(0);

  // Fetch alerts every 10 seconds
  useEffect(() => {

    fetchAlerts();

    const interval = setInterval(() => {
      fetchAlerts();
    }, 10000);

    return () => clearInterval(interval);

  }, []);

  // Update "Last Alert" card every minute
  useEffect(() => {

    const timer = setInterval(() => {
      forceUpdate(prev => prev + 1);
    }, 60000);

    return () => clearInterval(timer);

  }, []);

  const fetchAlerts = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/alerts"
      );

      setAlerts(res.data.alerts || []);
      setSummary(res.data.summary || {});

    } catch (error) {

      console.error(
        "Failed to fetch alerts",
        error
      );

    }
  };

  const getLastAlertTime = () => {

    if (!alerts.length) return "-";

    const latest = new Date(
      alerts[0].created_at + "Z"
    );

    const now = new Date();

    const diffMinutes = Math.floor(
      (now - latest) / (1000 * 60)
    );

    if (diffMinutes <= 1)
      return "just now";

    if (diffMinutes < 60)
      return `${diffMinutes} mins ago`;

    const diffHours = Math.floor(
      diffMinutes / 60
    );

    if (diffHours < 24)
      return diffHours === 1
        ? "1 hr ago"
        : `${diffHours} hrs ago`;

    const diffDays = Math.floor(
      diffHours / 24
    );

    return diffDays === 1
      ? "1 day ago"
      : `${diffDays} days ago`;
  };

  return (

    <div className="flex-1 p-8 overflow-y-auto">

      <h1 className="text-5xl font-bold mb-10">
        Alert Center
      </h1>

      {/* Summary Cards */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-slate-400 text-lg">
            🚨 Total Alerts
          </p>

          <h2 className="text-5xl font-bold mt-4">
            {summary.total_alerts || 0}
          </h2>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-slate-400 text-lg">
            🔴 Critical Alerts
          </p>

          <h2 className="text-5xl font-bold mt-4 text-red-400">
            {summary.critical_alerts || 0}
          </h2>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-slate-400 text-lg">
            🟡 Warning Alerts
          </p>

          <h2 className="text-5xl font-bold mt-4 text-yellow-400">
            {summary.warning_alerts || 0}
          </h2>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-slate-400 text-lg">
            🕒 Last Alert
          </p>

          <h2 className="text-4xl font-bold mt-4">
            {getLastAlertTime()}
          </h2>
        </div>

      </div>

      {/* Alerts List */}

      <div className="bg-slate-800 rounded-3xl p-6 shadow-lg">

        {alerts.length === 0 ? (

          <p className="text-slate-400">
            No alerts found
          </p>

        ) : (

          alerts.map((alert, index) => (

            <div
              key={index}
              className="border-b border-slate-700 py-6"
            >

              <div className="flex justify-between items-center">

                <h3
                  className={`text-3xl font-bold ${
                    alert.severity === "critical"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {alert.type}
                </h3>

                <span
                  className={`px-4 py-2 rounded-xl text-sm font-bold ${
                    alert.severity === "critical"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-600 text-white"
                  }`}
                >
                  {alert.severity
                    ? alert.severity.toUpperCase()
                    : "WARNING"}
                </span>

              </div>

              <p className="mt-4 text-xl text-white">
                {alert.message}
              </p>

              <p className="mt-3 text-slate-400">
                {new Date(
                  alert.created_at
                ).toLocaleString()}
              </p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}