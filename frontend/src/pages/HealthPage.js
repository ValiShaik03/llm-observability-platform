export default function HealthPage() {
  const services = [
    "FastAPI",
    "PostgreSQL",
    "Prometheus",
    "Grafana",
    "Jaeger",
    "Langfuse",
    "Groq"
  ];

  return (
    <div className="flex-1 p-8">

      <div className="grid grid-cols-2 gap-6">

        {services.map((service) => (
          <div
            key={service}
            className="bg-slate-800 p-8 rounded-3xl"
          >
            <h3 className="text-slate-400 mb-2">
              {service}
            </h3>

            <p className="text-3xl font-bold text-green-400">
              🟢 Healthy
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}