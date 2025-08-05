export default function AdminHomePage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded shadow">
          <h3 className="font-semibold text-lg">Total Games</h3>
          <p className="text-3xl mt-2">0</p>
        </div>

        <div className="p-6 bg-white rounded shadow">
          <h3 className="font-semibold text-lg">Total Players</h3>
          <p className="text-3xl mt-2">0</p>
        </div>

        <div className="p-6 bg-white rounded shadow">
          <h3 className="font-semibold text-lg">Active Votes</h3>
          <p className="text-3xl mt-2">0</p>
        </div>
      </div>
    </div>
  )
}
