"use client"

import { motion } from "framer-motion"
import { ArrowRight, Check, KeyRound, Lock, Shield, Sparkles } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InfoPage() {
  return (
    <div className="container px-4 py-12 md:py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Quantum Key Distribution (QKD)</h1>
          <p className="text-xl text-muted-foreground">
            The future of secure communications leveraging the principles of quantum mechanics
          </p>

          <Tabs defaultValue="overview" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="how">How It Works</TabsTrigger>
              <TabsTrigger value="advantages">Advantages</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-6">
              <div className="space-y-6">
                <p>
                  Quantum Key Distribution (QKD) is a secure communication method that implements a cryptographic
                  protocol involving components of quantum mechanics. It enables two parties to produce a shared random
                  secret key known only to them, which can then be used to encrypt and decrypt messages.
                </p>
                <p>
                  The security of QKD relies on the fundamental aspects of quantum physics rather than the computational
                  complexity of mathematical problems. This makes QKD theoretically immune to increasing computational
                  power and quantum computing attacks.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-2xl flex items-center">
                        <Shield className="mr-2 h-5 w-5 text-primary" />
                        Quantum Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Unlike traditional encryption, quantum encryption is secure against all computational attacks,
                        including those from future quantum computers.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-2xl flex items-center">
                        <Lock className="mr-2 h-5 w-5 text-primary" />
                        Intrusion Detection
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        QKD can detect any eavesdropping attempt, as the very act of measuring a quantum system disturbs
                        it in a detectable way.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="how" className="space-y-6 pt-6">
              <p>
                QKD works by transmitting individual light particles (photons) over a fiber optic cable from one party
                to another. Each photon represents a single bit of data - either 0 or 1. These photons are prepared in
                specific quantum states.
              </p>
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-background">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <KeyRound className="mr-2 h-5 w-5 text-primary" />
                    The BB84 Protocol
                  </h3>
                  <p className="mb-2">
                    The most widely used QKD protocol, created by Charles Bennett and Gilles Brassard in 1984:
                  </p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Alice (sender) generates random bits and encodes them into photons using random bases.</li>
                    <li>Bob (receiver) measures these photons using randomly chosen bases.</li>
                    <li>Alice and Bob publicly compare the bases they used (but not the actual bits).</li>
                    <li>They keep only the bits where they happened to use the same basis.</li>
                    <li>This subset of bits becomes their shared secret key.</li>
                  </ol>
                </div>
                <div className="rounded-lg border p-4 bg-background">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-primary" />
                    Quantum Properties Used
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Quantum Superposition:</strong> Particles exist in multiple states simultaneously until
                        measured.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Heisenberg Uncertainty Principle:</strong> Measuring one property of a quantum particle
                        affects other properties.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>No-Cloning Theorem:</strong> It's impossible to create an identical copy of an unknown
                        quantum state.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="advantages" className="space-y-6 pt-6">
              <p>QKD offers several significant advantages over traditional key distribution methods:</p>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Unconditional Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Security based on the laws of physics rather than computational complexity, making it immune to
                      advances in computing power or algorithms.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Eavesdropping Detection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Any interception attempt can be detected because measuring quantum states introduces detectable
                      anomalies.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Future-Proof</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Resistant to quantum computing attacks that threaten traditional public key cryptography.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Perfect Forward Secrecy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Keys are continuously generated and discarded, minimizing the impact of any potential compromise.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="applications" className="space-y-6 pt-6">
              <p>QKD is being deployed in various sectors where long-term data security is paramount:</p>
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-background">
                  <h3 className="text-lg font-semibold mb-2">Financial Institutions</h3>
                  <p>
                    Banks and financial services use QKD to secure transactions, customer data, and inter-bank
                    communications.
                  </p>
                </div>
                <div className="rounded-lg border p-4 bg-background">
                  <h3 className="text-lg font-semibold mb-2">Government & Defense</h3>
                  <p>
                    Classified communications and critical infrastructure protection rely on QKD's enhanced security.
                  </p>
                </div>
                <div className="rounded-lg border p-4 bg-background">
                  <h3 className="text-lg font-semibold mb-2">Healthcare</h3>
                  <p>Protection of sensitive patient data and secure telemedicine applications.</p>
                </div>
                <div className="rounded-lg border p-4 bg-background">
                  <h3 className="text-lg font-semibold mb-2">Data Centers</h3>
                  <p>Securing cloud storage and data transmission between distributed data centers.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href="/simulation"
                className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Try QKD Simulation
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
