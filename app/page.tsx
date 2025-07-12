export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to your HR management dashboard. Monitor employee data, track performance, and manage your workforce efficiently.
        </p>
      </div>

      {/* Sample content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Employees</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">150</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Employees</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">142</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Departments</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">8</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Requests</h3>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">12</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your dashboard is ready! Navigate using the sidebar to explore different sections.
        </p>
      </div>
    </div>
  )
} 