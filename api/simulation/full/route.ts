import type { NextRequest } from "next/server"
import { runFullSimulation } from "../../../controllers/simulation"

export async function POST(request: NextRequest) {
  return runFullSimulation(request)
}
