import { useState, useEffect } from "react";
import axios from "axios";

<h1 className="text-red-500 text-6xl">
  TEST HEALTH PAGE
</h1>

export default function HealthPage() {

  const [health, setHealth] = useState({});

  useEffect(() => {

    const fetchHealth = async () => {

      try {

        const res = await axios.get(
          "http://127.0.0.1:8000/health"
        );

        setHealth(res.data);

      } catch (err) {

        console.error(err);

      }
    };

    fetchHealth();

    const interval = setInterval(
      fetchHealth,
      5000
    );

    return () => clearInterval(interval);

  }, []);

  return (

    <div className="flex-1 p-8">

      <div className="grid grid-cols-2 gap-6">

        {Object.entries(health).map(
          ([service, status]) => (

            <div
              key={service}
              className="bg-slate-800 p-8 rounded-3xl"
            >

              <h3 className="text-slate-400 mb-2 capitalize">
                {service}
              </h3>
              <span className="text-red-500 text-2xl">
  🔴 unhealthy
</span>

            </div>
          )
        )}

      </div>

    </div>
  );
}