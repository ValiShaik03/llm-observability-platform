export default function Header({
  title,
  stats
}) {
  return (
    <div className="flex justify-between items-center p-6 border-b border-slate-800">

      <h1 className="text-4xl font-bold">
        {title}
      </h1>

      <div className="flex gap-4">

        <div className="bg-slate-800 px-6 py-3 rounded-xl">
          Requests: {stats.total_requests}
        </div>

        <div className="bg-slate-800 px-6 py-3 rounded-xl">
          Latency: {stats.avg_latency}
        </div>

      </div>

    </div>
  );
}