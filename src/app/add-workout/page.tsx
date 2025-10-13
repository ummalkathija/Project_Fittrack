import { redirect } from 'next/navigation'
import { getSession } from '@auth0/nextjs-auth0'
import { prisma } from '@/src/lib/prisma'
import UserNav from '@/src/components/UserNav'
import AddWorkoutClient from '@/src/components/AddWorkoutClient'

export default async function AddWorkoutPage() {
  // Check authentication
  const session = await getSession()
  if (!session?.user) {
    redirect('/api/auth/login')
  }

  // Fetch workout types for the form
  const workoutTypes = await prisma.workoutType.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <AddWorkoutClient workoutTypes={workoutTypes} />
      
      {/* Keep UserNav in server component for session access */}
      <div className="absolute top-4 right-8 z-10">
        <UserNav />
      </div>
    </div>
  )
}