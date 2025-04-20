"use client"

import { motion } from "framer-motion"
import { LockKeyhole, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-background to-secondary/20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">QBit Secure</h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Quantum Key Distribution for unbreakable security. Protect your data with the power of quantum physics.
              </p>
            </div>
            <motion.div
              className="flex items-center space-x-4 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-primary" />
                <span>Quantum-Safe</span>
              </div>
              <div className="flex items-center space-x-1">
                <LockKeyhole className="h-4 w-4 text-primary" />
                <span>End-to-End Encryption</span>
              </div>
            </motion.div>
          </div>
          <motion.div
            className="mx-auto w-full max-w-[400px] relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <QuantumAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function QuantumAnimation() {
  return (
    <div className="relative h-[300px] w-full rounded-lg overflow-hidden border bg-background/50 backdrop-blur-sm">
      <motion.div
        className="absolute h-8 w-8 rounded-full bg-primary/50 blur-sm"
        animate={{
          x: [0, 240, 240, 0, 0],
          y: [0, 0, 160, 160, 0],
          scale: [1, 1.2, 1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute h-8 w-8 rounded-full bg-blue-500/50 blur-sm"
        animate={{
          x: [240, 0, 0, 240, 240],
          y: [0, 0, 160, 160, 0],
          scale: [1, 1.2, 1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 shadow-lg"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">QKD Secure Connection</div>
    </div>
  )
}
