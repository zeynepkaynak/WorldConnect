"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { WorldIDLogin } from "@/components/world-id-login"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"

export default function AuroraBackgroundDemo() {
  const [sessionKey, setSessionKey] = useState<string>("")
  const [isVerified, setIsVerified] = useState(false)

  const handleLoginSuccess = (key: string) => {
    setSessionKey(key)
    setIsVerified(true)
  }

  const copySessionKey = () => {
    navigator.clipboard.writeText(sessionKey)
  }

  return (
    <AuroraBackground>
      <motion.div 
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-6 items-center justify-center px-4 max-w-2xl mx-auto text-center"
      >
        <div className="text-4xl md:text-7xl font-bold dark:text-white text-center">
          World ID Verification
        </div>
        <div className="font-extralight text-lg md:text-2xl dark:text-neutral-200 py-4 text-center max-w-lg">
          Securely verify your identity with World ID and access the decentralized web
        </div>
        
        {!isVerified ? (
          <WorldIDLogin onSuccess={handleLoginSuccess} />
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-effect border-2 border-emerald-500/30 bg-emerald-500/10 p-6 rounded-lg w-full max-w-md backdrop-blur-sm"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Icons.checkCircle className="h-5 w-5" />
                <span className="font-semibold">Verification Successful</span>
              </div>
            </div>
            
            <div className="text-sm text-slate-300 mb-4">
              Your session is now active. Session Key:
            </div>
            
            <div className="bg-slate-800/50 p-3 rounded-lg mb-4 break-all text-xs font-mono text-slate-200 border border-slate-600/30">
              {sessionKey}
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={copySessionKey}
                variant="outline"
                size="sm"
                className="flex-1 bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white"
              >
                <Icons.copy className="mr-2 h-4 w-4" />
                Copy Key
              </Button>
              <Button 
                onClick={() => {setIsVerified(false); setSessionKey("")}}
                variant="outline"
                size="sm"
                className="flex-1 bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white"
              >
                New Session
              </Button>
            </div>
          </motion.div>
        )}
        
        <p className="text-sm text-slate-400 max-w-md">
          World ID provides privacy-preserving identity verification using zero-knowledge proofs. 
          Your personal information is never shared.
        </p>
      </motion.div>
    </AuroraBackground>
  )
}
