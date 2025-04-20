"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import { Card, CardContent } from "@/components/ui/card"

const teamMembers = [
  {
    name: "Dr. Emma Clarke",
    role: "Quantum Cryptography Lead",
    bio: "Ph.D. in Quantum Information Science with 10+ years experience in quantum cryptography systems.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Michael Chen",
    role: "Security Engineer",
    bio: "Expert in network security architecture with a focus on implementing quantum-resistant protocols.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Sophia Rodriguez",
    role: "Quantum Algorithm Developer",
    bio: "Specializes in designing efficient quantum algorithms for security applications and key distribution.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "James Wilson",
    role: "Product Manager",
    bio: "Brings quantum security solutions to market with a background in cybersecurity compliance.",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export function TeamSection() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Team</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Meet the quantum security experts behind QBit Secure
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 py-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
