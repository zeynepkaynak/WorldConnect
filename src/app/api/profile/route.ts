import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET(request: NextRequest) {
  try {
    const sessionKey = request.headers.get('authorization')?.replace('Bearer ', '')
    
    console.log('🔍 Profile API - Session key:', sessionKey ? sessionKey.substring(0, 10) + '...' : 'not provided')
    console.log('🔍 Profile API - Storage instance:', !!storage)
    console.log('🔍 Profile API - Global storage exists:', !!(global as any).__worldid_storage)
    console.log('🔍 Profile API - Total sessions in global:', (global as any).__worldid_storage?.sessions?.size || 0)
    console.log('🔍 Profile API - Total users in global:', (global as any).__worldid_storage?.users?.size || 0)
    
    if (!sessionKey) {
      console.log('❌ No authorization header')
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    const session = storage.getSession(sessionKey)
    
    console.log('🔍 Profile API - Session found:', !!session)
    
    if (!session) {
      console.log('❌ Invalid or expired session')
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
    }

    const user = storage.getUserById(session.userId)

    console.log('🔍 Profile API - User found:', !!user, user?.username)

    if (!user) {
      console.log('❌ User not found')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('✅ Profile API - Success')
    return NextResponse.json({
      user: {
        id: user.id,
        worldId: user.worldId,
        username: user.username,
        profileImage: user.profileImage,
        friendCode: user.friendCode,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionKey = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!sessionKey) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    const session = storage.getSession(sessionKey)
    
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
    }

    const user = storage.getUserById(session.userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { username, profileImage } = await request.json()

    // Update user
    const updatedUser = storage.updateUser(session.userId, {
      username: username || user.username,
      profileImage: profileImage || user.profileImage,
    })

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        worldId: updatedUser.worldId,
        username: updatedUser.username,
        profileImage: updatedUser.profileImage,
        friendCode: updatedUser.friendCode,
        updatedAt: updatedUser.updatedAt
      }
    })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
