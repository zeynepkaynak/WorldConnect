import { NextRequest, NextResponse } from "next/server"
import { storage } from '@/lib/storage'

export async function POST(req: NextRequest) {
  try {
    const { sessionKey } = await req.json()
    
    if (!sessionKey) {
      return NextResponse.json(
        { success: false, error: "Session key required" },
        { status: 400 }
      )
    }

    const session = storage.getSession(sessionKey)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session" },
        { status: 401 }
      )
    }

    const user = storage.getUserById(session.userId)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        worldId: user.worldId,
        username: user.username,
        friendCode: user.friendCode
      }
    })

  } catch (error) {
    console.error("Session verify error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
