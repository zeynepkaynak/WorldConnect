'use client'

import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit"
import type { ISuccessResult } from "@worldcoin/idkit"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { toast } from "sonner"

interface WorldIDLoginProps {
  onSuccess: (sessionKey: string) => void
  appId?: string
  className?: string
}

export function WorldIDLogin({ onSuccess, appId, className }: WorldIDLoginProps) {
  const handleVerify = async (verificationResponse: ISuccessResult) => {
    try {
      console.log("🔐 ZK-Proof received from World ID, sending to backend...")
      
      const res = await fetch("/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: appId || "worldid-pool",
          zkProof: verificationResponse,
          actionId: process.env.NEXT_PUBLIC_WLD_ACTION_ID,
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Verification failed")
      }

      if (data.success && data.sessionKey) {
        const txInfo = data.txHash ? ` (Tx: ${data.txHash.substring(0, 8)}...)` : ''
        const validUntil = data.validUntil ? new Date(data.validUntil).toLocaleTimeString() : ''
        
        // Store session key and user data
        localStorage.setItem('sessionKey', data.sessionKey)
        
        toast.success(
          `🎉 Verification successful! Redirecting to profile...${txInfo}`,
          {
            description: validUntil ? `Valid until: ${validUntil}` : undefined,
            duration: 3000
          }
        )
        
        console.log("✅ Session created:", {
          sessionKey: data.sessionKey.substring(0, 10) + '...',
          validUntil: data.validUntil,
          txHash: data.txHash
        })
        
        // Redirect to profile page after a short delay
        setTimeout(() => {
          window.location.href = '/profile'
        }, 1500)
        
        onSuccess(data.sessionKey)
      } else {
        throw new Error("Could not get session key")
      }
    } catch (error) {
      console.error("Verification error:", error)
      toast.error("❌ Verification failed: " + (error as Error).message)
      throw error
    }
  }

  const handleSuccess = () => {
    console.log("World ID verification completed")
  }

  return (
    <IDKitWidget
      app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
      action={process.env.NEXT_PUBLIC_WLD_ACTION_ID!}
      onSuccess={handleSuccess}
      handleVerify={handleVerify}
      verification_level={VerificationLevel.Device}
    >
      {({ open }) => (
        <Button 
          onClick={open}
          className={className}
          size="lg"
        >
          <Icons.shield className="mr-2 h-4 w-4" />
          Verify with World ID
        </Button>
      )}
    </IDKitWidget>
  )
}
