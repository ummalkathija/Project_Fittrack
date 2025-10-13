import { prisma } from '@/src/lib/prisma'
import { User as Auth0User } from '@auth0/nextjs-auth0'

export interface AppUser {
  id: number
  auth0Id: string
  email: string
  name: string
  picture?: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Get or create user from Auth0 profile
 */
export async function getOrCreateUser(auth0User: Auth0User): Promise<AppUser> {
  if (!auth0User.sub || !auth0User.email) {
    throw new Error('Invalid Auth0 user data')
  }

  try {
    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { auth0Id: auth0User.sub }
    })

    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          auth0Id: auth0User.sub,
          email: auth0User.email,
          name: auth0User.name || auth0User.email.split('@')[0],
          picture: auth0User.picture || null
        }
      })
    } else {
      // Update user info if it has changed
      const updates: any = {}
      
      if (user.email !== auth0User.email) updates.email = auth0User.email
      if (user.name !== auth0User.name && auth0User.name) updates.name = auth0User.name
      if (user.picture !== auth0User.picture && auth0User.picture) updates.picture = auth0User.picture
      
      if (Object.keys(updates).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updates
        })
      }
    }

    return user
  } catch (error) {
    console.error('Error getting or creating user:', error)
    throw new Error('Failed to manage user account')
  }
}

/**
 * Get user by Auth0 ID
 */
export async function getUserByAuth0Id(auth0Id: string): Promise<AppUser | null> {
  try {
    return await prisma.user.findUnique({
      where: { auth0Id }
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<AppUser | null> {
  try {
    return await prisma.user.findUnique({
      where: { email }
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: number) {
  try {
    const [workoutCount, totalStats] = await Promise.all([
      prisma.workout.count({
        where: { userId }
      }),
      prisma.workout.aggregate({
        where: { userId },
        _sum: {
          durationMin: true,
          calories: true
        }
      })
    ])

    return {
      totalWorkouts: workoutCount,
      totalDuration: totalStats._sum.durationMin || 0,
      totalCalories: totalStats._sum.calories || 0
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return {
      totalWorkouts: 0,
      totalDuration: 0,
      totalCalories: 0
    }
  }
}