"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Key, RefreshCw, AlertTriangle, BarChart } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Quantum Key Distribution",
    description: "Generate unbreakable encryption keys using the principles of quantum mechanics.",
    icon: Key,
  },
  {
    title: "Eavesdropping Detection",
    description: "Automatically detect any attempts to intercept your quantum-secured communications.",
    icon: AlertTriangle,
  },
  {
    title: "Real-time Monitoring",
    description: "Monitor your quantum network security status with comprehensive dashboards.",
    icon: BarChart,
  },
  {
    title: "Quantum-Safe Encryption",
    description: "Protect your data against both conventional and quantum computing threats.",
    icon: Shield,
  },
  {
    title: "Automatic Key Rotation",
    description: "Regularly refresh encryption keys to maintain the highest level of security.",
    icon: RefreshCw,
  },
  {
    title: "End-to-End Encryption",
    description: "Secure your data from source to destination with no vulnerable points.",
    icon: Lock,
  },
]

export function FeatureSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore the cutting-edge quantum security features that make QBit Secure the leader in post-quantum
              cryptography
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 py-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <feature.icon className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
