export default function BenchmarkAnalyticsPage({
  benchmarkHistory
}) {
  console.log("BENCHMARK HISTORY:", benchmarkHistory);
  const totalRuns =
    benchmarkHistory?.length || 0;

  const fastestWins = {};
  const cheapestWins = {};
  const qualityWins = {};

  benchmarkHistory?.forEach((item) => {

    fastestWins[item.fastest_model] =
      (fastestWins[item.fastest_model] || 0) + 1;

    cheapestWins[item.cheapest_model] =
      (cheapestWins[item.cheapest_model] || 0) + 1;

    qualityWins[item.best_quality_model] =
      (qualityWins[item.best_quality_model] || 0) + 1;

  });

  const getWinner = (obj) => {

    if (!Object.keys(obj).length)
      return "-";

    return Object.keys(obj).reduce(
      (a, b) =>
        obj[a] > obj[b]
          ? a
          : b
    );
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">

      <h1 className="text-5xl font-bold mb-10">
        Benchmark Analytics
      </h1>

      {/* Summary Cards */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h3>Total Runs</h3>

          <p className="text-4xl font-bold mt-2">
            {totalRuns}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h3>Fastest Winner</h3>

          <p className="text-3xl font-bold mt-2">
            {getWinner(fastestWins)}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h3>Cheapest Winner</h3>

          <p className="text-3xl font-bold mt-2">
            {getWinner(cheapestWins)}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl">
          <h3>Best Quality</h3>

          <p className="text-3xl font-bold mt-2">
            {getWinner(qualityWins)}
          </p>
        </div>

      </div>

      {/* Fastest Wins */}

      <div className="bg-slate-800 p-6 rounded-2xl mb-6">

        <h2 className="text-3xl font-bold mb-6">
          Fastest Model Leaderboard
        </h2>

        {Object.entries(fastestWins).map(
          ([model, wins]) => (

          <div
            key={model}
            className="
              flex
              justify-between
              py-3
              border-b
              border-slate-700
            "
          >
            <span>{model}</span>

            <span>{wins}</span>
          </div>

        ))}
      </div>

      {/* Cheapest Wins */}

      <div className="bg-slate-800 p-6 rounded-2xl mb-6">

        <h2 className="text-3xl font-bold mb-6">
          Cheapest Model Leaderboard
        </h2>

        {Object.entries(cheapestWins).map(
          ([model, wins]) => (

          <div
            key={model}
            className="
              flex
              justify-between
              py-3
              border-b
              border-slate-700
            "
          >
            <span>{model}</span>

            <span>{wins}</span>
          </div>

        ))}
      </div>

      {/* Quality Wins */}

      <div className="bg-slate-800 p-8 rounded-2xl mb-8">

        <h2 className="text-3xl font-bold mb-6">
          Quality Leaderboard
        </h2>

        {Object.entries(qualityWins).map(
          ([model, wins]) => (

          <div
            key={model}
            className="
              flex
              justify-between
              py-3
              border-b
              border-slate-700
            "
          >
            <span>{model}</span>

            <span>{wins}</span>
          </div>

        ))}
      </div>

      {/* Insights */}

      <div className="bg-slate-800 p-8 rounded-2xl">

        <h2 className="text-3xl font-bold mb-6">
          Benchmark Insights
        </h2>

        <p className="mb-3">
          🏆 Fastest:
          {" "}
          {getWinner(fastestWins)}
        </p>

        <p className="mb-3">
          💰 Cheapest:
          {" "}
          {getWinner(cheapestWins)}
        </p>

        <p className="mb-3">
          🧠 Highest Quality:
          {" "}
          {getWinner(qualityWins)}
        </p>

      </div>

    <div className="bg-slate-800 p-8 rounded-2xl mt-8">

  <h2 className="text-3xl font-bold mb-6">
    Benchmark History
  </h2>

  <div className="overflow-x-auto">

    <table className="w-full">

      <thead>

        <tr className="border-b border-slate-700">

          <th className="text-left py-3">
            Prompt
          </th>

          <th className="text-left py-3">
            Fastest
          </th>

          <th className="text-left py-3">
            Cheapest
          </th>

          <th className="text-left py-3">
            Best Quality
          </th>

        </tr>

      </thead>

      <tbody>

        {benchmarkHistory?.map((item, index) => (

          <tr
            key={index}
            className="border-b border-slate-700"
          >

            <td className="py-3">
              {item.prompt}
            </td>

            <td className="py-3">
              {item.fastest_model}
            </td>

            <td className="py-3">
              {item.cheapest_model}
            </td>

            <td className="py-3">
              {item.best_quality_model}
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