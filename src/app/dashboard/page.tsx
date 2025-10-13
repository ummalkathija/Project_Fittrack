import { Suspense } from 'react'
import { getSession } from '@auth0/nextjs-auth0'
import { redirect } from 'next/navigation'
import { getOrCreateUser } from '@/src/lib/user'
import { getWorkoutTrend } from '@/src/lib/dashboard'
import { DashboardStats, DashboardStatsLoading } from '@/src/components/dashboard/DashboardStats'
import { RecentWorkouts } from '@/src/components/dashboard/RecentWorkouts'
import { ChartContainer } from '@/src/components/dashboard/ChartContainer'
import { WorkoutChartLoading } from '@/src/components/dashboard/WorkoutChart'

export const metadata = {
  title: 'Dashboard | FitTrack',
  description: 'Your fitness journey overview'
}

export default async function DashboardPage() {
  // Check authentication
  const session = await getSession()
  if (!session?.user) {
    redirect('/api/auth/login')
  }

  // Get user data
  const user = await getOrCreateUser(session.user)
  
  // Get initial chart data (30 days)
  const initialChartData = await getWorkoutTrend(user.id, 30)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600">
                Here's your fitness journey overview
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/add-workout"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Log Workout
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats cards */}
          <Suspense fallback={<DashboardStatsLoading />}>
            <DashboardStats userId={user.id} />
          </Suspense>

          {/* Charts and recent activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart - takes up 2 columns */}
            <div className="lg:col-span-2">
              <Suspense fallback={<WorkoutChartLoading />}>
                <ChartContainer 
                  userId={user.id} 
                  initialData={initialChartData} 
                />
              </Suspense>
            </div>

            {/* Recent workouts - takes up 1 column */}
            <div className="lg:col-span-1">
              <Suspense fallback={<RecentWorkoutsLoading />}>
                <RecentWorkouts userId={user.id} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading component for recent workouts
function RecentWorkoutsLoading() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-6 py-4">
            <div className="animate-pulse flex items-start space-x-3">
              <div className="w-3 h-3 bg-gray-200 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}