import { NextRequest, NextResponse } from "next/server"
import { verifyCloudProof } from "@worldcoin/idkit"
import { LoginResponse } from "@/types"
import { storage } from '@/lib/storage'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    if (!body.appId || !body.zkProof) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" } as LoginResponse,
        { status: 400 }
      )
    }

    // World ID doğrulaması yapacağız (şimdilik mock)
    console.log("🔐 Verifying World ID proof for app:", body.appId)
    
    const nullifierHash = body.zkProof.nullifier_hash || 'mock_' + Date.now()

    // Check if user exists
    let user = storage.getUserByWorldId(nullifierHash)

    // Create new user if doesn't exist
    if (!user) {
      user = storage.createUser(nullifierHash, '')
    }

    // Generate session key
    const sessionKey = storage.createSession(user.id)

    console.log("✅ Session created successfully:", {
      sessionKey: sessionKey.substring(0, 10) + '...',
      userId: user.id,
      friendCode: user.friendCode,
      username: user.username,
      storageInstance: !!storage,
      globalStorageExists: !!(global as any).__worldid_storage,
      totalSessions: (global as any).__worldid_storage?.sessions?.size || 0,
      totalUsers: (global as any).__worldid_storage?.users?.size || 0
    })

    return NextResponse.json({
      success: true,
      sessionKey,
      validUntil: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      txHash: 'mock_tx_' + Date.now().toString(36),
      user: {
        id: user.id,
        worldId: user.worldId,
        username: user.username,
        friendCode: user.friendCode
      }
    } as LoginResponse)

  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" } as LoginResponse,
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: "World ID Pool Login API",
      endpoints: {
        POST: "World ID ile giriş yap ve session key al"
      }
    },
    { status: 200 }
  )
}
