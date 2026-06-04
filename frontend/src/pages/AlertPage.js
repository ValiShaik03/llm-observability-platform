export default function AlertPage({ alerts }) {

  return (
    <div className="flex-1 p-8 overflow-y-auto">

      <h2 className="text-4xl font-bold mb-8">
        Alert Center
      </h2>

      <div className="bg-slate-800 rounded-3xl p-6">

        {alerts?.length === 0 ? (
          <p className="text-slate-400">
            No alerts found
          </p>
        ) : (
          alerts?.map((alert) => (

            <div
              key={alert.id}
              className="
                border-b
                border-slate-700
                py-4
              "
            >
              <h3 className="text-red-400 font-bold text-xl">
                {alert.type}
              </h3>

              <p className="mt-2">
                {alert.message}
              </p>

              <p className="text-sm text-slate-400 mt-2">
                {alert.created_at}
              </p>

            </div>

          ))
        )}

      </div>

    </div>
  );
}