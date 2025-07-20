export default function Analytics() {
  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4">📊 Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Task Distribution</h2>
          <p className="text-gray-500 dark:text-gray-400">Pie chart coming soon...</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Progress Over Time</h2>
          <p className="text-gray-500 dark:text-gray-400">Bar chart coming soon...</p>
        </div>
      </div>
    </div>
  );
}
