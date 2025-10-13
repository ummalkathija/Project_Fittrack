import { NextRequest } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { handlePrismaError, serializeDates } from '@/src/lib/api-utils'

/**
 * GET /api/workout-types - List all workout types
 */
export async function GET(request: NextRequest) {
  try {
    const workoutTypes = await prisma.workoutType.findMany({
      orderBy: { name: 'asc' }
    })
    
    const serializedWorkoutTypes = serializeDates(workoutTypes)
    
    return Response.json(serializedWorkoutTypes, { status: 200 })
    
  } catch (error) {
    console.error('Error fetching workout types:', error)
    return handlePrismaError(error)
  }
}