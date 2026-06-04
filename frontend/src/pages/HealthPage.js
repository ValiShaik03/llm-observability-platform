import { useState, useEffect } from "react";
import axios from "axios";

<h1 className="text-red-500 text-6xl">
  TEST HEALTH PAGE
</h1>

// src/pages/HealthPage.js

export default function HealthPage({ health }) {

  const getStatusColor = (status) =>
    status === "healthy"
      ? "text-green-400"
      : "text-red-400";

  return (
    <div className="flex-1 p-8 overflow-y-auto">

      <h2 className="text-4xl font-bold mb-8">
        System Health
      </h2>

      <div className="bg-slate-800 rounded-3xl p-6">

        {Object.entries(health || {}).map(
          ([service, status]) => (

          <div
            key={service}
            className="
              flex
              justify-between
              py-3
              border-b
              border-slate-700
            "
          >
            <span className="capitalize">
              {service}
            </span>

            <span className={getStatusColor(status)}>
              {status === "healthy"
                ? "🟢 Healthy"
                : "🔴 Unhealthy"}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}